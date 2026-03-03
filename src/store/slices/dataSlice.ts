import {
  products as seedProducts,
  routines as seedRoutines,
  wardrobe as seedWardrobe,
  meals as seedMeals,
  dressings as seedDressings,
  workouts as seedWorkouts,
  wishlist as seedWishlist,
} from "@/data/index";
import type { AppData, DataSlice, ImmerSliceCreator } from "../types";

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
// On first load, static TS data is shown instantly.
// initFromDb() then replaces it with DB data for cross-device sync.
// ========================================
export const createDataSlice: ImmerSliceCreator<DataSlice> = (set, get) => ({
  data: {
    products: seedProducts,
    routines: seedRoutines,
    wardrobe: seedWardrobe,
    mealTemplates: seedMeals,
    dressings: seedDressings,
    workoutPlans: seedWorkouts,
    wishlist: seedWishlist,
  },

  dbStatus: 'idle',

  // Fetch all domain data from Postgres via /api/seed-data
  // Falls back silently to static data if the request fails
  initFromDb: async () => {
    // Guard: only fetch once per session
    const current = get().dbStatus;
    if (current === 'loading' || current === 'ready') return;

    set((state) => { state.dbStatus = 'loading'; });

    try {
      const res = await fetch('/api/seed-data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (!json.success || !json.data) throw new Error('Invalid response');

      const db: AppData = json.data;

      set((state) => {
        // Only replace arrays that came back non-empty from DB.
        // If the DB table is empty, keep the static fallback.
        if (db.products?.length)      state.data.products      = db.products;
        if (db.routines?.length)      state.data.routines      = db.routines;
        if (db.wardrobe?.length)      state.data.wardrobe      = db.wardrobe;
        if (db.mealTemplates?.length) state.data.mealTemplates = db.mealTemplates;
        if (db.dressings?.length)     state.data.dressings     = db.dressings;
        if (db.workoutPlans?.length)  state.data.workoutPlans  = db.workoutPlans;
        if (db.wishlist?.length)      state.data.wishlist      = db.wishlist;
        state.dbStatus = 'ready';
      });
    } catch (e) {
      // Fail silently — static data remains as fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Store] DB hydration failed, using static data:', e);
      }
      set((state) => { state.dbStatus = 'error'; });
    }
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
