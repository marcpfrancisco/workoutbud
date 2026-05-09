"use client";

import { useEffect } from "react";
import { useWorkoutStore } from "../store";

/** Drives the rest countdown — ticks the store every second while status is 'resting'. */
export function useRestTimer() {
  const status = useWorkoutStore((s) => s.status);
  const tickRest = useWorkoutStore((s) => s.tickRest);

  useEffect(() => {
    if (status !== "resting") return;

    const id = setInterval(tickRest, 1000);
    return () => clearInterval(id);
  }, [status, tickRest]);
}
