"use client";

import { useMemo, useState, useEffect } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { computeDayPlan } from "@/lib/compute";
import { WeekPlanner } from "@/components/WeekPlanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeekPage() {
  const { filters, setFilters, data } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate week start (Monday)
  const weekStart = startOfWeek(filters.date, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  // Compute plans for each day of the week
  const weekPlans = useMemo(() => {
    return [...Array(7)].map((_, i) => {
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
  }, [weekStart, filters, data.products, data.routines]);

  // Navigate weeks
  const goToPreviousWeek = () => {
    setFilters({ date: addDays(weekStart, -7) });
  };

  const goToNextWeek = () => {
    setFilters({ date: addDays(weekStart, 7) });
  };

  const goToThisWeek = () => {
    setFilters({ date: new Date() });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Week Planner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your weekly routines
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Card className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </span>
            </div>
          </Card>

          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="secondary" size="sm" onClick={goToThisWeek}>
            Today
          </Button>
        </div>
      </div>

      {/* Week Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {weekPlans.reduce(
                (acc, p) =>
                  acc + p.sections.reduce((s, sec) => s + sec.totalSteps, 0),
                0
              )}
            </p>
            <p className="text-xs text-gray-500">Total Steps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {weekPlans.filter(
                (p) => p.sections.find((s) => s.key === "Workout")?.totalSteps
              ).length}
            </p>
            <p className="text-xs text-gray-500">Workout Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {weekPlans.reduce((acc, p) => acc + p.warnings.length, 0)}
            </p>
            <p className="text-xs text-gray-500">Warnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {weekPlans.filter(
                (p) => p.sections.find((s) => s.key === "Haircare")?.totalSteps
              ).length}
            </p>
            <p className="text-xs text-gray-500">Hair Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Week Planner Grid */}
      <WeekPlanner weekStart={weekStart} plans={weekPlans} />

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-1">
          <p>• Click any day to see the full plan details</p>
          <p>• Today is highlighted with a blue ring</p>
          <p>• The selected date is shown with a blue background</p>
          <p>• Warnings indicate potential conflicts for that day</p>
        </CardContent>
      </Card>
    </div>
  );
}
