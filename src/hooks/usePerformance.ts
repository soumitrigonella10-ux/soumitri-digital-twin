// ========================================
// Performance React Hooks
//
// Moved from lib/performance.ts to enforce the architectural boundary:
// React hooks live in src/hooks/, pure utilities live in src/lib/.
// ========================================

import { useCallback, useEffect, useRef } from "react";

// ========================================
// Debounce Hook
// ========================================
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Clear pending timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

// ========================================
// Stable Callback Hook
// ========================================
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// ========================================
// Deep Memo Hook
// ========================================
function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, (b as unknown[])[i]));
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}

export function useDeepMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const prevDeps = useRef<React.DependencyList>();
  const value = useRef<T>();

  const depsChanged =
    !prevDeps.current ||
    prevDeps.current.length !== deps.length ||
    deps.some((dep, index) => !deepEqual(dep, prevDeps.current![index]));

  if (depsChanged) {
    value.current = factory();
    prevDeps.current = deps;
  }

  return value.current!;
}
