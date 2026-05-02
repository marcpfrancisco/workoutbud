"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { db } from "@/core/db/schema";
import type { LibraryExercise, ExerciseFilters, ExerciseCategory } from "../types";
import type { DbMuscleId } from "../types";

interface SupabaseExerciseRow {
  id: string;
  name: string;
  muscle_groups: string[];
  category: string;
  gif_url: string | null;
  instructions: string | null;
  is_global: boolean;
  user_id: string | null;
  created_at: string;
}

function mapRow(row: SupabaseExerciseRow): LibraryExercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroups: row.muscle_groups as DbMuscleId[],
    category: row.category as ExerciseCategory,
    gifUrl: row.gif_url ?? undefined,
    instructions: row.instructions ?? undefined,
    isGlobal: row.is_global,
    userId: row.user_id ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

interface UseExercisesReturn {
  exercises: LibraryExercise[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useExercises(
  userId: string | null,
  filters: ExerciseFilters
): UseExercisesReturn {
  const { data, isLoading, isError, error } = useQuery<LibraryExercise[], Error>({
    queryKey: ["exercises"],
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      try {
        const supabase = createClient();
        const query = supabase.from("exercises").select("*").eq("is_global", true);

        const withUser =
          userId
            ? supabase
                .from("exercises")
                .select("*")
                .or(`is_global.eq.true,user_id.eq.${userId}`)
            : query;

        const { data: rows, error: supabaseError } = await withUser;

        if (supabaseError) throw new Error(supabaseError.message);

        const mapped = (rows as SupabaseExerciseRow[]).map(mapRow);
        await db.exercises.bulkPut(
          mapped.map((e) => ({
            ...e,
            createdAt: e.createdAt,
          }))
        );
        return mapped;
      } catch {
        // Offline fallback — serve from Dexie
        const cached = await db.exercises.toArray();
        if (cached.length === 0) throw new Error("No cached exercises available offline.");
        return cached as unknown as LibraryExercise[];
      }
    },
  });

  const exercises = useMemo(() => {
    let results: LibraryExercise[] = data ?? [];

    if (filters.search.trim().length > 0) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((e) => e.name.toLowerCase().includes(q));
    }

    if (filters.selectedMuscles.length > 0) {
      results = results.filter((e) =>
        // OR within selected muscles: show exercises that work ANY of the selected muscles
        e.muscleGroups.some((m) => filters.selectedMuscles.includes(m))
      );
    }

    return results;
  }, [data, filters.search, filters.selectedMuscles]);

  return { exercises, isLoading, isError, error: error ?? null };
}
