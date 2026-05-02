export type DbMuscleId =
  | "chest"
  | "upper-chest"
  | "front-delts"
  | "side-delts"
  | "rear-delts"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "brachialis"
  | "lats"
  | "traps"
  | "lower-back"
  | "rotator-cuff"
  | "abs"
  | "core"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "hip-flexors";

export type LibraryMuscleId =
  | "chest"
  | "trapezius"
  | "upper-back"
  | "lower-back"
  | "biceps"
  | "triceps"
  | "forearm"
  | "back-deltoids"
  | "front-deltoids"
  | "abs"
  | "obliques"
  | "adductor"
  | "hamstring"
  | "quadriceps"
  | "abductors"
  | "calves"
  | "gluteal"
  | "head"
  | "neck";

export type ExerciseCategory = "push" | "pull" | "legs" | "core" | "cardio" | "other";

export type BodyView = "anterior" | "posterior";

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroups: DbMuscleId[];
  category: ExerciseCategory;
  gifUrl?: string;
  instructions?: string;
  isGlobal: boolean;
  userId?: string;
  createdAt: number;
}

export interface ExerciseFilters {
  search: string;
  selectedMuscles: DbMuscleId[];
  selectedCategories: ExerciseCategory[];
}
