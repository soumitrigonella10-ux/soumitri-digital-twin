import { MealTemplate } from "@/types";
import { breakfastMeals } from "./breakfast";
import { lunchMeals } from "./lunch";
import { dinnerMeals } from "./dinner";

// Re-export individual meal arrays
export { breakfastMeals } from "./breakfast";
export { lunchMeals, lunchBowlConfig } from "./lunch";
export { dinnerMeals } from "./dinner";
export { lunchDressings } from "./dressings";
export type { DressingRecipe } from "./dressings";

// Combined meals array
export const meals: MealTemplate[] = [
  ...breakfastMeals,
  ...lunchMeals,
  ...dinnerMeals,
];
