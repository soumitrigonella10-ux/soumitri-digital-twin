// ========================================
// Tests for src/lib/performance.ts
// Array utilities, memoized selectors
// ========================================

import { describe, it, expect } from "vitest";
import {
  optimizedArrayOperations,
  createMemoizedSelector,
} from "@/lib/performance";
import { config } from "@/lib/config";

// ========================================
// optimizedArrayOperations.chunk
// ========================================
describe("optimizedArrayOperations.chunk", () => {
  it("chunks array into groups of specified size", () => {
    expect(optimizedArrayOperations.chunk([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it("returns single chunk for small arrays", () => {
    expect(optimizedArrayOperations.chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("handles empty array", () => {
    expect(optimizedArrayOperations.chunk([], 3)).toEqual([]);
  });

  it("handles chunk size of 1", () => {
    expect(optimizedArrayOperations.chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });
});

// ========================================
// optimizedArrayOperations.unique
// ========================================
describe("optimizedArrayOperations.unique", () => {
  it("removes duplicate primitives", () => {
    expect(optimizedArrayOperations.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it("removes duplicate strings", () => {
    expect(optimizedArrayOperations.unique(["a", "b", "a"])).toEqual(["a", "b"]);
  });

  it("preserves order", () => {
    expect(optimizedArrayOperations.unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  it("uses keySelector for complex objects", () => {
    const items = [
      { id: "1", name: "A" },
      { id: "2", name: "B" },
      { id: "1", name: "C" },
    ];
    const result = optimizedArrayOperations.unique(items, (i) => i.id);
    expect(result).toHaveLength(2);
    expect(result[0]!.name).toBe("A");
  });

  it("handles empty array", () => {
    expect(optimizedArrayOperations.unique([])).toEqual([]);
  });
});

// ========================================
// optimizedArrayOperations.groupBy
// ========================================
describe("optimizedArrayOperations.groupBy", () => {
  it("groups items by key", () => {
    const items = [
      { type: "fruit", name: "apple" },
      { type: "veg", name: "carrot" },
      { type: "fruit", name: "banana" },
    ];
    const grouped = optimizedArrayOperations.groupBy(items, (i) => i.type);
    expect(Object.keys(grouped)).toEqual(["fruit", "veg"]);
    expect(grouped["fruit"]).toHaveLength(2);
    expect(grouped["veg"]).toHaveLength(1);
  });

  it("handles empty array", () => {
    const grouped = optimizedArrayOperations.groupBy([], () => "key");
    expect(grouped).toEqual({});
  });

  it("handles single-group array", () => {
    const items = [{ k: "a" }, { k: "a" }];
    const grouped = optimizedArrayOperations.groupBy(items, (i) => i.k);
    expect(Object.keys(grouped)).toEqual(["a"]);
    expect(grouped["a"]).toHaveLength(2);
  });
});

// ========================================
// createMemoizedSelector
// ========================================
describe("createMemoizedSelector", () => {
  it("returns cached result for same reference input", () => {
    let callCount = 0;
    const selector = createMemoizedSelector((x: number) => {
      callCount++;
      return x * 2;
    });

    expect(selector(5)).toBe(10);
    expect(selector(5)).toBe(10);
    expect(callCount).toBe(1);
  });

  it("recomputes for different input", () => {
    let callCount = 0;
    const selector = createMemoizedSelector((x: number) => {
      callCount++;
      return x * 2;
    });

    expect(selector(5)).toBe(10);
    expect(selector(6)).toBe(12);
    expect(callCount).toBe(2);
  });

  it("uses reference equality (not deep equality)", () => {
    let callCount = 0;
    const selector = createMemoizedSelector((obj: { a: number }) => {
      callCount++;
      return obj.a;
    });

    const ref1 = { a: 1 };
    selector(ref1);
    selector(ref1); // same reference → cached
    expect(callCount).toBe(1);

    selector({ a: 1 }); // different reference → recomputes
    expect(callCount).toBe(2);
  });
});

// ========================================
// config.performance constants
// ========================================
describe("config.performance", () => {
  it("has expected keys", () => {
    expect(config.performance.debounceDelay).toBe(300);
    expect(config.performance.animationDuration).toBe(200);
    expect(config.performance.lazyLoadThreshold).toBe(50);
    expect(config.performance.cacheTTL).toBe(5 * 60 * 1000);
  });
});
