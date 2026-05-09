"use client";

import { motion } from "motion/react";
import type { Achievement } from "../data/mock";

interface AchievementsStripProps {
  achievements: Achievement[];
}

export function AchievementsStrip({ achievements }: AchievementsStripProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-mono tracking-widest uppercase text-secondary">
          Achievements
        </h2>
        <span className="text-xs text-tertiary">
          <span className="text-primary font-semibold">{unlockedCount}</span>
          /{achievements.length} unlocked
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 20,
              delay: i * 0.07,
            }}
            className="shrink-0 w-28 p-3.5 flex flex-col items-center gap-2 text-center"
            style={{
              borderRadius: "20px",
              backgroundColor: "var(--color-surface-raised)",
              border: achievement.unlocked
                ? "1px solid rgba(90, 158, 248, 0.3)"
                : "1px solid rgba(255,255,255,0.06)",
              opacity: achievement.unlocked ? 1 : 0.42,
            }}
          >
            {/* Icon — floats when unlocked */}
            <span
              className="text-2xl leading-none"
              style={
                achievement.unlocked
                  ? {
                      display: "inline-block",
                      animation: `float 3s ease-in-out ${i * 0.35}s infinite`,
                    }
                  : undefined
              }
            >
              {achievement.unlocked ? achievement.icon : "🔒"}
            </span>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-primary leading-tight">{achievement.title}</p>
              <p className="text-[10px] text-tertiary leading-tight">{achievement.description}</p>
            </div>

            {achievement.unlocked && achievement.date ? (
              <p className="text-[9px] text-accent font-semibold">{achievement.date}</p>
            ) : (
              <p className="text-[9px] text-tertiary">Locked</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
