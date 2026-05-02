"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/core/supabase/client";
import { useBodyMap } from "@/modules/library/hooks/useBodyMap";
import { useExercises } from "@/modules/library/hooks/useExercises";
import { BodyMap } from "@/modules/library/components/BodyMap";
import { ExerciseList } from "@/modules/library/components/ExerciseList";
import { MUSCLE_DISPLAY_NAMES } from "@/modules/library/data/muscle-map";

export default function LibraryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { view, setView, selectedMuscles, toggleMuscleByLibraryId, removeMuscle, clearMuscles } =
    useBodyMap();

  const { exercises, isLoading, isError } = useExercises(userId, {
    search,
    selectedMuscles,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
  }, []);

  return (
    <main className="min-h-screen bg-canvas pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-canvas border-b border-white/[0.06] px-4 pt-4 pb-3 space-y-3">
        <h1 className="text-lg font-semibold text-primary tracking-tight">Library</h1>
        <input
          type="search"
          placeholder="Search exercises…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="field"
        />
      </div>

      {/* Body map */}
      <div className="px-4 pt-5">
        <BodyMap
          view={view}
          onViewChange={setView}
          selectedMuscles={selectedMuscles}
          onMuscleClick={toggleMuscleByLibraryId}
        />

        {/* Selected muscle chips */}
        {selectedMuscles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedMuscles.map((muscle) => (
              <button
                key={muscle}
                onClick={() => removeMuscle(muscle)}
                className="flex items-center gap-1.5 px-3 py-1 bg-accent-dim text-accent text-xs font-medium rounded-full"
              >
                {MUSCLE_DISPLAY_NAMES[muscle]}
                <span className="opacity-60 text-sm leading-none">×</span>
              </button>
            ))}
            <button
              onClick={clearMuscles}
              className="px-3 py-1 text-secondary text-xs rounded-full border border-white/10 hover:border-white/20 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-4 mt-5 mb-4" />

      {/* Exercise list */}
      <div className="px-4">
        <ExerciseList exercises={exercises} isLoading={isLoading} isError={isError} />
      </div>
    </main>
  );
}
