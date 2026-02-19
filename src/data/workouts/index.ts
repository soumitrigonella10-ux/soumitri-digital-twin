// ========================================
// Workouts — Barrel Export
// ========================================
import { WorkoutPlan } from "@/types";
import { lowerBodyWorkouts } from "./lower-body";
import { upperBodyWorkouts } from "./upper-body";
import { coreWorkouts } from "./core";
import { recoveryWorkouts } from "./recovery";

/** Combined weekly workout plan (Mon–Sun) */
export const workouts: WorkoutPlan[] = [
  ...lowerBodyWorkouts,
  ...upperBodyWorkouts,
  ...coreWorkouts,
  ...recoveryWorkouts,
];

// Re-export sub-category arrays for granular access
export { lowerBodyWorkouts } from "./lower-body";
export { upperBodyWorkouts } from "./upper-body";
export { coreWorkouts } from "./core";
export { recoveryWorkouts } from "./recovery";
