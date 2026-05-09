"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { WeekStrip } from "@/modules/dashboard/components/WeekStrip";
import { CalendarModal } from "@/modules/dashboard/components/CalendarModal";
import { DailyChallenges } from "@/modules/dashboard/components/DailyChallenges";
import { QuickStart } from "@/modules/dashboard/components/QuickStart";
import { AchievementsStrip } from "@/modules/dashboard/components/AchievementsStrip";
import {
  MOCK_WORKOUT_DAYS,
  MOCK_STREAK,
  DAILY_CHALLENGES,
  ACHIEVEMENTS,
  MOCK_LAST_SESSION,
} from "@/modules/dashboard/data/mock";

function useGreeting() {
  const [greeting, setGreeting] = useState("Hey,");
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning,");
    else if (h < 17) setGreeting("Good afternoon,");
    else setGreeting("Good evening,");
  }, []);
  return greeting;
}

function useTimeDecor() {
  const [decor, setDecor] = useState("✦");
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 6) setDecor("🌙");
    else if (h < 12) setDecor("🌤");
    else if (h < 17) setDecor("☀️");
    else if (h < 20) setDecor("🌇");
    else setDecor("🌙");
  }, []);
  return decor;
}

function useFormattedDate() {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);
  return date;
}

function streakMotivation(streak: number): string {
  if (streak >= 30) return "Absolutely unstoppable 🏆";
  if (streak >= 14) return "Two weeks and still grinding 💎";
  if (streak >= 7) return "One week strong ⚡";
  if (streak >= 3) return "Building momentum 🔥";
  return "Let's get moving 💪";
}

export default function HomePage() {
  const greeting = useGreeting();
  const formattedDate = useFormattedDate();
  const timeDecor = useTimeDecor();
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-canvas pb-28 px-4 pt-6">

      {/* ── Greeting ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative mb-6"
      >
        {/* Decorative time icon — very subtle, top-right anchor */}
        <span
          className="absolute right-0 -top-1 leading-none select-none pointer-events-none"
          style={{ fontSize: "5rem", opacity: 0.055 }}
          aria-hidden
        >
          {timeDecor}
        </span>

        <p className="text-xs text-tertiary font-mono tracking-widest uppercase mb-1.5">
          {greeting}
        </p>
        <h1 className="text-[2.2rem] font-black text-primary tracking-tight leading-none">
          Dev User
        </h1>
        <p className="text-xs text-secondary mt-2">{formattedDate}</p>
        <p className="text-xs text-tertiary mt-0.5">{streakMotivation(MOCK_STREAK)}</p>
      </motion.div>

      {/* ── Featured streak + supporting stats ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.08 }}
        className="flex gap-3 mb-5"
      >
        {/* Streak hero tile */}
        <div
          className="card-raised flex-[1.5] flex flex-col items-center justify-center gap-2 py-5 px-4 text-center"
          style={{
            background:
              "linear-gradient(160deg, var(--color-surface-overlay) 0%, var(--color-surface-raised) 100%)",
          }}
        >
          <span className="animate-fire text-5xl leading-none">🔥</span>
          <div>
            <p className="text-5xl font-black text-primary tabular-nums leading-none">
              {MOCK_STREAK}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1.5">
              day streak
            </p>
          </div>
        </div>

        {/* Supporting stats — stacked */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="card-raised flex-1 flex flex-col items-center justify-center py-4 text-center">
            <p className="text-2xl font-black text-primary tabular-nums leading-none">
              {MOCK_LAST_SESSION.sets}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1">
              last sets
            </p>
          </div>
          <div className="card-raised flex-1 flex flex-col items-center justify-center py-4 text-center">
            <p className="text-2xl font-black text-primary tabular-nums leading-none">
              {MOCK_LAST_SESSION.durationMinutes}
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-tertiary mt-1">
              min
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Week strip ────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.13 }}
        className="card p-4 mb-5"
      >
        <WeekStrip
          workoutDays={MOCK_WORKOUT_DAYS}
          streak={MOCK_STREAK}
          onOpenCalendar={() => setCalendarOpen(true)}
        />
      </motion.section>

      {/* ── Quick start ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.17 }}
        className="mb-5"
      >
        <QuickStart lastSession={MOCK_LAST_SESSION} />
      </motion.div>

      {/* ── Daily challenges ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut", delay: 0.21 }}
        className="mb-5"
      >
        <DailyChallenges challenges={DAILY_CHALLENGES} />
      </motion.section>

      {/* ── Achievements ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.25 }}
      >
        <AchievementsStrip achievements={ACHIEVEMENTS} />
      </motion.section>

      {/* Calendar modal */}
      <CalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        workoutDays={MOCK_WORKOUT_DAYS}
      />
    </main>
  );
}
