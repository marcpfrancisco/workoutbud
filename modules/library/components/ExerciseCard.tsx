"use client";

import { useState } from "react";
import { motion } from "motion/react";
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

interface ExerciseCardProps {
  exercise: LibraryExercise;
  index: number;
  onTap?: () => void;
}

export function ExerciseCard({ exercise, index, onTap }: ExerciseCardProps) {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);

  const muscleLabel = exercise.muscleGroups
    .slice(0, 3)
    .map((m) => MUSCLE_DISPLAY_NAMES[m])
    .join(" · ");

  const showGif = exercise.gifUrl && !gifError;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay: Math.min(index * 0.04, 0.3) }}
      onClick={onTap}
      className="card p-4 flex items-center gap-4 w-full text-left active:opacity-75 transition-opacity"
    >
      {/* GIF / placeholder slot */}
      <div className="relative w-14 h-14 shrink-0">
        {showGif ? (
          <>
            {!gifLoaded && (
              <div className="absolute inset-0 bg-surface-raised animate-pulse rounded-[--radius-sm]" />
            )}
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              loading="lazy"
              className={`w-14 h-14 rounded-[--radius-sm] object-cover transition-opacity duration-200 ${
                gifLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setGifLoaded(true)}
              onError={() => setGifError(true)}
            />
          </>
        ) : (
          <div className="w-14 h-14 bg-surface-raised rounded-[--radius-sm] flex items-center justify-center">
            <span className="text-tertiary text-xl">⊕</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-primary truncate">{exercise.name}</p>
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent shrink-0">
            {CATEGORY_LABELS[exercise.category] ?? exercise.category}
          </span>
        </div>
        <p className="text-xs text-secondary mt-0.5 truncate">{muscleLabel}</p>
      </div>
    </motion.button>
  );
}
