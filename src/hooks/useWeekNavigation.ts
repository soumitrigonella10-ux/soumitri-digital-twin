// ========================================
// Custom Hook: useWeekNavigation
// Handles week navigation logic with error state
// ========================================

import { useState, useCallback } from "react";
import { startOfWeek, addDays } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

export function useWeekNavigation() {
  const { filters, setFilters } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Calculate week boundaries
  const weekStart = startOfWeek(filters.date, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  // Navigate to previous week with loading state
  const goToPreviousWeek = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newDate = addDays(weekStart, -7);
      setFilters({ date: newDate });
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Failed to navigate to previous week");
      setError(err);
      console.error("[WeekNavigation]", err);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [weekStart, setFilters]);

  // Navigate to next week with loading state
  const goToNextWeek = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newDate = addDays(weekStart, 7);
      setFilters({ date: newDate });
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Failed to navigate to next week");
      setError(err);
      console.error("[WeekNavigation]", err);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [weekStart, setFilters]);

  // Jump to today
  const goToToday = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setFilters({ date: new Date() });
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Failed to navigate to today");
      setError(err);
      console.error("[WeekNavigation]", err);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [setFilters]);

  return {
    weekStart,
    weekEnd,
    isLoading,
    error,
    clearError: () => setError(null),
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  };
}