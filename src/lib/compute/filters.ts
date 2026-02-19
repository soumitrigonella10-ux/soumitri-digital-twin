import type { BodyArea, Routine, RoutineStep } from "@/types";

// ========================================
// Step Filtering
// ========================================

/** Filter steps for Travel mode (first 2 steps only) */
export function filterForTravel(steps: RoutineStep[]): RoutineStep[] {
  return steps.slice(0, 2);
}

/** Filter body-specific steps by selected areas */
export function filterByBodyAreas(
  routine: Routine,
  steps: RoutineStep[],
  selectedAreas: BodyArea[]
): RoutineStep[] {
  if (routine.type !== "bodySpecific") return steps;
  if (selectedAreas.length === 0) return steps;

  return steps.filter((step) => {
    if (!step.bodyAreas || step.bodyAreas.length === 0) return true;
    return step.bodyAreas.some((ba) => selectedAreas.includes(ba));
  });
}
