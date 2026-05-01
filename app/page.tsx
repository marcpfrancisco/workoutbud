"use client";

import { motion } from "motion/react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="holo-border glow-cyan rounded-holo p-10 text-center space-y-4 w-full max-w-xs"
      >
        <p className="text-muted text-xs font-mono tracking-widest uppercase">
          System Online
        </p>
        <h1 className="text-4xl font-bold text-neon-cyan text-glow-cyan tracking-tight">
          WorkoutBud
        </h1>
        <p className="text-ghost-white/50 text-sm leading-relaxed">
          Offline-first. Holographic.
          <br />
          Built for iron.
        </p>
      </motion.div>
    </main>
  );
}
