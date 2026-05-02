"use client";

import { useState, useCallback } from "react";
import type { DbMuscleId, BodyView } from "../types";
import type { LibraryMuscleId } from "../types";
import { libraryIdToDbMuscles } from "../data/muscle-map";

interface UseBodyMapReturn {
  view: BodyView;
  setView: (v: BodyView) => void;
  selectedMuscles: DbMuscleId[];
  toggleMuscleByLibraryId: (libId: LibraryMuscleId) => void;
  removeMuscle: (muscle: DbMuscleId) => void;
  clearMuscles: () => void;
}

export function useBodyMap(): UseBodyMapReturn {
  const [view, setView] = useState<BodyView>("anterior");
  const [selectedMuscles, setSelectedMuscles] = useState<DbMuscleId[]>([]);

  const toggleMuscleByLibraryId = useCallback((libId: LibraryMuscleId) => {
    const dbIds = libraryIdToDbMuscles(libId);
    setSelectedMuscles((prev) => {
      const allSelected = dbIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !dbIds.includes(id));
      }
      const toAdd = dbIds.filter((id) => !prev.includes(id));
      return [...prev, ...toAdd];
    });
  }, []);

  const removeMuscle = useCallback((muscle: DbMuscleId) => {
    setSelectedMuscles((prev) => prev.filter((m) => m !== muscle));
  }, []);

  const clearMuscles = useCallback(() => setSelectedMuscles([]), []);

  return { view, setView, selectedMuscles, toggleMuscleByLibraryId, removeMuscle, clearMuscles };
}
