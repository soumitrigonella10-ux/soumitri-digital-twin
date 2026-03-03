// ========================================
// Additional performance utility tests
// deepEqual, additional array operations
// ========================================

import { describe, it, expect } from "vitest";
import {
  createMemoizedSelector,
  optimizedArrayOperations,
} from "@/lib/performance";
import { config } from "@/lib/config";

// deepEqual is not exported, but we can test it indirectly
// or import the module and test the exported utilities

// ========================================
// createMemoizedSelector (additional tests)
// ========================================
describe("createMemoizedSelector extended", () => {
  it("returns same result for same reference input", () => {
    const selector = createMemoizedSelector((x: number[]) => x.reduce((a, b) => a + b, 0));
    const input = [1, 2, 3];
    const r1 = selector(input);
    const r2 = selector(input);
    expect(r1).toBe(6);
    expect(r2).toBe(6);
    // Same reference, should be cached
    expect(r1 === r2).toBe(true);
  });

  it("recomputes when reference changes", () => {
    const spy = { count: 0 };
    const selector = createMemoizedSelector((x: number[]) => {
      spy.count++;
      return x.length;
    });
    selector([1, 2]);
    selector([1, 2, 3]);
    expect(spy.count).toBe(2);
  });

  it("works with object inputs", () => {
    const selector = createMemoizedSelector((obj: { a: number }) => obj.a * 2);
    const obj = { a: 5 };
    expect(selector(obj)).toBe(10);
    expect(selector(obj)).toBe(10); // cached
  });
});

// ========================================
// optimizedArrayOperations (extended)
// ========================================
describe("optimizedArrayOperations extended", () => {
  describe("chunk", () => {
    it("handles chunk size larger than array", () => {
      const result = optimizedArrayOperations.chunk([1, 2], 10);
      expect(result).toEqual([[1, 2]]);
    });

    it("handles chunk size of 1", () => {
      const result = optimizedArrayOperations.chunk([1, 2, 3], 1);
      expect(result).toEqual([[1], [2], [3]]);
    });

    it("handles empty array", () => {
      const result = optimizedArrayOperations.chunk([], 5);
      expect(result).toEqual([]);
    });
  });

  describe("unique", () => {
    it("removes duplicate primitives", () => {
      expect(optimizedArrayOperations.unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    });

    it("removes duplicates with key selector", () => {
      const items = [
        { id: "a", val: 1 },
        { id: "b", val: 2 },
        { id: "a", val: 3 },
      ];
      const result = optimizedArrayOperations.unique(items, (i) => i.id);
      expect(result).toHaveLength(2);
      expect(result[0]!.val).toBe(1); // first occurrence kept
    });

    it("handles empty array", () => {
      expect(optimizedArrayOperations.unique([])).toEqual([]);
    });

    it("handles all unique items", () => {
      expect(optimizedArrayOperations.unique([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("groupBy", () => {
    it("groups by key selector", () => {
      const items = [
        { type: "a", val: 1 },
        { type: "b", val: 2 },
        { type: "a", val: 3 },
      ];
      const result = optimizedArrayOperations.groupBy(items, (i) => i.type);
      expect(result["a"]).toHaveLength(2);
      expect(result["b"]).toHaveLength(1);
    });

    it("groups by numeric key", () => {
      const nums = [1, 2, 3, 4, 5, 6];
      const result = optimizedArrayOperations.groupBy(nums, (n) => n % 2 === 0 ? "even" : "odd");
      expect(result["even"]).toEqual([2, 4, 6]);
      expect(result["odd"]).toEqual([1, 3, 5]);
    });

    it("handles empty array", () => {
      const result = optimizedArrayOperations.groupBy([], () => "x");
      expect(result).toEqual({});
    });
  });
});

// ========================================
// config.performance
// ========================================
describe("config.performance", () => {
  it("has expected keys", () => {
    expect(config.performance.debounceDelay).toBe(300);
    expect(config.performance.animationDuration).toBe(200);
    expect(config.performance.lazyLoadThreshold).toBe(50);
    expect(config.performance.cacheTTL).toBe(300000); // 5 minutes
  });

  it("config values are numbers", () => {
    // TypeScript ensures readonly, but verify they exist
    expect(typeof config.performance.debounceDelay).toBe("number");
    expect(typeof config.performance.animationDuration).toBe("number");
    expect(typeof config.performance.lazyLoadThreshold).toBe("number");
    expect(typeof config.performance.cacheTTL).toBe("number");
  });
});
