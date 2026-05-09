"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutDays: number[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function CalendarModal({ isOpen, onClose, workoutDays }: CalendarModalProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstWeekday = getFirstWeekday(viewYear, viewMonth);

  const workoutDateStrings = new Set(
    workoutDays.map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      return d.toDateString();
    })
  );

  const canGoForward =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (!canGoForward) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-[--radius-lg] px-5 pt-4 pb-safe"
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="p-2 text-secondary hover:text-primary transition-colors rounded-[--radius-sm]"
              >
                <ChevronLeft />
              </button>
              <span className="text-sm font-semibold text-primary">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                disabled={!canGoForward}
                className={`p-2 rounded-[--radius-sm] transition-colors ${
                  canGoForward
                    ? "text-secondary hover:text-primary"
                    : "text-tertiary cursor-not-allowed"
                }`}
              >
                <ChevronRight />
              </button>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 mb-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-tertiary py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1 pb-6">
              {Array.from({ length: firstWeekday }, (_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const cellDate = new Date(viewYear, viewMonth, dayNum);
                cellDate.setHours(0, 0, 0, 0);
                const isToday = cellDate.toDateString() === today.toDateString();
                const hasWorkout = workoutDateStrings.has(cellDate.toDateString());
                const isFuture = cellDate > today;

                return (
                  <div
                    key={dayNum}
                    className={`aspect-square flex flex-col items-center justify-center rounded-[6px] relative ${
                      isToday ? "bg-accent-dim" : hasWorkout ? "bg-surface-raised" : ""
                    } ${isFuture ? "opacity-25" : ""}`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isToday ? "text-accent" : hasWorkout ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {hasWorkout && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent opacity-70" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
