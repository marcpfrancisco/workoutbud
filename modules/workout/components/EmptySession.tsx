"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { db } from "@/core/db/schema";
import { useWorkoutStore } from "../store";
import type { SessionExercise } from "../types";

const QUICK_START_NAMES = [
  "Barbell Bench Press",
  "Incline Dumbbell Press",
  "Overhead Press",
  "Tricep Pushdown",
  "Lateral Raise",
];

export function EmptySession() {
  const startSession = useWorkoutStore((s) => s.startSession);
  const [loading, setLoading] = useState(false);
  const [exerciseCount, setExerciseCount] = useState<number | null>(null);

  useEffect(() => {
    db.exercises.count().then(setExerciseCount).catch(() => setExerciseCount(0));
  }, []);

  async function handleQuickStart() {
    setLoading(true);
    try {
      const all = await db.exercises.toArray();

      // Try to match the quick-start list by name; fall back to first 5 exercises
      const matched = QUICK_START_NAMES.map((name) =>
        all.find((e) => e.name.toLowerCase() === name.toLowerCase())
      ).filter(Boolean);

      const source = matched.length >= 3 ? matched : all.slice(0, 5);

      const exercises: SessionExercise[] = source.map((e) => ({
        exerciseId: e!.id,
        name: e!.name,
        gifUrl: e!.gifUrl,
        muscleGroups: e!.muscleGroups,
        targetSets: 3,
        targetReps: 8,
        restSeconds: 90,
      }));

      if (exercises.length === 0) return;

      await startSession(exercises);
    } finally {
      setLoading(false);
    }
  }

  const libraryEmpty = exerciseCount === 0;

  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm text-center"
      >
        <p className="text-5xl mb-5">💪</p>
        <h1 className="text-xl font-semibold text-primary mb-2">Ready to train?</h1>
        <p className="text-sm text-secondary mb-8 leading-relaxed">
          {libraryEmpty
            ? "Visit the Library first to load exercises, then come back to start your session."
            : "Start a quick push-day session or browse the library to build your own."}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleQuickStart}
            disabled={loading || libraryEmpty}
            className={`w-full py-3.5 rounded-[--radius-sm] text-sm font-semibold transition-opacity ${
              loading || libraryEmpty
                ? "bg-surface-raised text-tertiary opacity-50 cursor-not-allowed"
                : "bg-accent text-white"
            }`}
          >
            {loading ? "Loading…" : "Quick Start — Push Day"}
          </button>

          <Link
            href="/library"
            className="block w-full py-3.5 rounded-[--radius-sm] text-sm font-medium text-secondary border border-white/10 hover:border-white/20 transition-colors"
          >
            Browse Library
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
