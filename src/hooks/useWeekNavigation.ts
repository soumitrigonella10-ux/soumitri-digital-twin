// ========================================
// Custom Hook: useWeekNavigation
// Handles week navigation logic with error boundaries
// ========================================

import { useState, useCallback } from "react";
import { startOfWeek, addDays } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

export function useWeekNavigation() {
  const { filters, setFilters } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate week boundaries
  const weekStart = startOfWeek(filters.date, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  // Navigate to previous week with loading state
  const goToPreviousWeek = useCallback(async () => {
    setIsLoading(true);
    try {
      const newDate = addDays(weekStart, -7);
      setFilters({ date: newDate });
    } catch (error) {
      console.error('Error navigating to previous week:', error);
    } finally {
      // Add small delay for better UX
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [weekStart, setFilters]);

  // Navigate to next week with loading state
  const goToNextWeek = useCallback(async () => {
    setIsLoading(true);
    try {
      const newDate = addDays(weekStart, 7);
      setFilters({ date: newDate });
    } catch (error) {
      console.error('Error navigating to next week:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [weekStart, setFilters]);

  // Jump to today
  const goToToday = useCallback(async () => {
    setIsLoading(true);
    try {
      setFilters({ date: new Date() });
    } catch (error) {
      console.error('Error navigating to today:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [setFilters]);

  return {
    weekStart,
    weekEnd,
    isLoading,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  };
}