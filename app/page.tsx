"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas pb-24 px-4 pt-8 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-semibold text-primary tracking-tight">WorkoutBud</h1>
        <p className="text-secondary text-sm mt-1">Offline-first. Built for iron.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
        className="space-y-3"
      >
        <Link href="/library" className="card p-5 flex items-center justify-between group block">
          <div>
            <p className="text-sm font-medium text-primary">Exercise Library</p>
            <p className="text-xs text-secondary mt-0.5">Browse & filter 40+ exercises</p>
          </div>
          <span className="text-tertiary group-hover:text-secondary transition-colors text-lg">›</span>
        </Link>

        <div className="card p-5 flex items-center justify-between opacity-40 cursor-not-allowed">
          <div>
            <p className="text-sm font-medium text-primary">Start Workout</p>
            <p className="text-xs text-secondary mt-0.5">Coming in Phase 3</p>
          </div>
          <span className="text-tertiary text-lg">›</span>
        </div>

        <div className="card p-5 flex items-center justify-between opacity-40 cursor-not-allowed">
          <div>
            <p className="text-sm font-medium text-primary">Routines</p>
            <p className="text-xs text-secondary mt-0.5">Coming in Phase 4</p>
          </div>
          <span className="text-tertiary text-lg">›</span>
        </div>
      </motion.div>
    </main>
  );
}
