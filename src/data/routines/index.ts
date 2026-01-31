// Re-export all routine categories
export { skinRoutines } from "./skin";
export { hairRoutines } from "./hair";
export { bodyRoutines } from "./body";
export { bodySpecificsRoutines } from "./body-specifics";
export { wellnessRoutines } from "./wellness";
export { workoutRoutines } from "./workout";
export { foodRoutines } from "./food";

// Combined routines array for backward compatibility
import { skinRoutines } from "./skin";
import { hairRoutines } from "./hair";
import { bodyRoutines } from "./body";
import { bodySpecificsRoutines } from "./body-specifics";
import { wellnessRoutines } from "./wellness";
import { workoutRoutines } from "./workout";
import { foodRoutines } from "./food";
import { Routine } from "@/types";

export const routines: Routine[] = [
  ...skinRoutines,
  ...hairRoutines,
  ...bodyRoutines,
  ...bodySpecificsRoutines,
  ...wellnessRoutines,
  ...workoutRoutines,
  ...foodRoutines,
];
