// ========================================
// Tests for src/store/selectors.ts
// Selector functions (pure, no React rendering needed)
// ========================================

import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/useAppStore";
import {
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
  selectOutfitActions,
  selectPresetActions,
} from "@/store/selectors";

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState());
});

describe("Data selectors", () => {
  it("selectProducts returns products array", () => {
    const state = useAppStore.getState();
    const products = selectProducts(state);
    expect(Array.isArray(products)).toBe(true);
  });

  it("selectRoutines returns routines array", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectRoutines(state))).toBe(true);
  });

  it("selectWardrobe returns wardrobe array", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectWardrobe(state))).toBe(true);
  });

  it("selectMeals returns mealTemplates", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectMeals(state))).toBe(true);
  });

  it("selectDressings returns dressings", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectDressings(state))).toBe(true);
  });

  it("selectWorkouts returns workoutPlans", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectWorkouts(state))).toBe(true);
  });

  it("selectOutfits returns outfits", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectOutfits(state))).toBe(true);
  });

  it("selectWishlist returns wishlist", () => {
    const state = useAppStore.getState();
    expect(Array.isArray(selectWishlist(state))).toBe(true);
  });

  it("selectData returns the full data object", () => {
    const state = useAppStore.getState();
    const data = selectData(state);
    expect(data).toHaveProperty("products");
    expect(data).toHaveProperty("routines");
    expect(data).toHaveProperty("wardrobe");
    expect(data).toHaveProperty("mealTemplates");
    expect(data).toHaveProperty("dressings");
    expect(data).toHaveProperty("workoutPlans");
    expect(data).toHaveProperty("outfits");
    expect(data).toHaveProperty("wishlist");
  });

  it("selectFilters returns filters with expected shape", () => {
    const state = useAppStore.getState();
    const filters = selectFilters(state);
    expect(filters).toHaveProperty("date");
    expect(filters).toHaveProperty("timeOfDay");
    expect(filters).toHaveProperty("flags");
    expect(filters).toHaveProperty("occasion");
    expect(filters).toHaveProperty("bodyAreas");
  });
});

describe("Action selectors", () => {
  it("selectFilterActions returns setFilters and resetFilters", () => {
    const state = useAppStore.getState();
    const actions = selectFilterActions(state);
    expect(typeof actions.setFilters).toBe("function");
    expect(typeof actions.resetFilters).toBe("function");
  });

  it("selectCompletionActions returns all completion functions", () => {
    const state = useAppStore.getState();
    const actions = selectCompletionActions(state);
    expect(typeof actions.toggleStepCompletion).toBe("function");
    expect(typeof actions.toggleProductCompletion).toBe("function");
    expect(typeof actions.getSectionCompletion).toBe("function");
    expect(typeof actions.getStepCompletion).toBe("function");
    expect(typeof actions.getProductCompletion).toBe("function");
  });

  it("selectCrudActions returns all CRUD functions", () => {
    const state = useAppStore.getState();
    const actions = selectCrudActions(state);
    expect(typeof actions.upsertProduct).toBe("function");
    expect(typeof actions.upsertRoutine).toBe("function");
    expect(typeof actions.upsertWardrobe).toBe("function");
    expect(typeof actions.upsertMeal).toBe("function");
    expect(typeof actions.upsertDressing).toBe("function");
    expect(typeof actions.upsertWorkout).toBe("function");
    expect(typeof actions.deleteById).toBe("function");
  });

  it("selectWishlistActions returns wishlist functions", () => {
    const state = useAppStore.getState();
    const actions = selectWishlistActions(state);
    expect(typeof actions.addWishlistItem).toBe("function");
    expect(typeof actions.updateWishlistItem).toBe("function");
    expect(typeof actions.removeWishlistItem).toBe("function");
    expect(typeof actions.markWishlistItemPurchased).toBe("function");
  });

  it("selectOutfitActions returns outfit functions", () => {
    const state = useAppStore.getState();
    const actions = selectOutfitActions(state);
    expect(typeof actions.addOutfit).toBe("function");
    expect(typeof actions.removeOutfit).toBe("function");
  });

  it("selectPresetActions returns preset functions", () => {
    const state = useAppStore.getState();
    const actions = selectPresetActions(state);
    expect(typeof actions.savePreset).toBe("function");
    expect(typeof actions.loadPreset).toBe("function");
    expect(typeof actions.loadPresetNames).toBe("function");
    expect(typeof actions.deletePreset).toBe("function");
  });
});
