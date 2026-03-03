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
// Empty initial state — DB is the single source of truth.
// The store starts empty and loads everything via initFromDb().
// Static TS data files in @/data/* exist only for `scripts/seed.ts`.
// ========================================
const EMPTY_DATA: AppData = {
  products: [],
  routines: [],
  wardrobe: [],
  mealTemplates: [],
  dressings: [],
  workoutPlans: [],
  wishlist: [],
};

// ========================================
// Data slice — all domain data + CRUD + wishlist
// initFromDb() runs once on hydration to populate from PostgreSQL.
// refreshFromDb() is called after admin CRUD mutations.
// ========================================
export const createDataSlice: ImmerSliceCreator<DataSlice> = (set, get) => ({
  data: { ...EMPTY_DATA },

  dbStatus: 'idle',

  // Fetch all domain data from Postgres via /api/seed-data (once per session)
  initFromDb: async () => {
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
        state.data.products      = db.products      ?? [];
        state.data.routines      = db.routines      ?? [];
        state.data.wardrobe      = db.wardrobe      ?? [];
        state.data.mealTemplates = db.mealTemplates ?? [];
        state.data.dressings     = db.dressings     ?? [];
        state.data.workoutPlans  = db.workoutPlans  ?? [];
        state.data.wishlist      = db.wishlist      ?? [];
        state.dbStatus = 'ready';
      });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Store] DB hydration failed:', e);
      }
      set((state) => { state.dbStatus = 'error'; });
    }
  },

  // Force re-fetch from DB after admin mutations (products/routines CRUD)
  refreshFromDb: async () => {
    set((state) => { state.dbStatus = 'loading'; });

    try {
      const res = await fetch('/api/seed-data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (!json.success || !json.data) throw new Error('Invalid response');

      const db: AppData = json.data;

      set((state) => {
        state.data.products      = db.products      ?? [];
        state.data.routines      = db.routines      ?? [];
        state.data.wardrobe      = db.wardrobe      ?? [];
        state.data.mealTemplates = db.mealTemplates ?? [];
        state.data.dressings     = db.dressings     ?? [];
        state.data.workoutPlans  = db.workoutPlans  ?? [];
        state.data.wishlist      = db.wishlist      ?? [];
        state.dbStatus = 'ready';
      });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Store] DB refresh failed:', e);
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
  refreshWorkoutData: () => {
    // Re-fetch from DB — workouts are managed in PostgreSQL
    get().refreshFromDb();
  },
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
