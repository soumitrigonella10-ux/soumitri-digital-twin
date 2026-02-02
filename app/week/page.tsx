"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Home } from "lucide-react";
import { useWeekNavigation } from "@/hooks/useWeekNavigation";
import { useWeekPlans } from "@/hooks/useWeekPlans";
import { WeekPlanner } from "@/components/WeekPlanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingPage, LoadingGrid } from "@/components/LoadingStates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeekPage() {
  return (
    <ErrorBoundary 
      fallbackTitle="Week View Error"
      fallbackMessage="There was a problem loading the week view. Please try refreshing the page."
    >
      <WeekPageContent />
    </ErrorBoundary>
  );
}

function WeekPageContent() {
  const navigation = useWeekNavigation();
  const { weekPlans, isValidData, error } = useWeekPlans({ 
    weekStart: navigation.weekStart 
  });

  // Handle data loading errors
  if (error && !isValidData) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <div className="h-6 w-6 text-red-600">⚠️</div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Data Loading Error</h2>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (navigation.isLoading) {
    return <LoadingPage title="Loading week..." />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <WeekHeader navigation={navigation} />
        <WeekStats weekPlans={weekPlans} />
        <WeekContent weekPlans={weekPlans} weekStart={navigation.weekStart} />
        <WeekLegend />
      </div>
    </div>
  );
}

interface WeekHeaderProps {
  navigation: ReturnType<typeof useWeekNavigation>;
}

function WeekHeader({ navigation }: WeekHeaderProps) {
  const { weekStart, weekEnd, goToPreviousWeek, goToNextWeek, goToToday } = navigation;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Week Planner</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your weekly routines
        </p>
      </div>

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

        <Button variant="secondary" size="sm" onClick={goToToday}>
          <Home className="mr-1 h-3 w-3" />
          Today
        </Button>
      </div>
    </div>
  );
}

interface WeekStatsProps {
  weekPlans: ReturnType<typeof useWeekPlans>['weekPlans'];
}

function WeekStats({ weekPlans }: WeekStatsProps) {
  const stats = {
    totalSteps: weekPlans.reduce(
      (acc, p) => acc + p.sections.reduce((s, sec) => s + sec.totalSteps, 0),
      0
    ),
    workoutDays: weekPlans.filter(
      (p) => p.sections.find((s) => s.key === "Workout")?.totalSteps
    ).length,
    warnings: weekPlans.reduce((acc, p) => acc + p.warnings.length, 0),
    hairDays: weekPlans.filter(
      (p) => p.sections.find((s) => s.key === "Haircare")?.totalSteps
    ).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.totalSteps}</p>
          <p className="text-xs text-gray-500">Total Steps</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.workoutDays}</p>
          <p className="text-xs text-gray-500">Workout Days</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.warnings}</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.hairDays}</p>
          <p className="text-xs text-gray-500">Hair Days</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface WeekContentProps {
  weekPlans: ReturnType<typeof useWeekPlans>['weekPlans'];
  weekStart: Date;
}

function WeekContent({ weekPlans, weekStart }: WeekContentProps) {
  if (!weekPlans.length) {
    return <LoadingGrid columns={7} rows={1} className="grid-cols-7" />;
  }

  return <WeekPlanner weekStart={weekStart} plans={weekPlans} />;
}

function WeekLegend() {
  return (
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
  );
}
