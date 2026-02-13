// ========================================
// Custom Hook: useWeekPlans
// Handles computing and caching week plans with error handling
// ========================================

import { useMemo } from "react";
import { addDays } from "date-fns";
import { computeDayPlan } from "@/lib/compute";
import { useAppStore } from "@/store/useAppStore";
import type { DayPlan } from "@/types";

interface UseWeekPlansOptions {
  weekStart: Date;
}

interface UseWeekPlansReturn {
  weekPlans: DayPlan[];
  isValidData: boolean;
  error: Error | null;
}

export function useWeekPlans({ weekStart }: UseWeekPlansOptions): UseWeekPlansReturn {
  const { filters, data } = useAppStore();

  const result = useMemo(() => {
    try {
      // Validate required data
      if (!data.products || !data.routines) {
        return {
          weekPlans: [],
          isValidData: false,
          error: new Error('Missing product or routine data'),
        };
      }

      // Generate plans for each day of the week
      const plans: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        return computeDayPlan({
          date: day,
          timeOfDay: filters.timeOfDay,
          flags: filters.flags,
          occasion: filters.occasion,
          bodyAreas: filters.bodyAreas,
          products: data.products,
          routines: data.routines,
        });
      });

      return {
        weekPlans: plans,
        isValidData: true,
        error: null,
      };
    } catch (error) {
      console.error('Error computing week plans:', error);
      return {
        weekPlans: [],
        isValidData: false,
        error: error instanceof Error ? error : new Error('Unknown error computing week plans'),
      };
    }
  }, [weekStart, filters, data.products, data.routines]);

  return result;
}