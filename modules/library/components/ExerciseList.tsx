"use client";

import { ExerciseCard } from "./ExerciseCard";
import type { LibraryExercise } from "../types";

interface ExerciseListProps {
  exercises: LibraryExercise[];
  isLoading: boolean;
  isError: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-[--radius-md] h-[74px] animate-pulse" />
  );
}

export function ExerciseList({ exercises, isLoading, isError }: ExerciseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-secondary text-sm text-center py-8">
        Could not load exercises. Check your connection.
      </p>
    );
  }

  if (exercises.length === 0) {
    return (
      <p className="text-secondary text-sm text-center py-8">No exercises match.</p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-tertiary text-xs mb-3">
        {exercises.length === 1 ? "1 exercise" : `${exercises.length} exercises`}
      </p>
      {exercises.map((exercise, index) => (
        <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
      ))}
    </div>
  );
}
