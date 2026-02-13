import type { StateCreator } from "zustand";
import { meals as seedMeals, dressings as seedDressings } from "@/data/index";
import { Dressing, MealTemplate } from "@/types";
import { mergeById } from "./productSlice";

export interface NutritionSlice {
  data: {
    mealTemplates: MealTemplate[];
    dressings: Dressing[];
  };
  upsertMeal: (m: MealTemplate) => void;
  upsertDressing: (d: Dressing) => void;
}

export const createNutritionSlice: StateCreator<NutritionSlice & Record<string, unknown>, [], [], NutritionSlice> = (set) => ({
  data: {
    mealTemplates: seedMeals,
    dressings: seedDressings,
  },
  upsertMeal: (m) =>
    set((state: any) => ({
      data: { ...state.data, mealTemplates: mergeById(state.data.mealTemplates, [m]) },
    })),
  upsertDressing: (d) =>
    set((state: any) => ({
      data: { ...state.data, dressings: mergeById(state.data.dressings, [d]) },
    })),
});
