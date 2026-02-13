import type { StateCreator } from "zustand";
import {
  products as seedProducts,
  routines as seedRoutines,
} from "@/data/index";
import {
  Product,
  Routine,
} from "@/types";

// ========================================
// Helper: Merge arrays by ID (upsert logic)
// ========================================
export function mergeById<T extends { id: string }>(base: T[], updates: T[]): T[] {
  const map = new Map(base.map((b) => [b.id, b]));
  updates.forEach((u) => map.set(u.id, u));
  return Array.from(map.values());
}

export interface ProductSlice {
  data: {
    products: Product[];
    routines: Routine[];
  };
  upsertProduct: (p: Product) => void;
  upsertRoutine: (r: Routine) => void;
}

export const createProductSlice: StateCreator<ProductSlice & Record<string, unknown>, [], [], ProductSlice> = (set) => ({
  data: {
    products: seedProducts,
    routines: seedRoutines,
  },
  upsertProduct: (p) =>
    set((state: any) => ({
      data: { ...state.data, products: mergeById(state.data.products, [p]) },
    })),
  upsertRoutine: (r) =>
    set((state: any) => ({
      data: { ...state.data, routines: mergeById(state.data.routines, [r]) },
    })),
});
