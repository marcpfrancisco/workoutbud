import Dexie from "dexie";
import type { Table } from "dexie";

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  category: string;
  gifUrl?: string;
  instructions?: string;
  isGlobal: boolean;
  userId?: string;
  createdAt: number;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
  order: number;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: number;
  updatedAt: number;
}

export interface SetLog {
  exerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  completedAt: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId?: string;
  startedAt: number;
  completedAt?: number;
  sets: SetLog[];
  synced: boolean;
}

export interface SyncOutboxItem {
  id?: number;
  table: string;
  operation: "create" | "update" | "delete";
  payload: unknown;
  createdAt: number;
  retries: number;
  error?: string;
}

export interface SyncError {
  id?: number;
  message: string;
  table: string;
  payload: unknown;
  occurredAt: number;
}

class WorkoutBudDB extends Dexie {
  exercises!: Table<Exercise, string>;
  routines!: Table<Routine, string>;
  workoutLogs!: Table<WorkoutLog, string>;
  syncOutbox!: Table<SyncOutboxItem, number>;
  syncErrors!: Table<SyncError, number>;

  constructor() {
    super("workoutbud");
    this.version(1).stores({
      exercises: "id, name, category, isGlobal, userId, *muscleGroups",
      routines: "id, userId, updatedAt",
      workoutLogs: "id, userId, routineId, startedAt, synced",
      syncOutbox: "++id, table, createdAt",
      syncErrors: "++id, occurredAt",
    });
  }
}

export const db = new WorkoutBudDB();
