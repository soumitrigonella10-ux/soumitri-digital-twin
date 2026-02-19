// ========================================
// Routine & Product Domain Types
// ========================================

export type TimeOfDay = "AM" | "MIDDAY" | "PM" | "ANY";

export type RoutineType =
  | "skin"
  | "hair"
  | "body"
  | "bodySpecific"
  | "wellness"
  | "workout"
  | "food";

export type BodyArea = "UA" | "IT" | "BL" | "IA" | "B&S";

export type HairPhase = "oiling" | "washing" | "postWash" | "daily";

// ========================================
// Product
// ========================================
export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  shade?: string;
  actives?: string[];
  cautionTags?: string[];
  routineType?: RoutineType;
  bodyAreas?: BodyArea[];
  hairPhase?: HairPhase;
  timeOfDay?: TimeOfDay;
  weekdays?: number[];
  displayOrder?: number;
  notes?: string;
}

// ========================================
// Routine Step
// ========================================
export interface RoutineStep {
  order: number;
  title: string;
  description?: string;
  durationMin?: number;
  productIds?: string[];
  bodyAreas?: BodyArea[];
  weekdaysOnly?: number[];
  essential?: boolean;
}

// ========================================
// Routine
// ========================================
export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  schedule: {
    weekday?: number[];
    cycleDay?: number[];
    frequencyPerWeek?: number;
  };
  timeOfDay: TimeOfDay;
  tags: {
    office?: boolean;
    wfh?: boolean;
    travel?: boolean;
    goingOut?: boolean;
  };
  occasion?: string[];
  productIds?: string[];
  steps?: RoutineStep[];
  notes?: string;
}
