import {
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

// ========================================
// Get weekday from Date (0=Sun, 1=Mon, ..., 6=Sat)
// ========================================
export function getWeekday(date: Date): number {
  return date.getDay();
}

// ========================================
// Map routine type to section key
// ========================================
function getRoutineSectionKey(type: Routine["type"]): string {
  const mapping: Record<Routine["type"], string> = {
    skin: "Skincare",
    hair: "Haircare",
    body: "Bodycare",
    bodySpecific: "Body Specifics",
    wellness: "Wellness",
    workout: "Workout",
    food: "Food Plan",
  };
  return mapping[type];
}

// ========================================
// Check if routine matches schedule for given weekday
// ========================================
function matchesSchedule(routine: Routine, weekday: number): boolean {
  const { schedule } = routine;

  // Direct weekday match
  if (schedule.weekday && schedule.weekday.includes(weekday)) {
    return true;
  }

  // Frequency-based (simplified: assume it matches if frequency > 0)
  if (schedule.frequencyPerWeek && schedule.frequencyPerWeek > 0) {
    return true;
  }

  // Cycle-based (simplified: assume it matches)
  if (schedule.cycleDay && schedule.cycleDay.length > 0) {
    return true;
  }

  return false;
}

// ========================================
// Check if routine matches time of day filter
// ========================================
function matchesTimeOfDay(routine: Routine, filter: TimeOfDay): boolean {
  if (filter === "ANY") return true;
  if (routine.timeOfDay === "ANY") return true;
  return routine.timeOfDay === filter;
}

// ========================================
// Check if routine matches flag filters
// ========================================
function matchesFlags(
  routine: Routine,
  flags: Filters["flags"]
): boolean {
  // If no flags are set, match all routines
  const anyFlagSet = flags.office || flags.wfh || flags.travel || flags.goingOut;
  if (!anyFlagSet) return true;

  // Check if routine supports at least one active flag
  if (flags.office && routine.tags.office) return true;
  if (flags.wfh && routine.tags.wfh) return true;
  if (flags.travel && routine.tags.travel) return true;
  if (flags.goingOut && routine.tags.goingOut) return true;

  // If flags are set but routine doesn't match any, exclude it
  return false;
}

// ========================================
// Enrich steps with product details
// ========================================
function enrichSteps(
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
// Filter steps for Travel mode (first 2 steps only)
// ========================================
function filterForTravel(steps: RoutineStep[]): RoutineStep[] {
  // Take only first 2 steps for simplified travel routines
  return steps.slice(0, 2);
}

// ========================================
// Filter body-specific steps by selected areas
// ========================================
function filterByBodyAreas(
  routine: Routine,
  steps: RoutineStep[],
  selectedAreas: BodyArea[]
): RoutineStep[] {
  if (routine.type !== "bodySpecific") return steps;
  if (selectedAreas.length === 0) return steps;

  return steps.filter((step) => {
    // Keep steps without body area restrictions
    if (!step.bodyAreas || step.bodyAreas.length === 0) return true;
    // Keep steps that match at least one selected area
    return step.bodyAreas.some((ba) => selectedAreas.includes(ba));
  });
}

// ========================================
// Check for product conflicts (e.g., Tret + AHA/BHA)
// ========================================
function checkConflicts(
  selectedRoutines: Routine[],
  products: Product[],
  flags: Filters["flags"]
): string[] {
  const warnings: string[] = [];

  // Collect all PM routines
  const pmRoutines = selectedRoutines.filter(
    (r) => r.timeOfDay === "PM" || r.timeOfDay === "ANY"
  );

  // Get all active ingredients used in PM
  const pmActives = new Set<string>();
  const pmProductIds = new Set<string>();

  pmRoutines.forEach((routine) => {
    routine.steps?.forEach((step) => {
      (step.productIds || []).forEach((pid) => {
        pmProductIds.add(pid);
        const product = products.find((p) => p.id === pid);
        if (product) {
          product.actives?.forEach((a) => pmActives.add(a));
        }
      });
    });
  });

  // Rule 1: Tretinoin + AHA/BHA Peel same PM
  const hasTret = pmProductIds.has("p-tret") || pmActives.has("Tretinoin");
  const hasPeel =
    pmProductIds.has("p-peel-aha-bha") ||
    pmActives.has("AHA") ||
    pmActives.has("BHA");

  if (hasTret && hasPeel) {
    warnings.push(
      "⚠️ Conflict: Tretinoin and AHA/BHA peel should not be used the same night. Risk of irritation and compromised skin barrier."
    );
  }

  // Rule 2: Going Out + Strong Actives in PM
  if (flags.goingOut) {
    const hasStrongActive = Array.from(pmProductIds).some((pid) => {
      const product = products.find((p) => p.id === pid);
      return product?.cautionTags?.includes("strong-active");
    });

    if (hasStrongActive) {
      warnings.push(
        "💡 Suggestion: You're going out tonight. Consider using mild products (peptides) instead of strong actives (tretinoin, peels) for a fresh look."
      );
    }


  }

  // Rule 3: Travel mode notice
  if (flags.travel) {
    warnings.push(
      "✈️ Travel mode: Showing first 2 steps only. Additional steps are hidden to simplify your routine."
    );
  }

  return warnings;
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

  // ----------------------------------------
  // Step 1: Filter routines by schedule, time, and flags
  // ----------------------------------------
  const matchingRoutines = routines.filter((routine) => {
    const matchSchedule = matchesSchedule(routine, weekday);
    const matchTime = matchesTimeOfDay(routine, timeOfDay);
    const matchFlag = matchesFlags(routine, flags);

    return matchSchedule && matchTime && matchFlag;
  });

  // ----------------------------------------
  // Step 2: Check for conflicts and generate warnings
  // ----------------------------------------
  const warnings = checkConflicts(matchingRoutines, products, flags);

  // ----------------------------------------
  // Step 3: Build sections
  // ----------------------------------------
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

    // Apply travel filter
    if (flags.travel) {
      steps = filterForTravel(steps);
    }

    // Apply body area filter for body-specific routines
    steps = filterByBodyAreas(routine, steps, bodyAreas);

    // Enrich steps with product details
    const enrichedSteps = enrichSteps(steps, products);

    // Get section key
    const sectionKey = getRoutineSectionKey(routine.type);

    // Add to section
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

  // ----------------------------------------
  // Step 4: Return plan
  // ----------------------------------------
  return {
    warnings: Array.from(new Set(warnings)), // Deduplicate
    sections: Object.values(sectionMap),
  };
}
