import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { AppState } from "./types";
import type { WishlistItem } from "@/types";
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
            version: 2, // Bumped to invalidate stale localStorage with old image paths

            // Only persist user-generated data, not seed data
            partialize: (state) => ({
              completions: state.completions,
              productCompletions: state.productCompletions,
              data: {
                outfits: state.data.outfits,
                wishlist: state.data.wishlist,
              },
            }),

            // Merge persisted data with fresh seed data on hydration
            // Wrapped in try/catch to survive corrupted localStorage
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
                  data: {
                    ...currentState.data,
                    outfits: Array.isArray((persisted.data as Partial<AppState["data"]>)?.outfits)
                      ? (persisted.data as Partial<AppState["data"]>)!.outfits!
                      : [],
                    // Always refresh seed wishlist items with latest paths from code,
                    // while preserving any user-added items
                    wishlist: (() => {
                      const persistedWishlist = Array.isArray((persisted.data as Partial<AppState["data"]>)?.wishlist)
                        ? (persisted.data as Partial<AppState["data"]>)!.wishlist!
                        : [];
                      const seedIds = new Set(currentState.data.wishlist.map((i) => i.id));
                      const userAdded = persistedWishlist.filter((i) => !seedIds.has(i.id));
                      // Use fresh seed data (with correct paths) + merge purchase status from persisted
                      const refreshedSeed: WishlistItem[] = currentState.data.wishlist.map((seedItem) => {
                        const persItem = persistedWishlist.find((p) => p.id === seedItem.id);
                        if (persItem?.purchased) {
                          return { ...seedItem, purchased: persItem.purchased } as WishlistItem;
                        }
                        return seedItem;
                      });
                      return [...refreshedSeed, ...userAdded];
                    })(),
                  },
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
// Auto-cleanup: Prune stale completions on hydration
// Runs once when the store finishes loading from localStorage
// ========================================
if (typeof window !== "undefined") {
  const unsubHydration = useAppStore.persist.onFinishHydration(() => {
    useAppStore.getState().cleanupStaleCompletions();
    unsubHydration();
  });
}
