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


