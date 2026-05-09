"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DailyChallenge } from "../data/mock";

interface DailyChallengesProps {
  challenges: DailyChallenge[];
}

export function DailyChallenges({ challenges }: DailyChallengesProps) {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(challenges.filter((c) => c.completed).map((c) => c.id))
  );

  const doneCount = completed.size;
  const earnedPoints = challenges.reduce(
    (sum, c) => (completed.has(c.id) ? sum + c.points : sum),
    0
  );
  const progressPct = (doneCount / challenges.length) * 100;

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] font-mono tracking-widest uppercase text-secondary">
          Daily Challenges
        </h2>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-tertiary">{doneCount}/{challenges.length} done</span>
          <span className="text-xs font-black text-accent">+{earnedPoints} pts</span>
        </div>
      </div>

      {/* Shimmer progress bar */}
      <div className="h-2 bg-surface-raised rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-accent rounded-full relative overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="shimmer-child" />
        </motion.div>
      </div>

      {/* Challenge list */}
      <div className="space-y-2.5">
        {challenges.map((challenge, i) => {
          const done = completed.has(challenge.id);
          return (
            <motion.button
              key={challenge.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={{ scale: 0.975 }}
              onClick={() => toggle(challenge.id)}
              className={`card w-full p-4 flex items-center gap-3.5 text-left transition-opacity ${
                done ? "opacity-50" : ""
              }`}
            >
              <span className="text-2xl shrink-0 leading-none">{challenge.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    done ? "line-through text-secondary" : "text-primary"
                  }`}
                >
                  {challenge.title}
                </p>
                <p className="text-xs text-tertiary mt-0.5 truncate">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-tertiary font-mono">+{challenge.points}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    done ? "bg-accent border-accent" : "border-white/20"
                  }`}
                >
                  <AnimatePresence>
                    {done && (
                      <motion.svg
                        key="check"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
