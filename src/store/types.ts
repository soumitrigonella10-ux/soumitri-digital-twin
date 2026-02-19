import type { StateCreator } from "zustand";
import type {
  CompletionMap,
  Dressing,
  Filters,
  MealTemplate,
  Product,
  Routine,
  WardrobeItem,
  WishlistItem,
  WorkoutPlan,
} from "@/types";

// ========================================
// Unified data shape
// ========================================
export interface AppData {
  products: Product[];
  routines: Routine[];
  wardrobe: WardrobeItem[];
  mealTemplates: MealTemplate[];
  dressings: Dressing[];
  workoutPlans: WorkoutPlan[];
  wishlist: WishlistItem[];
}

// ========================================
// Completion map for product tracking
// ========================================
export type ProductCompletionMap = Record<
  string, // dateKey (yyyy-MM-dd)
  Record<string, boolean> // productId => done
>;

// ========================================
// Slice interfaces
// ========================================

export interface DataSlice {
  data: AppData;
  upsertProduct: (p: Product) => void;
  upsertRoutine: (r: Routine) => void;
  upsertWardrobe: (w: WardrobeItem) => void;
  upsertMeal: (m: MealTemplate) => void;
  upsertDressing: (d: Dressing) => void;
  upsertWorkout: (w: WorkoutPlan) => void;
  refreshWorkoutData: () => void;
  deleteById: (type: keyof AppData, id: string) => void;
  addWishlistItem: (item: WishlistItem) => void;
  updateWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (id: string) => void;
  markWishlistItemPurchased: (id: string) => void;
}

export interface FilterSlice {
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  resetFilters: () => void;
  savePreset: (name: string) => void;
  loadPresetNames: () => string[];
  loadPreset: (name: string) => void;
  deletePreset: (name: string) => void;
}

export interface CompletionSlice {
  completions: CompletionMap;
  toggleStepCompletion: (
    dateKey: string,
    sectionKey: string,
    routineId: string,
    stepOrder: number,
    value: boolean
  ) => void;
  getSectionCompletion: (
    dateKey: string,
    sectionKey: string,
    totalSteps: number
  ) => number;
  getStepCompletion: (
    dateKey: string,
    sectionKey: string,
    routineId: string,
    stepOrder: number
  ) => boolean;
  productCompletions: ProductCompletionMap;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  cleanupStaleCompletions: (daysToKeep?: number) => void;
}

// ========================================
// Full composed state (intersection of all slices)
// ========================================
export type AppState = DataSlice & FilterSlice & CompletionSlice;

// ========================================
// Helper type for immer-enhanced slice creators
// ========================================
export type ImmerSliceCreator<T> = StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  T
>;
