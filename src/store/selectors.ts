import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "./useAppStore";
import type { AppState } from "./types";

// ========================================
// Typed selector helpers
//
// Use these to subscribe to specific slices of state
// instead of destructuring the whole store.
// This prevents unnecessary re-renders when unrelated
// state changes.
//
// Usage:
//   const products = useAppStore(selectProducts);
//   const { setFilters, resetFilters } = useAppSelector(selectFilterActions);
// ========================================

/**
 * Shallow-equality selector hook — automatically memoizes
 * object/array returns so components only re-render when
 * the selected values actually change.
 */
export function useAppSelector<T>(selector: (state: AppState) => T): T {
  return useAppStore(useShallow(selector));
}

// ========================================
// Data selectors (each subscribes to one array)
// ========================================
export const selectProducts = (s: AppState) => s.data.products;
export const selectRoutines = (s: AppState) => s.data.routines;
export const selectWardrobe = (s: AppState) => s.data.wardrobe;
export const selectMeals = (s: AppState) => s.data.mealTemplates;
export const selectDressings = (s: AppState) => s.data.dressings;
export const selectWorkouts = (s: AppState) => s.data.workoutPlans;
export const selectOutfits = (s: AppState) => (s.data as any).outfits ?? [];
export const selectWishlist = (s: AppState) => s.data.wishlist;
export const selectData = (s: AppState) => s.data;
export const selectFilters = (s: AppState) => s.filters;

// ========================================
// Action-only selectors (stable refs — never re-render)
// ========================================
export const selectFilterActions = (s: AppState) => ({
  setFilters: s.setFilters,
  resetFilters: s.resetFilters,
});

export const selectCompletionActions = (s: AppState) => ({
  toggleStepCompletion: s.toggleStepCompletion,
  toggleProductCompletion: s.toggleProductCompletion,
  getSectionCompletion: s.getSectionCompletion,
  getStepCompletion: s.getStepCompletion,
  getProductCompletion: s.getProductCompletion,
});

export const selectCrudActions = (s: AppState) => ({
  upsertProduct: s.upsertProduct,
  upsertRoutine: s.upsertRoutine,
  upsertWardrobe: s.upsertWardrobe,
  upsertMeal: s.upsertMeal,
  upsertDressing: s.upsertDressing,
  upsertWorkout: s.upsertWorkout,
  refreshWorkoutData: s.refreshWorkoutData,
  deleteById: s.deleteById,
});

export const selectWishlistActions = (s: AppState) => ({
  addWishlistItem: s.addWishlistItem,
  updateWishlistItem: s.updateWishlistItem,
  removeWishlistItem: s.removeWishlistItem,
  markWishlistItemPurchased: s.markWishlistItemPurchased,
});

export const selectOutfitActions = (s: AppState) => ({
  addOutfit: s.addOutfit,
  removeOutfit: s.removeOutfit,
});

export const selectPresetActions = (s: AppState) => ({
  savePreset: s.savePreset,
  loadPreset: s.loadPreset,
  loadPresetNames: s.loadPresetNames,
  deletePreset: s.deletePreset,
});
