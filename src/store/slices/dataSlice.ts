import {
  products as seedProducts,
  routines as seedRoutines,
  wardrobe as seedWardrobe,
  meals as seedMeals,
  dressings as seedDressings,
  workouts as seedWorkouts,
  wishlist as seedWishlist,
} from "@/data/index";
import type { DataSlice, ImmerSliceCreator } from "../types";

// ========================================
// Helper: Merge arrays by ID (upsert logic)
// ========================================
export function mergeById<T extends { id: string }>(base: T[], updates: T[]): T[] {
  const map = new Map(base.map((b) => [b.id, b]));
  updates.forEach((u) => map.set(u.id, u));
  return Array.from(map.values());
}

// ========================================
// Data slice — all domain data + CRUD + wishlist
// Uses immer for clean nested mutations
// ========================================
export const createDataSlice: ImmerSliceCreator<DataSlice> = (set) => ({
  data: {
    products: seedProducts,
    routines: seedRoutines,
    wardrobe: seedWardrobe,
    mealTemplates: seedMeals,
    dressings: seedDressings,
    workoutPlans: seedWorkouts,
    wishlist: seedWishlist,
  },

  // --- CRUD operations (immer draft mutations) ---
  upsertProduct: (p) =>
    set((state) => {
      state.data.products = mergeById(state.data.products, [p]);
    }),
  upsertRoutine: (r) =>
    set((state) => {
      state.data.routines = mergeById(state.data.routines, [r]);
    }),
  upsertWardrobe: (w) =>
    set((state) => {
      state.data.wardrobe = mergeById(state.data.wardrobe, [w]);
    }),
  upsertMeal: (m) =>
    set((state) => {
      state.data.mealTemplates = mergeById(state.data.mealTemplates, [m]);
    }),
  upsertDressing: (d) =>
    set((state) => {
      state.data.dressings = mergeById(state.data.dressings, [d]);
    }),
  upsertWorkout: (w) =>
    set((state) => {
      state.data.workoutPlans = mergeById(state.data.workoutPlans, [w]);
    }),
  refreshWorkoutData: () =>
    set((state) => {
      state.data.workoutPlans = seedWorkouts;
    }),
  deleteById: (type, id) =>
    set((state) => {
      const arr = state.data[type] as { id: string }[];
      const idx = arr.findIndex((item) => item.id === id);
      if (idx !== -1) arr.splice(idx, 1);
    }),

  // --- Wishlist operations ---
  addWishlistItem: (item) =>
    set((state) => {
      state.data.wishlist.push(item);
    }),
  updateWishlistItem: (item) =>
    set((state) => {
      state.data.wishlist = mergeById(state.data.wishlist, [item]);
    }),
  removeWishlistItem: (id) =>
    set((state) => {
      const idx = state.data.wishlist.findIndex((i) => i.id === id);
      if (idx !== -1) state.data.wishlist.splice(idx, 1);
    }),
  markWishlistItemPurchased: (id) =>
    set((state) => {
      const item = state.data.wishlist.find((i) => i.id === id);
      if (item) {
        item.purchased = true;
      }
    }),
});
