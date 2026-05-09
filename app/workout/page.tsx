"use client";

import { useWorkoutStore } from "@/modules/workout/store";
import { WorkoutPlayer } from "@/modules/workout/components/WorkoutPlayer";
import { WorkoutErrorBoundary } from "@/modules/workout/components/WorkoutErrorBoundary";
import { EmptySession } from "@/modules/workout/components/EmptySession";

export default function WorkoutPage() {
  const status = useWorkoutStore((s) => s.status);

  if (status === "idle") {
    return <EmptySession />;
  }

  return (
    <WorkoutErrorBoundary>
      <WorkoutPlayer />
    </WorkoutErrorBoundary>
  );
}
