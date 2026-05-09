"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { MUSCLE_DISPLAY_NAMES } from "../data/muscle-map";
import type { LibraryExercise } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  core: "Core",
  cardio: "Cardio",
  other: "Other",
};

interface ExerciseDetailSheetProps {
  exercise: LibraryExercise | null;
  onClose: () => void;
}

function SheetContent({ exercise, onClose }: { exercise: LibraryExercise; onClose: () => void }) {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);
  const showGif = !!exercise.gifUrl && !gifError;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-[--radius-lg] max-h-[88vh] flex flex-col"
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 shrink-0">
        <div className="w-9 h-1 bg-surface-overlay rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
        <h2 className="text-base font-semibold text-primary pr-4 leading-tight">
          {exercise.name}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 pb-10">
        {/* GIF */}
        <div className="px-5">
          <div className="relative w-full h-52 bg-surface-raised rounded-[--radius-md] overflow-hidden">
            {showGif ? (
              <>
                {!gifLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-surface-overlay" />
                )}
                <Image
                  src={exercise.gifUrl!}
                  alt={exercise.name}
                  fill
                  unoptimized
                  className={`object-contain transition-opacity duration-300 ${
                    gifLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setGifLoaded(true)}
                  onError={() => setGifError(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-4xl opacity-20">⊕</span>
                <p className="text-tertiary text-xs">No preview available</p>
              </div>
            )}
          </div>
        </div>

        {/* Category + muscle chips */}
        <div className="px-5 pt-5">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-accent bg-accent-dim px-2.5 py-1 rounded-[--radius-sm]">
              {CATEGORY_LABELS[exercise.category] ?? exercise.category}
            </span>
            {exercise.muscleGroups.map((m) => (
              <span
                key={m}
                className="text-[10px] font-medium text-secondary border border-white/10 px-2.5 py-1 rounded-[--radius-sm]"
              >
                {MUSCLE_DISPLAY_NAMES[m]}
              </span>
            ))}
          </div>

          {/* Instructions */}
          <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mb-3">
            How to perform
          </p>
          {exercise.instructions ? (
            <p className="text-sm text-secondary leading-relaxed">{exercise.instructions}</p>
          ) : (
            <p className="text-sm text-tertiary">No instructions available for this exercise.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ExerciseDetailSheet({ exercise, onClose }: ExerciseDetailSheetProps) {
  return (
    <AnimatePresence>
      {exercise && (
        <>
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <SheetContent key={exercise.id} exercise={exercise} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  );
}
