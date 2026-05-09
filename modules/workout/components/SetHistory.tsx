"use client";

import { motion } from "motion/react";
import { useWorkoutStore } from "../store";

export function SetHistory() {
  const exercises = useWorkoutStore((s) => s.exercises);
  const currentIndex = useWorkoutStore((s) => s.currentIndex);
  const loggedSets = useWorkoutStore((s) => s.loggedSets);

  const currentExercise = exercises[currentIndex];
  if (!currentExercise) return null;

  const sets = loggedSets.filter((s) => s.exerciseId === currentExercise.exerciseId);

  if (sets.length === 0) {
    return (
      <p className="text-xs text-tertiary text-center py-3 px-5">
        No sets logged yet — start below.
      </p>
    );
  }

  return (
    <div className="px-5 space-y-1.5">
      {sets.map((set, i) => (
        <motion.div
          key={set.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center justify-between py-2 px-3 bg-surface-raised rounded-[--radius-sm]"
        >
          <span className="text-xs text-tertiary font-mono">Set {set.setNumber}</span>
          <span className="text-sm font-medium text-primary">
            {set.weight !== undefined ? `${set.weight} kg` : "—"}
            <span className="text-tertiary mx-1">×</span>
            {set.reps !== undefined ? set.reps : "—"}
          </span>
          <span className="text-success text-xs">✓</span>
        </motion.div>
      ))}
    </div>
  );
}
