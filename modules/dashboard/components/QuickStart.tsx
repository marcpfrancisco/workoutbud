"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { MockLastSession } from "../data/mock";

interface QuickStartProps {
  lastSession: MockLastSession;
}

export function QuickStart({ lastSession }: QuickStartProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[--radius-lg] border border-white/[0.07]"
      style={{
        background:
          "linear-gradient(145deg, var(--color-surface-raised) 0%, var(--color-surface) 100%)",
      }}
    >
      {/* Accent left bar */}
      <div
        className="absolute left-0 inset-y-0 w-1 bg-accent"
        style={{ borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)" }}
      />

      {/* Decorative background emoji */}
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[7rem] leading-none select-none pointer-events-none rotate-12"
        style={{ opacity: 0.045 }}
        aria-hidden
      >
        💪
      </span>

      <div className="relative p-5 pl-7">
        {/* Label + name */}
        <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mb-1.5">
          Last Session
        </p>
        <h3 className="text-xl font-black text-primary leading-tight mb-5">
          {lastSession.routineName}
        </h3>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 mb-6 divide-x divide-white/[0.07]">
          <div className="text-center pr-3">
            <p className="text-3xl font-black text-primary tabular-nums leading-none">
              {lastSession.durationMinutes}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1.5">
              min
            </p>
          </div>
          <div className="text-center px-3">
            <p className="text-3xl font-black text-primary tabular-nums leading-none">
              {lastSession.sets}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1.5">
              sets
            </p>
          </div>
          <div className="text-center pl-3">
            <p className="text-3xl font-black text-primary tabular-nums leading-none">
              {lastSession.exercises}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1.5">
              exercises
            </p>
          </div>
        </div>

        {/* CTA */}
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            href="/workout"
            className="block w-full py-3.5 text-sm font-bold bg-accent text-white rounded-[--radius-sm] text-center"
          >
            Start Again
          </Link>
        </motion.div>

        <Link
          href="/routine"
          className="block w-full mt-3 text-xs font-medium text-secondary text-center hover:text-primary transition-colors"
        >
          Browse routines →
        </Link>
      </div>
    </div>
  );
}
