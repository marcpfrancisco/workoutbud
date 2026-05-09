"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { PanInfo } from "motion/react";

interface WeekStripProps {
  workoutDays: number[];
  streak: number;
  onOpenCalendar: () => void;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getWeekDays(weekOffset: number): Array<{ date: Date; dayOffset: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dow = today.getDay();
  const mondayShift = dow === 0 ? -6 : 1 - dow;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayShift + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dayOffset = Math.round((date.getTime() - today.getTime()) / 86_400_000);
    return { date, dayOffset };
  });
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function WeekStrip({ workoutDays, streak, onOpenCalendar }: WeekStripProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const days = getWeekDays(weekOffset);
  const canGoForward = weekOffset < 0;

  const weekLabel =
    weekOffset === 0
      ? "This Week"
      : weekOffset === -1
        ? "Last Week"
        : `${Math.abs(weekOffset)} weeks ago`;

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x > 60) {
      setWeekOffset((prev) => prev - 1);
    } else if (info.offset.x < -60 && canGoForward) {
      setWeekOffset((prev) => prev + 1);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-primary">{weekLabel}</span>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-surface-overlay rounded-full">
            <span className="animate-fire text-sm">🔥</span>
            <span className="text-xs font-bold text-primary">{streak}</span>
          </div>
        </div>
        <button
          onClick={onOpenCalendar}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary border border-white/10 rounded-[--radius-sm] hover:border-white/20 hover:text-primary transition-colors"
        >
          <CalendarIcon />
          Calendar
        </button>
      </div>

      {/* Draggable day row */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="flex justify-between touch-pan-y select-none cursor-grab active:cursor-grabbing"
      >
        {days.map(({ date, dayOffset }, i) => {
          const isToday = dayOffset === 0;
          const hasWorkout = workoutDays.includes(dayOffset);
          const isStreak = hasWorkout && dayOffset >= -streak;
          const isFuture = dayOffset > 0;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 py-1">
              {/* Day label */}
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  isToday ? "text-accent" : "text-tertiary"
                }`}
              >
                {DAY_LABELS[i]}
              </span>

              {/* Date circle — filled accent + ping ring for today */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                {isToday && (
                  <span className="absolute inset-0 rounded-full bg-accent animate-ping-slow" />
                )}
                <div
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center ${
                    isToday ? "bg-accent" : ""
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      isToday ? "text-white" : isFuture ? "text-tertiary" : "text-primary"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              </div>

              {/* Workout indicator */}
              <div className="h-3.5 flex items-center justify-center">
                {isStreak ? (
                  <span className="text-xs leading-none">🔥</span>
                ) : hasWorkout ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-60" />
                ) : null}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Week nav dots */}
      <div className="flex justify-center gap-2 mt-4">
        {([-3, -2, -1, 0] as const).map((offset) => (
          <button
            key={offset}
            onClick={() => setWeekOffset(offset)}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              weekOffset === offset ? "w-6 bg-accent" : "w-2 bg-white/20 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
