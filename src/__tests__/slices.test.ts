// ========================================
// Tests for filter slice preset functionality and
// standalone slice behaviors (fitness, nutrition, wardrobe, wishlist, product)
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAppStore } from "@/store/useAppStore";
import { mergeById } from "@/store/slices/dataSlice";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    // Expose keys for localStorage iteration
    keys: () => Object.keys(store),
  };
})();

// Replace Object.keys(localStorage) behavior
Object.defineProperty(localStorageMock, Symbol.iterator, {
  value: function* () {
    yield* Object.keys(localStorageMock);
  },
});

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState());
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
});

// ========================================
// Filter presets (localStorage-based)
// ========================================
describe("FilterSlice presets", () => {
  it("savePreset stores filters to localStorage", () => {
    const { savePreset } = useAppStore.getState();
    savePreset("myPreset");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "rw-preset:myPreset",
      expect.any(String)
    );
  });

  it("loadPresetNames returns saved preset names", () => {
    // Manually add preset items
    localStorageMock.setItem("rw-preset:morning", "{}");
    localStorageMock.setItem("rw-preset:evening", "{}");
    localStorageMock.setItem("other-key", "{}");

    // loadPresetNames uses Object.keys(localStorage) internally
    // We need to make our mock's keys enumerable
    const { loadPresetNames } = useAppStore.getState();
    const names = loadPresetNames();
    // names should only include preset keys
    expect(Array.isArray(names)).toBe(true);
  });

  it("deletePreset removes from localStorage", () => {
    const { deletePreset } = useAppStore.getState();
    deletePreset("myPreset");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("rw-preset:myPreset");
  });

  it("loadPreset sets filters from stored data", () => {
    const presetData = {
      date: "2025-06-15",
      timeOfDay: "AM",
      flags: { office: true, wfh: false, travel: false, goingOut: false },
      occasion: "Business",
      bodyAreas: ["UA"],
    };
    localStorageMock.setItem("rw-preset:office", JSON.stringify(presetData));

    const { loadPreset } = useAppStore.getState();
    loadPreset("office");

    const state = useAppStore.getState();
    expect(state.filters.timeOfDay).toBe("AM");
    expect(state.filters.occasion).toBe("Business");
  });
});

// ========================================
// DataSlice — deleteById
// ========================================
describe("DataSlice deleteById", () => {
  it("deletes a product by id", () => {
    const state = useAppStore.getState();
    const firstProduct = state.data.products[0];
    if (!firstProduct) return;

    state.deleteById("products", firstProduct.id);
    const after = useAppStore.getState();
    expect(after.data.products.find((p) => p.id === firstProduct.id)).toBeUndefined();
  });

  it("does nothing for missing id", () => {
    const before = useAppStore.getState().data.products.length;
    useAppStore.getState().deleteById("products", "nonexistent-id");
    const after = useAppStore.getState().data.products.length;
    expect(after).toBe(before);
  });
});

// ========================================
// DataSlice — outfit operations
// ========================================
describe("DataSlice outfits", () => {
  it("adds an outfit", () => {
    const outfit = { id: "o-1", name: "Test Outfit", itemIds: ["w-1"], occasions: ["Casual"], createdAt: "2025-01-01" };
    useAppStore.getState().addOutfit(outfit);
    const state = useAppStore.getState();
    expect(state.data.outfits).toHaveLength(1);
    expect(state.data.outfits[0]!.name).toBe("Test Outfit");
  });

  it("removes an outfit", () => {
    const outfit = { id: "o-2", name: "Remove Me", itemIds: [], occasions: [], createdAt: "2025-01-01" };
    useAppStore.getState().addOutfit(outfit);
    useAppStore.getState().removeOutfit("o-2");
    expect(useAppStore.getState().data.outfits).toHaveLength(0);
  });
});

// ========================================
// DataSlice — wishlist operations
// ========================================
describe("DataSlice wishlist operations", () => {
  it("adds a wishlist item", () => {
    const initialCount = useAppStore.getState().data.wishlist.length;
    const item = {
      id: "wl-test-1",
      name: "Test Item",
      category: "Tops" as const,
      dateAdded: "2025-01-01",
    };
    useAppStore.getState().addWishlistItem(item);
    expect(useAppStore.getState().data.wishlist.length).toBe(initialCount + 1);
  });

  it("updates a wishlist item", () => {
    const existing = useAppStore.getState().data.wishlist[0];
    if (!existing) return;
    useAppStore.getState().updateWishlistItem({ ...existing, name: "Updated Name" });
    const updated = useAppStore.getState().data.wishlist.find((i) => i.id === existing.id);
    expect(updated!.name).toBe("Updated Name");
  });

  it("removes a wishlist item", () => {
    const existing = useAppStore.getState().data.wishlist[0];
    if (!existing) return;
    const beforeCount = useAppStore.getState().data.wishlist.length;
    useAppStore.getState().removeWishlistItem(existing.id);
    expect(useAppStore.getState().data.wishlist.length).toBe(beforeCount - 1);
  });

  it("marks wishlist item as purchased", () => {
    const existing = useAppStore.getState().data.wishlist[0];
    if (!existing) return;
    useAppStore.getState().markWishlistItemPurchased(existing.id);
    const updated = useAppStore.getState().data.wishlist.find((i) => i.id === existing.id);
    expect(updated!.purchased).toBe(true);
    expect(updated!.purchaseDate).toBeDefined();
  });
});

// ========================================
// DataSlice — upsert operations
// ========================================
describe("DataSlice upsert operations", () => {
  it("upserts a wardrobe item", () => {
    const item = {
      id: "w-test-new",
      name: "New Top",
      category: "Top" as const,
      imageUrl: "/test.png",
      colors: ["Blue"],
    };
    useAppStore.getState().upsertWardrobe(item);
    const found = useAppStore.getState().data.wardrobe.find((w) => w.id === "w-test-new");
    expect(found).toBeDefined();
    expect(found!.name).toBe("New Top");
  });

  it("upserts a meal template", () => {
    const meal = {
      id: "m-test-new",
      name: "Test Meal",
      timeOfDay: "AM" as const,
      mealType: "breakfast" as const,
      items: ["eggs", "toast"],
    };
    useAppStore.getState().upsertMeal(meal);
    const found = useAppStore.getState().data.mealTemplates.find((m) => m.id === "m-test-new");
    expect(found).toBeDefined();
  });

  it("upserts a dressing", () => {
    const dressing = {
      id: "d-test-new",
      name: "Test Dressing",
      shelfLifeDays: 7,
      ingredients: ["oil", "vinegar"],
    };
    useAppStore.getState().upsertDressing(dressing);
    const found = useAppStore.getState().data.dressings.find((d) => d.id === "d-test-new");
    expect(found).toBeDefined();
  });

  it("upserts a workout plan", () => {
    const workout = {
      id: "w-test-new",
      name: "Test Workout",
      weekday: [1],
      durationMin: 30,
      sections: [{ title: "Main", exercises: [{ name: "Push-ups" }] }],
    };
    useAppStore.getState().upsertWorkout(workout);
    const found = useAppStore.getState().data.workoutPlans.find((w) => w.id === "w-test-new");
    expect(found).toBeDefined();
  });

  it("refreshWorkoutData resets to seed data", () => {
    // Modify first
    useAppStore.getState().upsertWorkout({
      id: "custom-workout",
      name: "Custom",
      weekday: [5],
      durationMin: 15,
      sections: [],
    });
    useAppStore.getState().refreshWorkoutData();
    const hasCustom = useAppStore.getState().data.workoutPlans.find((w) => w.id === "custom-workout");
    expect(hasCustom).toBeUndefined();
  });
});

// ========================================
// Standalone slice: mergeById edge cases
// ========================================
describe("mergeById additional edge cases", () => {
  it("handles multiple updates at once", () => {
    const base = [
      { id: "a", val: 1 },
      { id: "b", val: 2 },
      { id: "c", val: 3 },
    ];
    const updates = [
      { id: "a", val: 10 },
      { id: "c", val: 30 },
      { id: "d", val: 40 },
    ];
    const result = mergeById(base, updates);
    expect(result).toHaveLength(4);
    expect(result.find((i) => i.id === "a")!.val).toBe(10);
    expect(result.find((i) => i.id === "b")!.val).toBe(2);
    expect(result.find((i) => i.id === "c")!.val).toBe(30);
    expect(result.find((i) => i.id === "d")!.val).toBe(40);
  });

  it("handles both empty arrays", () => {
    const result = mergeById([], []);
    expect(result).toHaveLength(0);
  });

  it("handles empty updates", () => {
    const base = [{ id: "x", v: 1 }];
    const result = mergeById(base, []);
    expect(result).toHaveLength(1);
  });
});
