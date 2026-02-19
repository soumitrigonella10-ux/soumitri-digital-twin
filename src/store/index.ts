// ========================================
// Store Barrel Export
//
// Clean entry point for all store-related imports:
//   import { useAppStore, useAppSelector, selectProducts } from "@/store";
// ========================================

// Store hook
export { useAppStore } from "./useAppStore";

// Typed selector utilities
export {
  useAppSelector,
  selectProducts,
  selectRoutines,
  selectWardrobe,
  selectMeals,
  selectDressings,
  selectWorkouts,
  selectOutfits,
  selectWishlist,
  selectData,
  selectFilters,
  selectFilterActions,
  selectCompletionActions,
  selectCrudActions,
  selectWishlistActions,
  selectPresetActions,
} from "./selectors";

// Store types
export type {
  AppState,
  AppData,
  DataSlice,
  FilterSlice,
  CompletionSlice,
  ProductCompletionMap,
  ImmerSliceCreator,
} from "./types";
