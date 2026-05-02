import type { DbMuscleId, LibraryMuscleId } from "../types";
import type { IExerciseData } from "react-body-highlighter";

export const DB_TO_LIBRARY_MAP: Record<DbMuscleId, LibraryMuscleId> = {
  chest: "chest",
  "upper-chest": "chest", // no separate upper-chest path in the library
  "front-delts": "front-deltoids",
  "side-delts": "front-deltoids", // no lateral-delt path; front-deltoids is closest
  "rear-delts": "back-deltoids",
  shoulders: "front-deltoids",
  triceps: "triceps",
  biceps: "biceps",
  brachialis: "biceps", // sits beneath biceps visually
  lats: "upper-back",
  traps: "trapezius",
  "lower-back": "lower-back",
  "rotator-cuff": "trapezius", // no rotator-cuff path; trapezius is nearest shoulder region
  abs: "abs",
  core: "abs", // no deep-core path
  quads: "quadriceps",
  hamstrings: "hamstring",
  glutes: "gluteal",
  calves: "calves",
  "hip-flexors": "adductor", // no hip-flexor path; adductor is closest
};

export const MUSCLE_DISPLAY_NAMES: Record<DbMuscleId, string> = {
  chest: "Chest",
  "upper-chest": "Upper Chest",
  "front-delts": "Front Delts",
  "side-delts": "Side Delts",
  "rear-delts": "Rear Delts",
  shoulders: "Shoulders",
  triceps: "Triceps",
  biceps: "Biceps",
  brachialis: "Brachialis",
  lats: "Lats",
  traps: "Traps",
  "lower-back": "Lower Back",
  "rotator-cuff": "Rotator Cuff",
  abs: "Abs",
  core: "Core",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  "hip-flexors": "Hip Flexors",
};

/** Converts selected DB muscle IDs into the data prop format react-body-highlighter expects. */
export function dbMusclesToHighlightData(muscles: DbMuscleId[]): IExerciseData[] {
  const seen = new Set<LibraryMuscleId>();
  const result: IExerciseData[] = [];

  for (const m of muscles) {
    const libId = DB_TO_LIBRARY_MAP[m];
    if (!seen.has(libId)) {
      seen.add(libId);
      result.push({ name: `_sel_${libId}`, muscles: [libId], frequency: 1 });
    }
  }

  return result;
}

/** Returns all DB muscle IDs that visually map to the given library path. */
export function libraryIdToDbMuscles(libId: LibraryMuscleId): DbMuscleId[] {
  return (Object.entries(DB_TO_LIBRARY_MAP) as [DbMuscleId, LibraryMuscleId][])
    .filter(([, mapped]) => mapped === libId)
    .map(([db]) => db);
}
