// ========================================
// Performance Utilities (pure functions — no React dependency)
//
// React performance hooks live in src/hooks/usePerformance.ts
// to enforce the architectural boundary: hooks → src/hooks/, utils → src/lib/.
// ========================================

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