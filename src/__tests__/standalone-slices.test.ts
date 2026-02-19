// ========================================
// Tests for store slice utilities and structure validation
// Legacy per-domain slices (product, fitness, nutrition, wardrobe, wishlist)
// have been consolidated into the unified dataSlice.
// ========================================

import { describe, it, expect } from "vitest";
import { mergeById } from "@/store/slices/dataSlice";

// ========================================
// mergeById from dataSlice
// ========================================
describe("mergeById from dataSlice", () => {
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
// DataSlice shape validation
// ========================================
describe("DataSlice structure", () => {
  it("exports createDataSlice function", async () => {
    const { createDataSlice } = await import("@/store/slices/dataSlice");
    expect(createDataSlice).toBeDefined();
    expect(typeof createDataSlice).toBe("function");
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
