import { create } from "zustand";
import { db } from "@/core/db/schema";
import type { SetLog } from "@/core/db/schema";
import type { SessionExercise, LoggedSet, SessionStatus } from "./types";

interface WorkoutSessionState {
  sessionId: string | null;
  routineId: string | null;
  userId: string | null;
  exercises: SessionExercise[];
  currentIndex: number;
  loggedSets: LoggedSet[];
  startedAt: number | null;
  status: SessionStatus;
  restSecondsRemaining: number;
  restTotalSeconds: number;

  startSession: (
    exercises: SessionExercise[],
    opts?: { routineId?: string; userId?: string }
  ) => Promise<void>;
  logSet: (reps?: number, weight?: number) => void;
  startRest: (seconds: number) => void;
  tickRest: () => void;
  skipRest: () => void;
  goToExercise: (index: number) => void;
  finishSession: () => Promise<void>;
  resetSession: () => void;
}

export const useWorkoutStore = create<WorkoutSessionState>()((set, get) => ({
  sessionId: null,
  routineId: null,
  userId: null,
  exercises: [],
  currentIndex: 0,
  loggedSets: [],
  startedAt: null,
  status: "idle",
  restSecondsRemaining: 0,
  restTotalSeconds: 0,

  startSession: async (exercises, opts) => {
    const sessionId = crypto.randomUUID();
    const startedAt = Date.now();

    await db.workoutLogs.add({
      id: sessionId,
      userId: opts?.userId ?? "anonymous",
      routineId: opts?.routineId,
      startedAt,
      sets: [],
      synced: false,
    });

    set({
      sessionId,
      routineId: opts?.routineId ?? null,
      userId: opts?.userId ?? null,
      exercises,
      currentIndex: 0,
      loggedSets: [],
      startedAt,
      status: "active",
      restSecondsRemaining: 0,
      restTotalSeconds: 0,
    });
  },

  logSet: (reps, weight) => {
    const state = get();
    if (state.status !== "active" || !state.sessionId) return;

    const currentExercise = state.exercises[state.currentIndex];
    if (!currentExercise) return;

    const setNumber =
      state.loggedSets.filter((s) => s.exerciseId === currentExercise.exerciseId).length + 1;

    const newSet: LoggedSet = {
      id: crypto.randomUUID(),
      exerciseId: currentExercise.exerciseId,
      setNumber,
      reps,
      weight,
      completedAt: Date.now(),
    };

    set((s) => ({ loggedSets: [...s.loggedSets, newSet] }));

    // Persist to Dexie immediately — offline-first
    const dexieSet: SetLog = {
      exerciseId: newSet.exerciseId,
      setNumber: newSet.setNumber,
      reps: newSet.reps,
      weight: newSet.weight,
      completedAt: newSet.completedAt,
    };
    db.workoutLogs
      .where("id")
      .equals(state.sessionId)
      .modify((log) => {
        log.sets.push(dexieSet);
      })
      .catch(console.error);

    // Auto-start rest timer after logging a set
    get().startRest(currentExercise.restSeconds);
  },

  startRest: (seconds) => {
    set({ status: "resting", restSecondsRemaining: seconds, restTotalSeconds: seconds });
  },

  tickRest: () => {
    const { restSecondsRemaining } = get();
    if (restSecondsRemaining <= 1) {
      // Fire haptic feedback — rest timer complete
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      set({ status: "active", restSecondsRemaining: 0 });
    } else {
      set((s) => ({ restSecondsRemaining: s.restSecondsRemaining - 1 }));
    }
  },

  skipRest: () => {
    set({ status: "active", restSecondsRemaining: 0 });
  },

  goToExercise: (index) => {
    const { exercises } = get();
    if (index < 0 || index >= exercises.length) return;
    set({ currentIndex: index, status: "active", restSecondsRemaining: 0 });
  },

  finishSession: async () => {
    const state = get();
    if (!state.sessionId || !state.startedAt) return;

    const completedAt = Date.now();
    await db.workoutLogs.update(state.sessionId, { completedAt, synced: false });

    const log = await db.workoutLogs.get(state.sessionId);
    if (log) {
      // Vibrate on workout complete
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([100, 50, 100, 50, 300]);
      }
      await db.syncOutbox.add({
        table: "workout_logs",
        operation: "create",
        payload: log,
        createdAt: Date.now(),
        retries: 0,
      });
    }

    set({ status: "complete" });
  },

  resetSession: () => {
    set({
      sessionId: null,
      routineId: null,
      userId: null,
      exercises: [],
      currentIndex: 0,
      loggedSets: [],
      startedAt: null,
      status: "idle",
      restSecondsRemaining: 0,
      restTotalSeconds: 0,
    });
  },
}));
