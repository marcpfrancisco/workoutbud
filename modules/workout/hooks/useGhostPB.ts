"use client";

import { useState, useEffect } from "react";
import { db } from "@/core/db/schema";
import type { SetLog } from "@/core/db/schema";

interface GhostPB {
  weight: number;
  reps: number;
}

/** Returns the personal best (heaviest single set) for an exercise from past workout logs. */
export function useGhostPB(exerciseId: string | null): GhostPB | null {
  const [pb, setPb] = useState<GhostPB | null>(null);

  useEffect(() => {
    if (!exerciseId) {
      setPb(null);
      return;
    }

    db.workoutLogs
      .toArray()
      .then((logs) => {
        const allSets: SetLog[] = logs.flatMap((log) =>
          log.sets.filter((s) => s.exerciseId === exerciseId)
        );

        // Best set = highest weight; tie-break by most reps
        const best = allSets.reduce<SetLog | null>((prev, curr) => {
          if (!prev) return curr;
          const prevScore = (prev.weight ?? 0) * 1000 + (prev.reps ?? 0);
          const currScore = (curr.weight ?? 0) * 1000 + (curr.reps ?? 0);
          return currScore > prevScore ? curr : prev;
        }, null);

        if (best && best.weight !== undefined && best.reps !== undefined) {
          setPb({ weight: best.weight, reps: best.reps });
        } else {
          setPb(null);
        }
      })
      .catch(() => setPb(null));
  }, [exerciseId]);

  return pb;
}
