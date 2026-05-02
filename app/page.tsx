"use client";

import { motion } from "motion/react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card p-10 text-center space-y-3 w-full max-w-xs"
      >
        <p className="text-tertiary text-xs font-mono tracking-widest uppercase">
          System Online
        </p>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">WorkoutBud</h1>
        <p className="text-secondary text-sm leading-relaxed">
          Offline-first. Built for iron.
        </p>
      </motion.div>
    </main>
  );
}
