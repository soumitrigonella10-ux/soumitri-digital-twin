// ========================================
// Core Type Definitions for Routines + Wardrobe App
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

export type BodyArea = "UA" | "IT" | "BL" | "IA" | "B";

export type HairPhase = "oiling" | "washing" | "postWash" | "daily";

export type WardrobeCategory = 
  | "Top" 
  | "Bottom" 
  | "Dress" 
  | "Shoes" 
  | "Accessories" 
  | "Outerwear";

export type ModestyLevel = "Low" | "Medium" | "High";
export type ComfortLevel = "Low" | "Medium" | "High";

// ========================================
// Product
// ========================================
export interface Product {
  id: string;
  name: string;
  category: string;
  actives: string[];
  cautionTags: string[]; // e.g., "strong-active", "drying"
  // Routine-specific fields
  routineType?: RoutineType; // skin, body, bodySpecific, hair, etc.
  bodyAreas?: BodyArea[]; // Which body areas this product is used on (UA, IT, BL, IA, B)
  hairPhase?: HairPhase; // For hair products: oiling, washing, postWash, daily
  timeOfDay?: TimeOfDay; // AM, MIDDAY, PM, or ANY
  weekdays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat (which days to use this product)
  displayOrder?: number; // Order in which to display/use the product in routine
  notes?: string; // Additional notes about dosage, purpose, timing, etc.
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
  essential?: boolean; // For Travel mode - only essential steps shown
  mildAlternative?: boolean; // Marks step as mild alternative for going out
  weekdaysOnly?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat - only show this step on specific days
}

// ========================================
// Routine
// ========================================
export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  schedule: {
    weekday?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
    cycleDay?: number[]; // For cycle-based schedules
    frequencyPerWeek?: number;
  };
  timeOfDay: TimeOfDay;
  tags: {
    office?: boolean;
    wfh?: boolean;
    travel?: boolean;
    goingOut?: boolean;
  };
  occasion?: string[]; // Office/Party/etc for outfit alignment
  productIds?: string[]; // Direct product references (alternative to steps)
  steps?: RoutineStep[]; // Made optional since some routines use productIds instead
  notes?: string; // Additional notes about the routine, tips, etc.
  constraints?: {
    avoidIfGoingOut?: boolean;
    cooldownDaysAfter?: { tag: string; days: number }[];
    dontCombineWith?: string[]; // product name or active tag
    requiresSunscreenIfUsing?: string[]; // products that require sunscreen
    optionalFallbackFor?: string[]; // routine IDs this is a fallback for
  };
}

// ========================================
// Wardrobe Item
// ========================================
export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  styleType?: "Basics" | "Elevated" | "Seasonals"; // For categorizing items
  subType?: string; // For sub-categorization (e.g., Tanks, Tees, Full fitted, Sheer for tops)
  imageUrl: string;
  colors: string[];
  occasions: string[];
  weatherTags: string[];
  vibeTags: string[];
  modesty: ModestyLevel;
  comfort: ComfortLevel;
  notes?: string;
  lastWorn?: string; // ISO date
  favorite?: boolean;
}

// ========================================
// Outfit (saved combinations)
// ========================================
export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
  occasions: string[];
  createdAt: string; // ISO date
}

// ========================================
// Meal Template
// ========================================
export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  timeOfDay: TimeOfDay; // AM = breakfast, ANY = lunch, PM = dinner
  mealType: "breakfast" | "lunch" | "dinner";
  items: string[]; // simple list for backward compatibility
  ingredients?: Ingredient[]; // detailed ingredients with quantities
  instructions?: string[]; // step-by-step cooking instructions
  weekdays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat (which days to eat this)
  prepTimeMin?: number;
  cookTimeMin?: number;
  servings?: number;
  tags?: string[]; // e.g., "vegetarian", "high-protein", "quick"
}

// ========================================
// Dressing
// ========================================
export interface Dressing {
  id: string;
  name: string;
  shelfLifeDays: number;
  ingredients: string[];
}

// ========================================
// Workout Plan
// ========================================
export interface WorkoutPlan {
  id: string;
  name: string;
  weekday: number[]; // days scheduled
  durationMin: number;
}

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
  key: string; // "Skincare", "Haircare", etc.
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
  filters: Omit<Filters, "date"> & { date: string }; // ISO date for storage
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
