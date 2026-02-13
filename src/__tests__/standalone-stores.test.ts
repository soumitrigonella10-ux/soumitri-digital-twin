// ========================================
// Tests for standalone store slices using their own mini-stores
// fitnessSlice, nutritionSlice, wardrobeSlice, wishlistSlice, productSlice
// ========================================

import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";

/** Minimal store interface used in tests — only getState() is needed */
interface TestStore<T> {
  getState: () => T;
}

/** Create a typed test store from a slice creator */
function createTestStore<T>(creator: unknown): TestStore<T> {
  return create(creator as any) as unknown as TestStore<T>;
}

// ========================================
// productSlice
// ========================================
import { createProductSlice, type ProductSlice } from "@/store/slices/productSlice";

describe("ProductSlice (standalone store)", () => {
  let useStore: TestStore<ProductSlice>;

  beforeEach(() => {
    useStore = createTestStore<ProductSlice>(createProductSlice);
  });

  it("initializes with seed products", () => {
    const state = useStore.getState();
    expect(state.data.products.length).toBeGreaterThan(0);
  });

  it("initializes with seed routines", () => {
    const state = useStore.getState();
    expect(state.data.routines.length).toBeGreaterThan(0);
  });

  it("upsertProduct adds new product", () => {
    const newP = {
      id: "test-prod-1",
      name: "Test Product",
      category: "Test",
      actives: [],
      cautionTags: [],
      routineType: "skin" as const,
    };
    useStore.getState().upsertProduct(newP);
    const found = useStore.getState().data.products.find((p) => p.id === "test-prod-1");
    expect(found).toBeDefined();
    expect(found!.name).toBe("Test Product");
  });

  it("upsertProduct updates existing product", () => {
    const existing = useStore.getState().data.products[0]!;
    useStore.getState().upsertProduct({ ...existing, name: "Updated" });
    const found = useStore.getState().data.products.find((p) => p.id === existing.id);
    expect(found!.name).toBe("Updated");
  });

  it("upsertRoutine adds new routine", () => {
    const newR = {
      id: "test-routine-1",
      type: "skin" as const,
      name: "Test Routine",
      schedule: { weekday: [1, 2, 3] },
      timeOfDay: "AM" as const,
      tags: { office: false, wfh: true, travel: false, goingOut: false },
    };
    useStore.getState().upsertRoutine(newR);
    const found = useStore.getState().data.routines.find((r) => r.id === "test-routine-1");
    expect(found).toBeDefined();
  });
});

// ========================================
// fitnessSlice
// ========================================
import { createFitnessSlice, type FitnessSlice } from "@/store/slices/fitnessSlice";

describe("FitnessSlice (standalone store)", () => {
  let useStore: TestStore<FitnessSlice>;

  beforeEach(() => {
    useStore = createTestStore<FitnessSlice>(createFitnessSlice);
  });

  it("initializes with seed workout data", () => {
    const state = useStore.getState();
    expect(state.data.workoutPlans.length).toBeGreaterThan(0);
  });

  it("upsertWorkout adds a new workout", () => {
    useStore.getState().upsertWorkout({
      id: "test-w-1",
      name: "Test Workout",
      weekday: [3],
      durationMin: 45,
      sections: [{ title: "Main", exercises: [{ name: "Squats" }] }],
    });
    const found = useStore.getState().data.workoutPlans.find((w) => w.id === "test-w-1");
    expect(found).toBeDefined();
    expect(found!.name).toBe("Test Workout");
  });

  it("upsertWorkout updates existing workout", () => {
    const existing = useStore.getState().data.workoutPlans[0]!;
    useStore.getState().upsertWorkout({ ...existing, name: "Updated Workout" });
    const found = useStore.getState().data.workoutPlans.find((w) => w.id === existing.id);
    expect(found!.name).toBe("Updated Workout");
  });

  it("refreshWorkoutData resets to seed", () => {
    useStore.getState().upsertWorkout({
      id: "custom-w",
      name: "Custom",
      weekday: [5],
      durationMin: 10,
      sections: [],
    });
    useStore.getState().refreshWorkoutData();
    const found = useStore.getState().data.workoutPlans.find((w) => w.id === "custom-w");
    expect(found).toBeUndefined();
  });
});

// ========================================
// nutritionSlice
// ========================================
import { createNutritionSlice, type NutritionSlice } from "@/store/slices/nutritionSlice";

describe("NutritionSlice (standalone store)", () => {
  let useStore: TestStore<NutritionSlice>;

  beforeEach(() => {
    useStore = createTestStore<NutritionSlice>(createNutritionSlice);
  });

  it("initializes with seed meals", () => {
    expect(useStore.getState().data.mealTemplates.length).toBeGreaterThan(0);
  });

  it("initializes with seed dressings", () => {
    expect(useStore.getState().data.dressings.length).toBeGreaterThan(0);
  });

  it("upsertMeal adds new meal", () => {
    useStore.getState().upsertMeal({
      id: "test-meal-1",
      name: "Test Meal",
      timeOfDay: "AM",
      mealType: "breakfast",
      items: ["oats", "banana"],
    });
    const found = useStore.getState().data.mealTemplates.find((m) => m.id === "test-meal-1");
    expect(found).toBeDefined();
  });

  it("upsertMeal updates existing meal", () => {
    const existing = useStore.getState().data.mealTemplates[0]!;
    useStore.getState().upsertMeal({ ...existing, name: "Updated Meal" });
    const found = useStore.getState().data.mealTemplates.find((m) => m.id === existing.id);
    expect(found!.name).toBe("Updated Meal");
  });

  it("upsertDressing adds new dressing", () => {
    useStore.getState().upsertDressing({
      id: "test-d-1",
      name: "Test Dressing",
      shelfLifeDays: 5,
      ingredients: ["oil"],
    });
    const found = useStore.getState().data.dressings.find((d) => d.id === "test-d-1");
    expect(found).toBeDefined();
  });
});

// ========================================
// wardrobeSlice
// ========================================
import { createWardrobeSlice, type WardrobeSlice } from "@/store/slices/wardrobeSlice";

describe("WardrobeSlice (standalone store)", () => {
  let useStore: TestStore<WardrobeSlice>;

  beforeEach(() => {
    useStore = createTestStore<WardrobeSlice>(createWardrobeSlice);
  });

  it("initializes with seed wardrobe", () => {
    expect(useStore.getState().data.wardrobe.length).toBeGreaterThan(0);
  });

  it("initializes with empty outfits", () => {
    expect(useStore.getState().data.outfits).toEqual([]);
  });

  it("upsertWardrobe adds new item", () => {
    useStore.getState().upsertWardrobe({
      id: "test-w-item",
      name: "Test Top",
      category: "Top",
      imageUrl: "/test.png",
      colors: ["Red"],
    });
    const found = useStore.getState().data.wardrobe.find((w) => w.id === "test-w-item");
    expect(found).toBeDefined();
  });

  it("addOutfit adds an outfit", () => {
    useStore.getState().addOutfit({
      id: "o-1",
      name: "Office Look",
      itemIds: ["w-1", "w-2"],
      occasions: ["Business"],
      createdAt: "2025-01-01",
    });
    expect(useStore.getState().data.outfits).toHaveLength(1);
  });

  it("removeOutfit removes an outfit", () => {
    useStore.getState().addOutfit({
      id: "o-2",
      name: "Casual",
      itemIds: [],
      occasions: [],
      createdAt: "2025-01-01",
    });
    useStore.getState().removeOutfit("o-2");
    expect(useStore.getState().data.outfits).toHaveLength(0);
  });
});

// ========================================
// wishlistSlice
// ========================================
import { createWishlistSlice, type WishlistSlice } from "@/store/slices/wishlistSlice";

describe("WishlistSlice (standalone store)", () => {
  let useStore: TestStore<WishlistSlice>;

  beforeEach(() => {
    useStore = createTestStore<WishlistSlice>(createWishlistSlice);
  });

  it("initializes with seed wishlist", () => {
    expect(useStore.getState().data.wishlist.length).toBeGreaterThan(0);
  });

  it("addWishlistItem adds new item", () => {
    const before = useStore.getState().data.wishlist.length;
    useStore.getState().addWishlistItem({
      id: "wl-test-1",
      name: "Want This",
      category: "Tops",
      dateAdded: "2025-06-01",
    });
    expect(useStore.getState().data.wishlist.length).toBe(before + 1);
  });

  it("updateWishlistItem updates existing", () => {
    const existing = useStore.getState().data.wishlist[0]!;
    useStore.getState().updateWishlistItem({ ...existing, name: "Updated" });
    const found = useStore.getState().data.wishlist.find((i) => i.id === existing.id);
    expect(found!.name).toBe("Updated");
  });

  it("removeWishlistItem removes by id", () => {
    const existing = useStore.getState().data.wishlist[0]!;
    const before = useStore.getState().data.wishlist.length;
    useStore.getState().removeWishlistItem(existing.id);
    expect(useStore.getState().data.wishlist.length).toBe(before - 1);
  });

  it("markWishlistItemPurchased sets purchased flag", () => {
    const existing = useStore.getState().data.wishlist[0]!;
    useStore.getState().markWishlistItemPurchased(existing.id);
    const found = useStore.getState().data.wishlist.find((i) => i.id === existing.id);
    expect(found!.purchased).toBe(true);
    expect(found!.purchaseDate).toBeDefined();
  });
});
