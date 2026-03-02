// ========================================
// Type System Barrel Export
//
// Domain types are split into focused modules for maintainability.
// This barrel re-exports everything for backward-compatible imports:
//   import { Product, Routine, ... } from "@/types"
// ========================================

// Authentication
export type { UserRole } from "./auth";

// Routines & Products
export type {
  TimeOfDay,
  RoutineType,
  BodyArea,
  HairPhase,
  Product,
  RoutineStep,
  Routine,
} from "./routines";

// Wardrobe & Wishlist
export type {
  WardrobeCategory,
  WishlistCategory,
  WardrobeItem,
  WishlistItem,
  JewelleryItem,
} from "./wardrobe";

// Nutrition
export type {
  Ingredient,
  MealTemplate,
  Dressing,
} from "./nutrition";

// Fitness
export type {
  Exercise,
  WorkoutSection,
  WorkoutPlan,
} from "./fitness";

// Planner & Filters
export type {
  Filters,
  EnrichedStep,
  PlanRoutine,
  PlanSection,
  DayPlan,
  FilterPreset,
  CompletionMap,
} from "./planner";

// Editorial (public-facing content types)
export type {
  EditorialMedia,
  EditorialMeta,
  ContentType,
  ContentStatus,
  ContentItem,
  Essay,
  EssayBlock,
  EssayCategory,
  Sidequest,
  SkillExperiment,
  TravelLocation,
  ThoughtCardType,
  AnnotationType,
  DesignThought,
  Topic,
  SubTab,
} from "./editorial";
export { ESSAY_CATEGORIES } from "./editorial";

// Re-export auth module declarations (side-effect: augments next-auth types)
import "./auth";
