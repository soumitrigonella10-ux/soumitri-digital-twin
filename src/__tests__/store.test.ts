// ========================================
// Tests for store slices
// dataSlice, filterSlice, completionSlice
// ========================================

import { describe, it, expect, beforeEach } from "vitest";
import { mergeById } from "@/store/slices/dataSlice";
import { useAppStore } from "@/store/useAppStore";
import type { Product, WishlistItem } from "@/types";

// Reset the store before each test to avoid state leakage
beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState());
});

// ========================================
// mergeById (pure utility)
// ========================================
describe("mergeById", () => {
  it("merges new items into base", () => {
    const base = [{ id: "a", name: "A" }];
    const updates = [{ id: "b", name: "B" }];
    const result = mergeById(base, updates);
    expect(result).toHaveLength(2);
  });

  it("overwrites existing items by id", () => {
    const base = [{ id: "a", name: "Old" }];
    const updates = [{ id: "a", name: "New" }];
    const result = mergeById(base, updates);
    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("New");
  });

  it("preserves items not in updates", () => {
    const base = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    const updates = [{ id: "a", name: "Updated A" }];
    const result = mergeById(base, updates);
    expect(result).toHaveLength(2);
    expect(result.find((i) => i.id === "b")!.name).toBe("B");
  });

  it("handles empty base", () => {
    const result = mergeById([], [{ id: "a", name: "A" }]);
    expect(result).toHaveLength(1);
  });

  it("handles empty updates", () => {
    const result = mergeById([{ id: "a", name: "A" }], []);
    expect(result).toHaveLength(1);
  });
});

// ========================================
// DataSlice — CRUD operations on the Zustand store
// ========================================
describe("DataSlice", () => {
  it("upsertProduct adds a new product", () => {
    const product: Product = {
      id: "test-new",
      name: "New Test Product",
      category: "test",
      actives: [],
      cautionTags: [],
    };

    useAppStore.getState().upsertProduct(product);
    const found = useAppStore
      .getState()
      .data.products.find((p) => p.id === "test-new");

    expect(found).toBeDefined();
    expect(found!.name).toBe("New Test Product");
  });

  it("upsertProduct updates an existing product", () => {
    const product: Product = {
      id: "test-update",
      name: "Original",
      category: "test",
      actives: [],
      cautionTags: [],
    };

    useAppStore.getState().upsertProduct(product);
    useAppStore.getState().upsertProduct({ ...product, name: "Updated" });

    const all = useAppStore
      .getState()
      .data.products.filter((p) => p.id === "test-update");
    expect(all).toHaveLength(1);
    expect(all[0]!.name).toBe("Updated");
  });

  it("deleteById removes the correct item", () => {
    const product: Product = {
      id: "to-delete",
      name: "Delete Me",
      category: "test",
      actives: [],
      cautionTags: [],
    };

    useAppStore.getState().upsertProduct(product);
    expect(
      useAppStore.getState().data.products.find((p) => p.id === "to-delete")
    ).toBeDefined();

    useAppStore.getState().deleteById("products", "to-delete");
    expect(
      useAppStore.getState().data.products.find((p) => p.id === "to-delete")
    ).toBeUndefined();
  });

  it("addOutfit and removeOutfit", () => {
    const outfit = {
      id: "outfit-1",
      name: "Summer Outfit",
      itemIds: ["w-1", "w-2"],
      occasions: ["Casual"],
      createdAt: new Date().toISOString(),
    };

    useAppStore.getState().addOutfit(outfit);
    expect(useAppStore.getState().data.outfits).toHaveLength(1);
    expect(useAppStore.getState().data.outfits[0]!.name).toBe("Summer Outfit");

    useAppStore.getState().removeOutfit("outfit-1");
    expect(useAppStore.getState().data.outfits).toHaveLength(0);
  });

  it("wishlist CRUD operations", () => {
    const item: WishlistItem = {
      id: "wish-1",
      name: "Nice Bag",
      category: "Tops",
    };

    // Add
    useAppStore.getState().addWishlistItem(item);
    const initial = useAppStore.getState().data.wishlist;
    expect(initial.find((i) => i.id === "wish-1")).toBeDefined();

    // Update
    useAppStore.getState().updateWishlistItem({ ...item, name: "Nicer Bag" });
    expect(
      useAppStore.getState().data.wishlist.find((i) => i.id === "wish-1")!.name
    ).toBe("Nicer Bag");

    // Mark purchased
    useAppStore.getState().markWishlistItemPurchased("wish-1");
    const purchased = useAppStore
      .getState()
      .data.wishlist.find((i) => i.id === "wish-1")!;
    expect(purchased.purchased).toBe(true);

    // Remove
    useAppStore.getState().removeWishlistItem("wish-1");
    expect(
      useAppStore.getState().data.wishlist.find((i) => i.id === "wish-1")
    ).toBeUndefined();
  });
});

// ========================================
// FilterSlice
// ========================================
describe("FilterSlice", () => {
  it("setFilters merges partial updates", () => {
    useAppStore.getState().setFilters({ timeOfDay: "PM" });
    expect(useAppStore.getState().filters.timeOfDay).toBe("PM");
    // Other filters unchanged
    expect(useAppStore.getState().filters.occasion).toBe("Casual");
  });

  it("setFilters updates date", () => {
    const newDate = new Date("2026-03-15");
    useAppStore.getState().setFilters({ date: newDate });
    expect(useAppStore.getState().filters.date.toISOString()).toBe(
      newDate.toISOString()
    );
  });

  it("resetFilters restores defaults", () => {
    useAppStore
      .getState()
      .setFilters({ timeOfDay: "AM", occasion: "Formal" });
    useAppStore.getState().resetFilters();

    const filters = useAppStore.getState().filters;
    expect(filters.timeOfDay).toBe("ANY");
    expect(filters.occasion).toBe("Casual");
  });

  it("setFilters updates flags", () => {
    useAppStore.getState().setFilters({
      flags: { office: true, wfh: false, travel: false, goingOut: false },
    });
    expect(useAppStore.getState().filters.flags.office).toBe(true);
    expect(useAppStore.getState().filters.flags.wfh).toBe(false);
  });
});

// ========================================
// CompletionSlice
// ========================================
describe("CompletionSlice", () => {
  const dateKey = "2026-02-09";

  it("toggleStepCompletion creates nested structure and toggles", () => {
    useAppStore
      .getState()
      .toggleStepCompletion(dateKey, "Skincare", "r-1", 1, true);
    expect(
      useAppStore.getState().getStepCompletion(dateKey, "Skincare", "r-1", 1)
    ).toBe(true);
  });

  it("getStepCompletion returns false for untracked step", () => {
    expect(
      useAppStore.getState().getStepCompletion(dateKey, "Haircare", "r-99", 1)
    ).toBe(false);
  });

  it("getSectionCompletion calculates percentage", () => {
    useAppStore
      .getState()
      .toggleStepCompletion(dateKey, "Skincare", "r-1", 1, true);
    useAppStore
      .getState()
      .toggleStepCompletion(dateKey, "Skincare", "r-1", 2, false);

    const pct = useAppStore
      .getState()
      .getSectionCompletion(dateKey, "Skincare", 2);
    expect(pct).toBe(50);
  });

  it("getSectionCompletion returns 0 when totalSteps is 0", () => {
    const pct = useAppStore
      .getState()
      .getSectionCompletion(dateKey, "Empty", 0);
    expect(pct).toBe(0);
  });

  it("product completion toggle works", () => {
    useAppStore.getState().toggleProductCompletion(dateKey, "p-1");
    expect(
      useAppStore.getState().getProductCompletion(dateKey, "p-1")
    ).toBe(true);

    useAppStore.getState().toggleProductCompletion(dateKey, "p-1");
    expect(
      useAppStore.getState().getProductCompletion(dateKey, "p-1")
    ).toBe(false);
  });

  it("getProductCompletion returns false for untracked product", () => {
    expect(
      useAppStore.getState().getProductCompletion(dateKey, "p-unknown")
    ).toBe(false);
  });

  it("cleanupStaleCompletions prunes old entries", () => {
    // Add an old entry with a date in the past
    useAppStore
      .getState()
      .toggleStepCompletion("2020-01-01", "Skincare", "r-1", 1, true);
    useAppStore
      .getState()
      .toggleProductCompletion("2020-01-01", "p-1");

    // Add a recent entry
    useAppStore
      .getState()
      .toggleStepCompletion(dateKey, "Skincare", "r-1", 1, true);

    useAppStore.getState().cleanupStaleCompletions(30);

    // Old entry should be pruned
    expect(
      useAppStore.getState().completions["2020-01-01"]
    ).toBeUndefined();
    expect(
      useAppStore.getState().productCompletions["2020-01-01"]
    ).toBeUndefined();

    // Recent entry should remain
    expect(
      useAppStore.getState().completions[dateKey]
    ).toBeDefined();
  });
});
