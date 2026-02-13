// ========================================
// Custom Hook: useWeekNavigation
// Handles week navigation logic.
// setFilters is a synchronous Zustand update, so no async/loading needed.
// ========================================

import { useMemo, useCallback } from "react";
import { startOfWeek, addDays } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

export function useWeekNavigation() {
  const { filters, setFilters } = useAppStore();

  // Memoize week boundaries to avoid recreating Date objects every render
  const weekStart = useMemo(
    () => startOfWeek(filters.date, { weekStartsOn: 1 }),
    [filters.date]
  );
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const goToPreviousWeek = useCallback(() => {
    setFilters({ date: addDays(weekStart, -7) });
  }, [weekStart, setFilters]);

  const goToNextWeek = useCallback(() => {
    setFilters({ date: addDays(weekStart, 7) });
  }, [weekStart, setFilters]);

  const goToToday = useCallback(() => {
    setFilters({ date: new Date() });
  }, [setFilters]);

  return {
    weekStart,
    weekEnd,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  };
}