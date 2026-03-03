// ========================================
// Tests for standalone store slices using their own mini-stores
// Tests the unified dataSlice which replaced the legacy per-domain slices
// ========================================

import { describe, it, expect, beforeEach, vi } from "vitest";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DataSlice } from "@/store/types";
import { createDataSlice } from "@/store/slices/dataSlice";

/** Create a typed immer-enabled test store from DataSlice */
function createImmerTestStore() {
  // Use `any` for the slice creator in tests since the full AppState
  // composition isn't available in standalone store tests
  return create<DataSlice>()(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    immer(createDataSlice as any)
  );
}

// ========================================
// DataSlice — Products
// ========================================
describe("DataSlice — Products (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
  });

  it("initializes with empty products (DB is source of truth)", () => {
    const state = useStore.getState();
    expect(state.data.products.length).toBe(0);
  });

  it("initializes with empty routines (DB is source of truth)", () => {
    const state = useStore.getState();
    expect(state.data.routines.length).toBe(0);
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
    // First add a product (store starts empty)
    const initial = { id: "test-upd-1", name: "Original", category: "Test", actives: [] as string[], cautionTags: [] as string[] };
    useStore.getState().upsertProduct(initial);
    useStore.getState().upsertProduct({ ...initial, name: "Updated" });
    const found = useStore.getState().data.products.find((p) => p.id === initial.id);
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
// DataSlice — Fitness
// ========================================
describe("DataSlice — Fitness (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
  });

  it("initializes with empty workout data (DB is source of truth)", () => {
    const state = useStore.getState();
    expect(state.data.workoutPlans.length).toBe(0);
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
    // First add a workout (store starts empty)
    const initial = { id: "test-w-upd", name: "Original Workout", weekday: [1], durationMin: 30, sections: [] as never[] };
    useStore.getState().upsertWorkout(initial);
    useStore.getState().upsertWorkout({ ...initial, name: "Updated Workout" });
    const found = useStore.getState().data.workoutPlans.find((w) => w.id === initial.id);
    expect(found!.name).toBe("Updated Workout");
  });

  it("refreshWorkoutData triggers DB re-fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { products: [], routines: [], wardrobe: [], wishlist: [], mealTemplates: [], dressings: [], workoutPlans: [] } }),
    });

    useStore.getState().upsertWorkout({
      id: "custom-w",
      name: "Custom",
      weekday: [5],
      durationMin: 10,
      sections: [],
    });
    useStore.getState().refreshWorkoutData();
    // refreshWorkoutData delegates to refreshFromDb which calls fetch
    expect(global.fetch).toHaveBeenCalled();
  });
});

// ========================================
// DataSlice — Nutrition
// ========================================
describe("DataSlice — Nutrition (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
  });

  it("initializes with empty meals (DB is source of truth)", () => {
    expect(useStore.getState().data.mealTemplates.length).toBe(0);
  });

  it("initializes with empty dressings (DB is source of truth)", () => {
    expect(useStore.getState().data.dressings.length).toBe(0);
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
    const initial = { id: "test-upd-meal", name: "Original", timeOfDay: "AM" as const, mealType: "breakfast" as const, items: ["oats"] };
    useStore.getState().upsertMeal(initial);
    useStore.getState().upsertMeal({ ...initial, name: "Updated Meal" });
    const found = useStore.getState().data.mealTemplates.find((m) => m.id === initial.id);
    expect(found!.name).toBe("Updated Meal");
  });

  it("upsertDressing adds new dressing", () => {
    useStore.getState().upsertDressing({
      id: "test-d-1",
      name: "Test Dressing",
      shelfLifeDays: 5,
      ingredients: [{ name: "oil", quantity: "1 tbsp" }],
    });
    const found = useStore.getState().data.dressings.find((d) => d.id === "test-d-1");
    expect(found).toBeDefined();
  });
});

// ========================================
// DataSlice — Wardrobe
// ========================================
describe("DataSlice — Wardrobe (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
  });

  it("initializes with empty wardrobe (DB is source of truth)", () => {
    expect(useStore.getState().data.wardrobe.length).toBe(0);
  });

  it("upsertWardrobe adds new item", () => {
    useStore.getState().upsertWardrobe({
      id: "test-w-item",
      name: "Test Top",
      category: "Top",
      imageUrl: "/test.png",
    });
    const found = useStore.getState().data.wardrobe.find((w) => w.id === "test-w-item");
    expect(found).toBeDefined();
  });
});

// ========================================
// DataSlice — Wishlist
// ========================================
describe("DataSlice — Wishlist (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
  });

  it("initializes with empty wishlist (DB is source of truth)", () => {
    expect(useStore.getState().data.wishlist.length).toBe(0);
  });

  it("addWishlistItem adds new item", () => {
    const before = useStore.getState().data.wishlist.length;
    useStore.getState().addWishlistItem({
      id: "wl-test-1",
      name: "Want This",
      category: "Tops",
    });
    expect(useStore.getState().data.wishlist.length).toBe(before + 1);
  });

  it("updateWishlistItem updates existing", () => {
    const item = { id: "wl-upd-1", name: "Original", category: "Tops" as const };
    useStore.getState().addWishlistItem(item);
    useStore.getState().updateWishlistItem({ ...item, name: "Updated" });
    const found = useStore.getState().data.wishlist.find((i) => i.id === item.id);
    expect(found!.name).toBe("Updated");
  });

  it("removeWishlistItem removes by id", () => {
    const item = { id: "wl-rm-1", name: "Remove Me", category: "Tops" as const };
    useStore.getState().addWishlistItem(item);
    const before = useStore.getState().data.wishlist.length;
    useStore.getState().removeWishlistItem(item.id);
    expect(useStore.getState().data.wishlist.length).toBe(before - 1);
  });

  it("markWishlistItemPurchased sets purchased flag", () => {
    const item = { id: "wl-purch-1", name: "Buy Me", category: "Tops" as const };
    useStore.getState().addWishlistItem(item);
    useStore.getState().markWishlistItemPurchased(item.id);
    const found = useStore.getState().data.wishlist.find((i) => i.id === item.id);
    expect(found!.purchased).toBe(true);
  });
});

// ========================================
// DataSlice — DB Hydration (initFromDb)
// ========================================
describe("DataSlice — DB Hydration (standalone store)", () => {
  let useStore: ReturnType<typeof createImmerTestStore>;

  beforeEach(() => {
    useStore = createImmerTestStore();
    vi.restoreAllMocks();
  });

  it("dbStatus starts as idle", () => {
    expect(useStore.getState().dbStatus).toBe("idle");
  });

  it("initFromDb replaces store data on success", async () => {
    const mockData = {
      products: [{ id: "db-p-1", name: "DB Product", category: "test", actives: [], cautionTags: [] }],
      routines: [{ id: "db-r-1", type: "skin", name: "DB Routine", schedule: { weekday: [1] }, timeOfDay: "AM", tags: {}, steps: [] }],
      wardrobe: [],
      wishlist: [],
      mealTemplates: [],
      dressings: [],
      workoutPlans: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockData }),
    });

    await useStore.getState().initFromDb();

    expect(useStore.getState().dbStatus).toBe("ready");
    expect(useStore.getState().data.products).toEqual(mockData.products);
    expect(useStore.getState().data.routines).toEqual(mockData.routines);
    // Empty arrays from DB are now applied (DB is source of truth)
    expect(useStore.getState().data.wardrobe).toEqual([]);
  });

  it("initFromDb keeps empty arrays on failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await useStore.getState().initFromDb();

    expect(useStore.getState().dbStatus).toBe("error");
    // Store started empty, stays empty on failure
    expect(useStore.getState().data.products.length).toBe(0);
  });

  it("initFromDb skips if already loading or ready", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { products: [], routines: [], wardrobe: [], wishlist: [], mealTemplates: [], dressings: [], workoutPlans: [] } }),
    });

    await useStore.getState().initFromDb();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second call should be no-op (status is 'ready')
    await useStore.getState().initFromDb();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("initFromDb handles non-OK HTTP response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ success: false, error: "Unauthorized" }),
    });

    await useStore.getState().initFromDb();

    expect(useStore.getState().dbStatus).toBe("error");
  });
});
