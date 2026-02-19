// ========================================
// Service Layer — Domain Business Logic
//
// Services sit between components/hooks and the store, providing:
// - Domain-specific query methods
// - Business rule encapsulation
// - Composable operations that don't belong in individual slices
//
// This layer makes business logic testable independently of React
// and prevents components from containing domain logic directly.
//
// Architecture:
//   Component → Hook → Service → Store/Repository
//
// Usage:
//   import { routineService, wardrobeService } from "@/lib/services";
// ========================================

import type {
  Product,
  Routine,
  RoutineType,
  TimeOfDay,
  BodyArea,
  WardrobeItem,
  WardrobeCategory,
  WishlistItem,
  MealTemplate,
  WorkoutPlan,
} from "@/types";

// ========================================
// Routine Service — filtering & querying routines and products
// ========================================
export const routineService = {
  /** Get products for a specific routine type */
  getProductsByType(products: Product[], type: RoutineType): Product[] {
    return products.filter((p) => p.routineType === type);
  },

  /** Get products active on a specific day */
  getProductsForDay(products: Product[], weekday: number): Product[] {
    return products.filter(
      (p) => !p.weekdays || p.weekdays.includes(weekday)
    );
  },

  /** Get products filtered by time of day */
  getProductsByTime(products: Product[], time: TimeOfDay): Product[] {
    return products.filter(
      (p) => !p.timeOfDay || p.timeOfDay === time || p.timeOfDay === "ANY"
    );
  },

  /** Get products filtered by body area */
  getProductsByBodyArea(products: Product[], area: BodyArea): Product[] {
    return products.filter(
      (p) => p.bodyAreas && p.bodyAreas.includes(area)
    );
  },

  /** Get routines matching schedule for a given weekday */
  getRoutinesForDay(routines: Routine[], weekday: number): Routine[] {
    return routines.filter((r) => {
      if (r.schedule.weekday?.includes(weekday)) return true;
      if (r.schedule.frequencyPerWeek && r.schedule.frequencyPerWeek > 0)
        return true;
      return false;
    });
  },

  /** Get routines by type */
  getRoutinesByType(routines: Routine[], type: RoutineType): Routine[] {
    return routines.filter((r) => r.type === type);
  },

  /** Count products with caution tags */
  getCautionProducts(products: Product[]): Product[] {
    return products.filter(
      (p) => p.cautionTags && p.cautionTags.length > 0
    );
  },
} as const;

// ========================================
// Wardrobe Service — filtering & querying wardrobe items
// ========================================
export const wardrobeService = {
  /** Get items by category */
  getByCategory(
    items: WardrobeItem[],
    category: WardrobeCategory
  ): WardrobeItem[] {
    return items.filter((i) => i.category === category);
  },

  /** Get items by occasion */
  getByOccasion(items: WardrobeItem[], occasion: string): WardrobeItem[] {
    return items.filter((i) => i.occasion === occasion);
  },

  /** Get unique categories from items */
  getCategories(items: WardrobeItem[]): WardrobeCategory[] {
    return [...new Set(items.map((i) => i.category))];
  },

  /** Get unique subcategories for a category */
  getSubcategories(
    items: WardrobeItem[],
    category: WardrobeCategory
  ): string[] {
    return [
      ...new Set(
        items
          .filter((i) => i.category === category && i.subcategory)
          .map((i) => i.subcategory!)
      ),
    ];
  },
} as const;

// ========================================
// Wishlist Service
// ========================================
export const wishlistService = {
  /** Get unpurchased items */
  getPending(items: WishlistItem[]): WishlistItem[] {
    return items.filter((i) => !i.purchased);
  },

  /** Get purchased items */
  getPurchased(items: WishlistItem[]): WishlistItem[] {
    return items.filter((i) => i.purchased);
  },

  /** Calculate total pending cost */
  getTotalPendingCost(items: WishlistItem[]): number {
    return items
      .filter((i) => !i.purchased && i.price)
      .reduce((sum, i) => sum + (i.price ?? 0), 0);
  },
} as const;

// ========================================
// Nutrition Service
// ========================================
export const nutritionService = {
  /** Get meals by type */
  getMealsByType(
    meals: MealTemplate[],
    type: "breakfast" | "lunch" | "dinner"
  ): MealTemplate[] {
    return meals.filter((m) => m.mealType === type);
  },

  /** Get meals for a specific day */
  getMealsForDay(meals: MealTemplate[], weekday: number): MealTemplate[] {
    return meals.filter(
      (m) => !m.weekdays || m.weekdays.includes(weekday)
    );
  },

  /** Get meals matching tags */
  getMealsByTag(meals: MealTemplate[], tag: string): MealTemplate[] {
    return meals.filter((m) => m.tags?.includes(tag));
  },
} as const;

// ========================================
// Fitness Service
// ========================================
export const fitnessService = {
  /** Get workouts scheduled for a day */
  getWorkoutsForDay(
    workouts: WorkoutPlan[],
    weekday: number
  ): WorkoutPlan[] {
    return workouts.filter((w) => w.weekday.includes(weekday));
  },

  /** Calculate total weekly workout minutes */
  getWeeklyMinutes(workouts: WorkoutPlan[]): number {
    return workouts.reduce((sum, w) => sum + w.durationMin, 0);
  },

  /** Get workout days per week (unique days) */
  getTrainingDaysPerWeek(workouts: WorkoutPlan[]): number {
    const days = new Set(workouts.flatMap((w) => w.weekday));
    return days.size;
  },
} as const;
