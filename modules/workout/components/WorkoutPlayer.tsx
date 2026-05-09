"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useWorkoutStore } from "../store";
import { useRestTimer } from "../hooks/useRestTimer";
import { useGhostPB } from "../hooks/useGhostPB";
import { useSessionClock } from "../hooks/useSessionClock";
import { SetLogger } from "./SetLogger";
import { SetHistory } from "./SetHistory";
import { RestTimerOverlay } from "./RestTimerOverlay";

function GifDisplay({ gifUrl, name }: { gifUrl?: string; name: string }) {
  if (!gifUrl) {
    return (
      <div className="w-full h-44 bg-surface-raised rounded-[--radius-md] flex items-center justify-center">
        <span className="text-5xl opacity-20">⊕</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 bg-surface-raised rounded-[--radius-md] overflow-hidden">
      <Image
        src={gifUrl}
        alt={name}
        fill
        unoptimized
        className="object-contain"
        priority
      />
    </div>
  );
}

export function WorkoutPlayer() {
  const router = useRouter();
  useRestTimer();

  const exercises = useWorkoutStore((s) => s.exercises);
  const currentIndex = useWorkoutStore((s) => s.currentIndex);
  const startedAt = useWorkoutStore((s) => s.startedAt);
  const status = useWorkoutStore((s) => s.status);
  const goToExercise = useWorkoutStore((s) => s.goToExercise);
  const finishSession = useWorkoutStore((s) => s.finishSession);
  const resetSession = useWorkoutStore((s) => s.resetSession);

  const clock = useSessionClock(startedAt);
  const currentExercise = exercises[currentIndex];
  const pb = useGhostPB(currentExercise?.exerciseId ?? null);

  // Pre-fetch GIFs for all exercises in the session
  useEffect(() => {
    exercises.forEach((ex) => {
      if (ex.gifUrl) {
        const img = new window.Image();
        img.src = ex.gifUrl;
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises.length]);

  async function handleFinish() {
    await finishSession();
  }

  function handleClose() {
    router.push("/");
  }

  function handleNewSession() {
    resetSession();
    router.push("/");
  }

  // Completion screen
  if (status === "complete") {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <p className="text-5xl mb-4">🏆</p>
          <h2 className="text-xl font-semibold text-primary mb-1">Session Complete</h2>
          <p className="text-sm text-secondary mb-1">Duration: {clock}</p>
          <p className="text-xs text-tertiary mb-8">Data saved and queued for sync.</p>
          <button onClick={handleNewSession} className="btn px-8 py-3 text-sm">
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="relative min-h-screen bg-canvas flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
        <button
          onClick={handleClose}
          className="text-secondary hover:text-primary transition-colors p-1"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 5l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="text-sm font-mono text-secondary tabular-nums">{clock}</span>

        <button
          onClick={handleFinish}
          className="text-xs font-semibold text-accent px-3 py-1.5 bg-accent-dim rounded-[--radius-sm]"
        >
          Finish
        </button>
      </div>

      {/* Exercise name + progress */}
      <div className="px-5 mb-3 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-tertiary">
            Exercise {currentIndex + 1} of {exercises.length}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentExercise.exerciseId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-xl font-semibold text-primary leading-tight"
          >
            {currentExercise.name}
          </motion.h1>
        </AnimatePresence>

        {/* Ghost PB */}
        {pb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised rounded-[--radius-sm]"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-tertiary">PB</span>
            <span className="text-xs font-semibold text-primary">
              {pb.weight} kg × {pb.reps}
            </span>
          </motion.div>
        )}
      </div>

      {/* GIF */}
      <div className="px-5 mb-4 shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.exerciseId + "-gif"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GifDisplay gifUrl={currentExercise.gifUrl} name={currentExercise.name} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Set history */}
        <div className="mb-3">
          <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary px-5 mb-2">
            This session
          </p>
          <SetHistory />
        </div>

        {/* Set logger */}
        <SetLogger />
      </div>

      {/* Exercise navigation */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06] shrink-0">
        <button
          onClick={() => goToExercise(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 text-sm text-secondary disabled:opacity-25 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L6 8l4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Prev
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {exercises.map((_, i) => (
            <button
              key={i}
              onClick={() => goToExercise(i)}
              className={`rounded-full transition-all ${
                i === currentIndex
                  ? "w-4 h-2 bg-accent"
                  : "w-2 h-2 bg-surface-overlay hover:bg-surface-raised"
              }`}
              aria-label={`Go to exercise ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goToExercise(currentIndex + 1)}
          disabled={currentIndex === exercises.length - 1}
          className="flex items-center gap-1.5 text-sm text-secondary disabled:opacity-25 transition-opacity"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Rest timer overlay — sits above the nav bar */}
      <RestTimerOverlay />
    </div>
  );
}
