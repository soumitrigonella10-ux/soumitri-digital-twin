// ========================================
// Nutrition Domain Types
// ========================================

import type { TimeOfDay } from "./routines";

// ========================================
// Meal Template
// ========================================
export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
  category?: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  mealType: "breakfast" | "lunch" | "dinner";
  items: string[];
  ingredients?: Ingredient[];
  instructions?: string[];
  weekdays?: number[];
  prepTimeMin?: number;
  cookTimeMin?: number;
  servings?: number;
  tags?: string[];
}

// ========================================
// Dressing
// ========================================
export interface Dressing {
  id: string;
  name: string;
  shelfLifeDays: number;
  ingredients: string[];
}
