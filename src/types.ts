// ========================================
// Core Type Definitions for Routines + Wardrobe App
//
// Types are organized into domain-specific modules under src/types/.
// This file re-exports everything for backward compatibility.
// Prefer importing from "@/types" (resolves to src/types/index.ts).
// ========================================

export type {
  UserRole,
} from "./types/auth";

export type {
  TimeOfDay,
  RoutineType,
  BodyArea,
  HairPhase,
  Product,
  RoutineStep,
  Routine,
} from "./types/routines";

export type {
  WardrobeCategory,
  WishlistCategory,
  WardrobeItem,
  WishlistItem,
  JewelleryItem,
} from "./types/wardrobe";

export type {
  Ingredient,
  MealTemplate,
  Dressing,
} from "./types/nutrition";

export type {
  Exercise,
  WorkoutSection,
  WorkoutPlan,
} from "./types/fitness";

export type {
  Filters,
  EnrichedStep,
  PlanRoutine,
  PlanSection,
  DayPlan,
  FilterPreset,
  CompletionMap,
} from "./types/planner";

// Side-effect: augment next-auth module types
import "./types/auth";
