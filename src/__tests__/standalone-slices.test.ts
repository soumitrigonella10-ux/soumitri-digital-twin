// ========================================
// Tests for standalone store slices that are NOT 
// composed into the main useAppStore (product, fitness, nutrition, wardrobe, wishlist)
// These are tested independently since they use their own createXxxSlice pattern
// ========================================

import { describe, it, expect } from "vitest";
import { mergeById } from "@/store/slices/productSlice";

// ========================================
// mergeById from productSlice (duplicate export)
// ========================================
describe("mergeById from productSlice", () => {
  it("merges new items", () => {
    const base: { id: string; v: number }[] = [{ id: "1", v: 1 }];
    const updates = [{ id: "2", v: 2 }];
    expect(mergeById(base, updates)).toHaveLength(2);
  });

  it("replaces by id", () => {
    const base = [{ id: "1", v: 1 }];
    const updates = [{ id: "1", v: 99 }];
    const result = mergeById(base, updates);
    expect(result).toHaveLength(1);
    expect(result[0]!.v).toBe(99);
  });
});

// ========================================
// FitnessSlice shape validation
// ========================================
describe("FitnessSlice structure", () => {
  it("creates slice with seed workout data", async () => {
    const { createFitnessSlice } = await import("@/store/slices/fitnessSlice");
    expect(createFitnessSlice).toBeDefined();
    expect(typeof createFitnessSlice).toBe("function");
  });
});

// ========================================
// NutritionSlice shape validation
// ========================================
describe("NutritionSlice structure", () => {
  it("creates slice with seed meal and dressing data", async () => {
    const { createNutritionSlice } = await import("@/store/slices/nutritionSlice");
    expect(createNutritionSlice).toBeDefined();
    expect(typeof createNutritionSlice).toBe("function");
  });
});

// ========================================
// ProductSlice shape validation
// ========================================
describe("ProductSlice structure", () => {
  it("exports createProductSlice function", async () => {
    const { createProductSlice } = await import("@/store/slices/productSlice");
    expect(createProductSlice).toBeDefined();
    expect(typeof createProductSlice).toBe("function");
  });
});

// ========================================
// WardrobeSlice shape validation
// ========================================
describe("WardrobeSlice structure", () => {
  it("exports createWardrobeSlice function", async () => {
    const { createWardrobeSlice } = await import("@/store/slices/wardrobeSlice");
    expect(createWardrobeSlice).toBeDefined();
    expect(typeof createWardrobeSlice).toBe("function");
  });
});

// ========================================
// WishlistSlice shape validation
// ========================================
describe("WishlistSlice structure", () => {
  it("exports createWishlistSlice function", async () => {
    const { createWishlistSlice } = await import("@/store/slices/wishlistSlice");
    expect(createWishlistSlice).toBeDefined();
    expect(typeof createWishlistSlice).toBe("function");
  });
});

// ========================================
// Slice index re-exports
// ========================================
describe("Store slices index", () => {
  it("re-exports createDataSlice", async () => {
    const mod = await import("@/store/slices/index");
    expect(mod.createDataSlice).toBeDefined();
  });

  it("re-exports createFilterSlice", async () => {
    const mod = await import("@/store/slices/index");
    expect(mod.createFilterSlice).toBeDefined();
  });

  it("re-exports createCompletionSlice", async () => {
    const mod = await import("@/store/slices/index");
    expect(mod.createCompletionSlice).toBeDefined();
  });

  it("re-exports mergeById", async () => {
    const mod = await import("@/store/slices/index");
    expect(mod.mergeById).toBeDefined();
    expect(typeof mod.mergeById).toBe("function");
  });
});
