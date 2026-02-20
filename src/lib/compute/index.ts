// ========================================
// Compute — Barrel Export
//
// Day plan computation: schedule matching, filtering,
// conflict detection, and step enrichment.
// ========================================
import type {
  BodyArea,
  DayPlan,
  EnrichedStep,
  Filters,
  PlanSection,
  Product,
  Routine,
  RoutineStep,
  TimeOfDay,
} from "@/types";

import { getWeekday, getRoutineSectionKey, matchesSchedule, matchesTimeOfDay, matchesFlags } from "./schedule";
import { checkConflicts } from "./conflicts";

// Re-export everything for granular access
export { getWeekday, getRoutineSectionKey, matchesSchedule, matchesTimeOfDay, matchesFlags } from "./schedule";
export { checkConflicts } from "./conflicts";

// ========================================
// Step Filtering (inlined from filters.ts)
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

// ========================================
// Step Enrichment (inlined from enrichment.ts)
// ========================================

/** Enrich steps with product details */
export function enrichSteps(
  steps: RoutineStep[],
  products: Product[]
): EnrichedStep[] {
  return steps.map((step) => ({
    ...step,
    products: (step.productIds || [])
      .map((pid) => products.find((p) => p.id === pid))
      .filter((p): p is Product => p !== undefined),
  }));
}

// ========================================
// Main Compute Function
// ========================================
export interface ComputeDayPlanParams {
  date: Date;
  timeOfDay: TimeOfDay;
  flags: Filters["flags"];
  occasion: string;
  bodyAreas: BodyArea[];
  products: Product[];
  routines: Routine[];
}

export function computeDayPlan(params: ComputeDayPlanParams): DayPlan {
  const { date, timeOfDay, flags, bodyAreas, products, routines } = params;
  const weekday = getWeekday(date);

  // Step 1: Filter routines by schedule, time, and flags
  const matchingRoutines = routines.filter((routine) => {
    const matchSchedule = matchesSchedule(routine, weekday);
    const matchTime = matchesTimeOfDay(routine, timeOfDay);
    const matchFlag = matchesFlags(routine, flags);
    return matchSchedule && matchTime && matchFlag;
  });

  // Step 2: Check for conflicts and generate warnings
  const warnings = checkConflicts(matchingRoutines, products, flags);

  // Step 3: Build sections
  const sectionMap: Record<string, PlanSection> = {
    Skincare: { key: "Skincare", routines: [], totalSteps: 0 },
    Haircare: { key: "Haircare", routines: [], totalSteps: 0 },
    Bodycare: { key: "Bodycare", routines: [], totalSteps: 0 },
    "Body Specifics": { key: "Body Specifics", routines: [], totalSteps: 0 },
    Wellness: { key: "Wellness", routines: [], totalSteps: 0 },
    Workout: { key: "Workout", routines: [], totalSteps: 0 },
    "Food Plan": { key: "Food Plan", routines: [], totalSteps: 0 },
    Wardrobe: { key: "Wardrobe", routines: [], totalSteps: 0 },
  };

  matchingRoutines.forEach((routine) => {
    let steps = [...(routine.steps || [])];

    if (flags.travel) {
      steps = filterForTravel(steps);
    }

    steps = filterByBodyAreas(routine, steps, bodyAreas);

    const enrichedSteps = enrichSteps(steps, products);
    const sectionKey = getRoutineSectionKey(routine.type);

    if (sectionMap[sectionKey]) {
      sectionMap[sectionKey].routines.push({
        routineId: routine.id,
        name: routine.name,
        steps: enrichedSteps,
      });
      sectionMap[sectionKey].totalSteps += enrichedSteps.length;
    }
  });

  // Add placeholder for Wardrobe section
  sectionMap.Wardrobe!.routines.push({
    routineId: "wardrobe-placeholder",
    name: "Check /wardrobe for outfit suggestions",
    steps: [],
  });

  // Step 4: Return plan
  return {
    warnings: Array.from(new Set(warnings)),
    sections: Object.values(sectionMap),
  };
}
