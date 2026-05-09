export interface SessionExercise {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  muscleGroups: string[];
  targetSets: number;
  targetReps?: number;
  restSeconds: number;
}

export interface LoggedSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  completedAt: number;
}

export type SessionStatus = "idle" | "active" | "resting" | "complete";
