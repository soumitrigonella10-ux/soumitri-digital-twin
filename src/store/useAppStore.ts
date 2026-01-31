import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  products as seedProducts,
  routines as seedRoutines,
  wardrobe as seedWardrobe,
  meals as seedMeals,
  dressings as seedDressings,
  workouts as seedWorkouts,
} from "@/data/index";
import {
  BodyArea,
  CompletionMap,
  Dressing,
  Filters,
  MealTemplate,
  Outfit,
  Product,
  Routine,
  TimeOfDay,
  WardrobeItem,
  WorkoutPlan,
} from "@/types";
import { format } from "date-fns";

// ========================================
// Helper: Merge arrays by ID (upsert logic)
// ========================================
function mergeById<T extends { id: string }>(base: T[], updates: T[]): T[] {
  const map = new Map(base.map((b) => [b.id, b]));
  updates.forEach((u) => map.set(u.id, u));
  return Array.from(map.values());
}

// Helper: Deep merge items by ID - seed always wins for core fields, persisted wins for user data
function mergeByIdDeep<T extends { id: string }>(seed: T[], persisted: T[]): T[] {
  const seedMap = new Map(seed.map((s) => [s.id, s]));
  
  // Start with all seed items (ensures new seed items are included)
  const result = new Map<string, T>();
  
  // Add all seed items first
  seed.forEach((s) => result.set(s.id, s));
  
  // For persisted items, only keep user-specific data (completions, etc.)
  // Seed data (product definitions, routines) should always come from seed
  persisted.forEach((p) => {
    const seedItem = seedMap.get(p.id);
    if (seedItem) {
      // Seed wins - use seed data entirely for known items
      // This ensures updated product definitions (timeOfDay, weekdays, etc.) take effect
      result.set(p.id, seedItem);
    } else {
      // Item only in persisted (user added), keep as is
      result.set(p.id, p);
    }
  });
  
  return Array.from(result.values());
}

// ========================================
// App Data State
// ========================================
interface AppData {
  products: Product[];
  routines: Routine[];
  wardrobe: WardrobeItem[];
  mealTemplates: MealTemplate[];
  dressings: Dressing[];
  workoutPlans: WorkoutPlan[];
  outfits: Outfit[];
}

// ========================================
// Default Filter State
// ========================================
const defaultFilters: Filters = {
  date: new Date(),
  timeOfDay: "ANY" as TimeOfDay,
  flags: {
    office: false,
    wfh: true,
    travel: false,
    goingOut: false,
  },
  occasion: "Casual",
  bodyAreas: ["UA", "IT", "BL", "IA", "B"] as BodyArea[],
};

// ========================================
// Product Completion Map Type
// ========================================
export type ProductCompletionMap = Record<
  string, // dateKey (yyyy-MM-dd)
  Record<string, boolean> // productId => done
>;

// ========================================
// Store Interface
// ========================================
interface AppState {
  // Data
  data: AppData;

  // Filters
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  resetFilters: () => void;

  // Completion tracking
  completions: CompletionMap;
  toggleStepCompletion: (
    dateKey: string,
    sectionKey: string,
    routineId: string,
    stepOrder: number,
    value: boolean
  ) => void;
  getSectionCompletion: (
    dateKey: string,
    sectionKey: string,
    totalSteps: number
  ) => number;
  getStepCompletion: (
    dateKey: string,
    sectionKey: string,
    routineId: string,
    stepOrder: number
  ) => boolean;

  // Product completion tracking
  productCompletions: ProductCompletionMap;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
  getProductCompletion: (dateKey: string, productId: string) => boolean;

  // Outfit management
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: string) => void;

  // Admin CRUD operations
  upsertProduct: (p: Product) => void;
  upsertRoutine: (r: Routine) => void;
  upsertWardrobe: (w: WardrobeItem) => void;
  upsertMeal: (m: MealTemplate) => void;
  upsertDressing: (d: Dressing) => void;
  upsertWorkout: (w: WorkoutPlan) => void;
  deleteById: (type: keyof AppData, id: string) => void;

  // Filter presets
  savePreset: (name: string) => void;
  loadPresetNames: () => string[];
  loadPreset: (name: string) => void;
  deletePreset: (name: string) => void;
}

// ========================================
// Zustand Store with Persistence
// ========================================
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ----------------------------------------
      // Initial Data (seeded)
      // ----------------------------------------
      data: {
        products: seedProducts,
        routines: seedRoutines,
        wardrobe: seedWardrobe,
        mealTemplates: seedMeals,
        dressings: seedDressings,
        workoutPlans: seedWorkouts,
        outfits: [],
      },

      // ----------------------------------------
      // Filters
      // ----------------------------------------
      filters: defaultFilters,

      setFilters: (update) =>
        set((state) => ({
          filters: { ...state.filters, ...update },
        })),

      resetFilters: () =>
        set(() => ({
          filters: { ...defaultFilters, date: new Date() },
        })),

      // ----------------------------------------
      // Completion Tracking
      // ----------------------------------------
      completions: {},

      toggleStepCompletion: (dateKey, sectionKey, routineId, stepOrder, value) => {
        set((state) => {
          const completions = { ...state.completions };

          // Initialize nested structure if needed
          if (!completions[dateKey]) {
            completions[dateKey] = {};
          }
          if (!completions[dateKey][sectionKey]) {
            completions[dateKey][sectionKey] = {};
          }
          if (!completions[dateKey][sectionKey][routineId]) {
            completions[dateKey][sectionKey][routineId] = {};
          }

          completions[dateKey][sectionKey][routineId][stepOrder] = value;

          return { completions };
        });
      },

      getSectionCompletion: (dateKey, sectionKey, totalSteps) => {
        const completions = get().completions[dateKey]?.[sectionKey];
        if (!completions || totalSteps === 0) return 0;

        let doneCount = 0;
        Object.values(completions).forEach((routineSteps) => {
          Object.values(routineSteps).forEach((done) => {
            if (done) doneCount++;
          });
        });

        return Math.round((doneCount / totalSteps) * 100);
      },

      getStepCompletion: (dateKey, sectionKey, routineId, stepOrder) => {
        return (
          get().completions[dateKey]?.[sectionKey]?.[routineId]?.[stepOrder] ??
          false
        );
      },

      // ----------------------------------------
      // Product Completion Tracking
      // ----------------------------------------
      productCompletions: {},

      toggleProductCompletion: (dateKey, productId) => {
        set((state) => {
          const productCompletions = { ...state.productCompletions };
          
          if (!productCompletions[dateKey]) {
            productCompletions[dateKey] = {};
          }
          
          productCompletions[dateKey][productId] = !productCompletions[dateKey][productId];
          
          return { productCompletions };
        });
      },

      getProductCompletion: (dateKey, productId) => {
        return get().productCompletions[dateKey]?.[productId] ?? false;
      },

      // ----------------------------------------
      // Outfit Management
      // ----------------------------------------
      addOutfit: (outfit) =>
        set((state) => ({
          data: {
            ...state.data,
            outfits: [...state.data.outfits, outfit],
          },
        })),

      removeOutfit: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            outfits: state.data.outfits.filter((o) => o.id !== id),
          },
        })),

      // ----------------------------------------
      // Admin CRUD
      // ----------------------------------------
      upsertProduct: (p) =>
        set((state) => ({
          data: {
            ...state.data,
            products: mergeById(state.data.products, [p]),
          },
        })),

      upsertRoutine: (r) =>
        set((state) => ({
          data: {
            ...state.data,
            routines: mergeById(state.data.routines, [r]),
          },
        })),

      upsertWardrobe: (w) =>
        set((state) => ({
          data: {
            ...state.data,
            wardrobe: mergeById(state.data.wardrobe, [w]),
          },
        })),

      upsertMeal: (m) =>
        set((state) => ({
          data: {
            ...state.data,
            mealTemplates: mergeById(state.data.mealTemplates, [m]),
          },
        })),

      upsertDressing: (d) =>
        set((state) => ({
          data: {
            ...state.data,
            dressings: mergeById(state.data.dressings, [d]),
          },
        })),

      upsertWorkout: (w) =>
        set((state) => ({
          data: {
            ...state.data,
            workoutPlans: mergeById(state.data.workoutPlans, [w]),
          },
        })),

      deleteById: (type, id) =>
        set((state) => ({
          data: {
            ...state.data,
            [type]: (state.data[type] as { id: string }[]).filter(
              (item) => item.id !== id
            ),
          },
        })),

      // ----------------------------------------
      // Filter Presets (stored in localStorage separately)
      // ----------------------------------------
      savePreset: (name) => {
        const key = `rw-preset:${name}`;
        const filters = get().filters;
        const serialized = {
          ...filters,
          date: format(filters.date, "yyyy-MM-dd"),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(serialized));
        }
      },

      loadPresetNames: () => {
        if (typeof window === "undefined") return [];
        const keys = Object.keys(localStorage);
        return keys
          .filter((k) => k.startsWith("rw-preset:"))
          .map((k) => k.replace("rw-preset:", ""));
      },

      loadPreset: (name) => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(`rw-preset:${name}`);
        if (!raw) return;

        try {
          const parsed = JSON.parse(raw);
          set((state) => ({
            filters: {
              ...state.filters,
              ...parsed,
              date: new Date(parsed.date),
            },
          }));
        } catch {
          console.error("Failed to parse preset");
        }
      },

      deletePreset: (name) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(`rw-preset:${name}`);
        }
      },
    }),
    {
      name: "routines-wardrobe-app",
      partialize: (state) => ({
        // Only persist completions, NOT data (products, routines, etc.)
        // Data should always come from seed files
        completions: state.completions,
        productCompletions: state.productCompletions,
        // Don't persist filters.date as it should default to today
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;
        
        // Always use seed data for products, routines, meals, etc.
        // Only restore completions from localStorage
        return {
          ...currentState,
          completions: persisted.completions ?? {},
          productCompletions: persisted.productCompletions ?? {},
        };
      },
    }
  )
);
