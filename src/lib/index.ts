// ========================================
// Lib Barrel Export
//
// Public API of the lib layer. Only re-exports modules meant
// for broad consumption. Auth adapters and DB internals are
// intentionally excluded — import them directly when needed.
// ========================================

// Configuration
export { config } from "./config";
export type { AppConfig } from "./config";

// Business logic
export { computeDayPlan, getWeekday } from "./compute";

// Domain services
export {
  routineService,
  wardrobeService,
  wishlistService,
  nutritionService,
  fitnessService,
} from "./services";

// Validation
export {
  productSchema,
  wardrobeItemSchema,
  mealTemplateSchema,
  dressingSchema,
  workoutPlanSchema,
  validateWithSchema,
  fieldHelpers,
} from "./validation";
export type {
  ValidationResult,
  ProductFormData,
  WardrobeItemFormData,
  MealTemplateFormData,
  DressingFormData,
  WorkoutPlanFormData,
} from "./validation";

// Performance utilities (pure functions only — hooks are in @/hooks)
export {
  createMemoizedSelector,
  PERFORMANCE_CONFIG,
  optimizedArrayOperations,
} from "./performance";

// General utilities
export { cn } from "./utils";
