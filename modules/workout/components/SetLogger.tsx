"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useWorkoutStore } from "../store";

export function SetLogger() {
  const logSet = useWorkoutStore((s) => s.logSet);
  const status = useWorkoutStore((s) => s.status);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  function handleLog() {
    const w = weight !== "" ? parseFloat(weight) : undefined;
    const r = reps !== "" ? parseInt(reps, 10) : undefined;
    logSet(r, w);
    // Keep weight prefilled for next set, clear reps
    setReps("");
  }

  const canLog = status === "active" && (weight !== "" || reps !== "");

  return (
    <div className="px-5 pt-4">
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-[10px] font-mono tracking-widest uppercase text-tertiary mb-1.5">
            Weight (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            placeholder="—"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="field text-center text-lg font-semibold"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-mono tracking-widest uppercase text-tertiary mb-1.5">
            Reps
          </label>
          <input
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            placeholder="—"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="field text-center text-lg font-semibold"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLog}
        disabled={!canLog}
        className={`w-full py-3.5 rounded-[--radius-sm] text-sm font-semibold transition-opacity ${
          canLog
            ? "bg-accent text-white"
            : "bg-surface-raised text-tertiary opacity-50 cursor-not-allowed"
        }`}
      >
        Log Set
      </motion.button>
    </div>
  );
}
