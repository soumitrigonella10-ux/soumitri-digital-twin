// ========================================
// Performance utility functions and constants
// Centralized performance optimizations
// ========================================

import { useCallback, useMemo, useRef } from "react";

// ========================================
// Debounce Hook
// ========================================
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback as T;
}

// ========================================
// Memoized Selectors
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
// Memory-efficient array operations
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
  unique: <T>(array: T[], keySelector?: (item: T) => string | number): T[] => {
    if (!keySelector) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  // Efficient groupBy operation
  groupBy: <T>(array: T[], keySelector: (item: T) => string | number): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const key = String(keySelector(item));
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
};

// ========================================
// React Performance Hooks
// ========================================
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const prevDeps = useRef<React.DependencyList>();
  const value = useRef<T>();

  const depsChanged = !prevDeps.current || 
    deps.some((dep, index) => dep !== prevDeps.current![index]);

  if (depsChanged) {
    value.current = factory();
    prevDeps.current = deps;
  }

  return value.current!;
}