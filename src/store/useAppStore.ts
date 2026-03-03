import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { AppState } from "./types";
import { createDataSlice } from "./slices/dataSlice";
import { createFilterSlice } from "./slices/filterSlice";
import { createCompletionSlice } from "./slices/completionSlice";

// Re-export types for consumers (backward compatible)
export type { ProductCompletionMap } from "./types";
export type { AppState, AppData } from "./types";

// ========================================
// Zustand Store — Properly composed from slices
// Middleware stack: immer → devtools → subscribeWithSelector → persist
//
// • immer:    Clean nested mutations via drafts (no manual spreads)
// • devtools: Redux DevTools integration in development
// • subscribeWithSelector: Fine-grained subscriptions for side effects
// • persist:  Smart localStorage persistence (only user-generated data)
// ========================================
export const useAppStore = create<AppState>()(
  immer(
    devtools(
      subscribeWithSelector(
        persist(
          (...a) => ({
            ...createDataSlice(...a),
            ...createFilterSlice(...a),
            ...createCompletionSlice(...a),
          }),
          {
            name: "routines-wardrobe-app",
            version: 4, // Bumped: wardrobe/wishlist now persist to DB, not localStorage

            // Only persist ephemeral tracking data (completions).
            // All domain data (products, routines, wardrobe, etc.)
            // is now sourced from PostgreSQL via /api/seed-data.
            partialize: (state) => ({
              completions: state.completions,
              productCompletions: state.productCompletions,
            }),

            // Merge persisted completions with fresh seed data on hydration
            merge: (persistedState, currentState) => {
              try {
                const persisted = persistedState as Partial<AppState>;
                if (!persisted || typeof persisted !== "object") {
                  return currentState;
                }
                return {
                  ...currentState,
                  completions: persisted.completions ?? {},
                  productCompletions: persisted.productCompletions ?? {},
                };
              } catch (e) {
                console.error("[Store] Failed to merge persisted state, resetting:", e);
                return currentState;
              }
            },
          }
        )
      ),
      {
        name: "RoutinesWardrobe",
        enabled: process.env.NODE_ENV === "development",
      }
    )
  )
);

// ========================================
// Post-hydration: prune stale completions & load DB data
// Runs once when the store finishes loading from localStorage
// ========================================
if (typeof window !== "undefined") {
  const unsubHydration = useAppStore.persist.onFinishHydration(() => {
    useAppStore.getState().cleanupStaleCompletions();

    // Replace static seed data with live DB data (async, non-blocking)
    useAppStore.getState().initFromDb();

    unsubHydration();
  });
}
