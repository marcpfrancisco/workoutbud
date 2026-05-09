"use client";

import { AnimatePresence, motion } from "motion/react";
import { useWorkoutStore } from "../store";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RestTimerOverlay() {
  const status = useWorkoutStore((s) => s.status);
  const restSecondsRemaining = useWorkoutStore((s) => s.restSecondsRemaining);
  const restTotalSeconds = useWorkoutStore((s) => s.restTotalSeconds);
  const skipRest = useWorkoutStore((s) => s.skipRest);
  const exercises = useWorkoutStore((s) => s.exercises);
  const currentIndex = useWorkoutStore((s) => s.currentIndex);

  const nextExercise = exercises[currentIndex + 1];
  const progress = restTotalSeconds > 0 ? restSecondsRemaining / restTotalSeconds : 0;
  const circumference = 2 * Math.PI * 54; // r=54

  return (
    <AnimatePresence>
      {status === "resting" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="absolute inset-x-0 bottom-0 z-20 bg-surface rounded-t-[--radius-lg] px-6 pt-8 pb-10"
        >
          {/* Circular countdown */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4">
              <svg width="128" height="128" className="-rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="#202020"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="#5A9EF8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary tabular-nums">
                  {formatTime(restSecondsRemaining)}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary">
              Rest
            </p>

            {nextExercise && (
              <p className="text-xs text-secondary mt-2">
                Up next: <span className="text-primary font-medium">{nextExercise.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={skipRest}
            className="w-full py-3 rounded-[--radius-sm] border border-white/10 text-sm text-secondary hover:border-white/20 hover:text-primary transition-colors"
          >
            Skip Rest
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
