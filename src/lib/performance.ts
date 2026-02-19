// ========================================
// Performance Utilities (pure functions — no React dependency)
//
// React performance hooks have been moved to src/hooks/usePerformance.ts
// to enforce the architectural boundary: hooks → src/hooks/, utils → src/lib/.
// Re-exports below maintain backward compatibility.
// ========================================

// Re-export React hooks for backward compatibility
export { useDebounce, useStableCallback, useDeepMemo } from "@/hooks/usePerformance";

// ========================================
// Memoized Selectors (pure utility)
// ========================================
export const createMemoizedSelector = <T, R>(
  selector: (input: T) => R
) => {
  let lastInput: T;
  let lastResult: R;

  return (input: T): R => {
    if (input === lastInput) {
      return lastResult;
    }

    lastInput = input;
    lastResult = selector(input);
    return lastResult;
  };
};

// ========================================
// Constants for Performance
// ========================================
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  LAZY_LOAD_THRESHOLD: 50,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// ========================================
// Memory-efficient array operations (pure utility)
// ========================================
export const optimizedArrayOperations = {
  // Efficient chunking for large arrays
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Efficient unique operation
  unique: <T>(
    array: T[],
    keySelector?: (item: T) => string | number
  ): T[] => {
    if (!keySelector) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  // Efficient groupBy operation
  groupBy: <T>(
    array: T[],
    keySelector: (item: T) => string | number
  ): Record<string, T[]> => {
    return array.reduce(
      (groups, item) => {
        const key = String(keySelector(item));
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      },
      {} as Record<string, T[]>
    );
  },
};