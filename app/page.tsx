"use client";

import { useEffect, useState, useCallback } from "react";
import { format, getDay } from "date-fns";
import {
  Sun,
  Moon,
  Sunrise,
  Activity,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { TimeSection } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { TimeOfDay } from "@/types";

function TodayContent() {
  const {
    data,
    toggleProductCompletion,
    getProductCompletion,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimeSection, setActiveTimeSection] = useState<TimeOfDay | "ALL">("ALL");
  const [activeTabs, setActiveTabs] = useState<{ AM: string; MIDDAY: string; PM: string }>({
    AM: "breakfast",
    MIDDAY: "lunch",
    PM: "dinner",
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const dayOfWeek = getDay(today);
  const dateKey = format(today, "yyyy-MM-dd");
  const currentHour = currentTime.getHours();

  const getCurrentTimePeriod = (): TimeOfDay => {
    if (currentHour >= 5 && currentHour < 12) return "AM";
    if (currentHour >= 12 && currentHour < 17) return "MIDDAY";
    return "PM";
  };
  const currentTimePeriod = getCurrentTimePeriod();

  const setActiveTab = useCallback((timePeriod: TimeOfDay, tab: string) => {
    setActiveTabs((prev) => ({ ...prev, [timePeriod]: tab }));
  }, []);

  const getTodayMeals = useCallback(
    (mealType: "breakfast" | "lunch" | "dinner") =>
      data.mealTemplates.filter((m) => {
        if (m.mealType !== mealType) return false;
        if (m.weekdays && m.weekdays.length > 0 && !m.weekdays.includes(dayOfWeek)) return false;
        return true;
      }),
    [data.mealTemplates, dayOfWeek]
  );

  const todayWorkout = data.workoutPlans.find((w) => w.weekday.includes(dayOfWeek));

  // Shared props passed to every TimeSection
  const sharedProps = {
    getTodayMeals,
    todayWorkout,
    products: data.products,
    dayOfWeek,
    dateKey,
    getProductCompletion,
    toggleProductCompletion,
  };

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-category-today flex items-center justify-center flex-shrink-0">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Today</h1>
            <p className="text-sm sm:text-base text-gray-500 truncate">
              {format(today, "EEEE, MMMM d")} • {format(currentTime, "h:mm a")}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Current Time</p>
            <p className="text-xs text-gray-500 capitalize">{currentTimePeriod.toLowerCase()} Period</p>
          </div>
        </div>

        {/* Time Period Toggle */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {(["AM", "MIDDAY", "PM"] as TimeOfDay[]).map((time) => (
            <button
              key={time}
              onClick={() => setActiveTimeSection(time)}
              className={cn(
                "flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border-2",
                activeTimeSection === time
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : time === currentTimePeriod
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              )}
            >
              {time === "AM" && <Sunrise className="w-4 h-4" />}
              {time === "MIDDAY" && <Sun className="w-4 h-4" />}
              {time === "PM" && <Moon className="w-4 h-4" />}
              {time === "MIDDAY" ? "Midday" : time}
              {time === currentTimePeriod && <Activity className="w-3 h-3" />}
            </button>
          ))}
          <button
            onClick={() => setActiveTimeSection("ALL")}
            className={cn(
              "flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border-2",
              activeTimeSection === "ALL"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            All
          </button>
        </div>
      </header>

      {/* AM Section */}
      {(activeTimeSection === "AM" || activeTimeSection === "ALL") && (
        <TimeSection
          timeOfDay="AM"
          activeTab={activeTabs.AM}
          onTabChange={(tab) => setActiveTab("AM", tab)}
          {...sharedProps}
        />
      )}

      {/* MIDDAY Section */}
      {(activeTimeSection === "MIDDAY" || activeTimeSection === "ALL") && (
        <TimeSection
          timeOfDay="MIDDAY"
          activeTab={activeTabs.MIDDAY}
          onTabChange={(tab) => setActiveTab("MIDDAY", tab)}
          {...sharedProps}
        />
      )}

      {/* PM Section */}
      {(activeTimeSection === "PM" || activeTimeSection === "ALL") && (
        <TimeSection
          timeOfDay="PM"
          activeTab={activeTabs.PM}
          onTabChange={(tab) => setActiveTab("PM", tab)}
          {...sharedProps}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <TodayContent />
      </div>
    </AuthenticatedLayout>
  );
}