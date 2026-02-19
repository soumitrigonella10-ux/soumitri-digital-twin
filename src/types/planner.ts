// ========================================
// Computed Plan Types & Filter State
// ========================================

import type { BodyArea, Product, RoutineStep, TimeOfDay } from "./routines";

// ========================================
// Filter State
// ========================================
export interface Filters {
  date: Date;
  timeOfDay: TimeOfDay;
  flags: {
    office: boolean;
    wfh: boolean;
    travel: boolean;
    goingOut: boolean;
  };
  occasion: string;
  bodyAreas: BodyArea[];
}

// ========================================
// Computed Plan Types
// ========================================
export interface EnrichedStep extends RoutineStep {
  products: Product[];
}

export interface PlanRoutine {
  routineId: string;
  name: string;
  steps: EnrichedStep[];
}

export interface PlanSection {
  key: string;
  routines: PlanRoutine[];
  totalSteps: number;
}

export interface DayPlan {
  warnings: string[];
  sections: PlanSection[];
}

// ========================================
// Preset for saved filter configurations
// ========================================
export interface FilterPreset {
  name: string;
  filters: Omit<Filters, "date"> & { date: string };
}

// ========================================
// Completion tracking
// ========================================
export type CompletionMap = Record<
  string, // dateKey (yyyy-MM-dd)
  Record<
    string, // sectionKey
    Record<
      string, // routineId
      Record<number, boolean> // stepOrder => done
    >
  >
>;
