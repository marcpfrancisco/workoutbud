"use client";

import Model from "react-body-highlighter";
import type { IMuscleStats } from "react-body-highlighter";
import { motion } from "motion/react";
import { dbMusclesToHighlightData } from "../data/muscle-map";
import type { DbMuscleId, BodyView, LibraryMuscleId } from "../types";

interface BodyMapProps {
  view: BodyView;
  onViewChange: (v: BodyView) => void;
  selectedMuscles: DbMuscleId[];
  onMuscleClick: (libId: LibraryMuscleId) => void;
}

export function BodyMap({ view, onViewChange, selectedMuscles, onMuscleClick }: BodyMapProps) {
  function handleClick({ muscle }: IMuscleStats) {
    onMuscleClick(muscle as LibraryMuscleId);
  }

  return (
    <div>
      {/* Front / Back toggle */}
      <div className="flex rounded-[--radius-sm] bg-surface-raised p-0.5 gap-0.5 w-fit mx-auto mb-4">
        {(["anterior", "posterior"] as BodyView[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-5 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
              view === v ? "bg-accent-dim text-accent" : "text-secondary"
            }`}
          >
            {v === "anterior" ? "Front" : "Back"}
          </button>
        ))}
      </div>

      {/* Body figure — keyed on view for fade transition */}
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex justify-center"
      >
        <Model
          type={view}
          data={dbMusclesToHighlightData(selectedMuscles)}
          bodyColor="#202020"
          highlightedColors={["#5A9EF8"]}
          onClick={handleClick}
          style={{ height: "260px", cursor: "pointer" }}
        />
      </motion.div>
    </div>
  );
}
