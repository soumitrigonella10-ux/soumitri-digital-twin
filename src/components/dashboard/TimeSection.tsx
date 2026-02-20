"use client";

import type { ReactNode } from "react";
import { Sunrise, Sun, Moon } from "lucide-react";
import type { TimeOfDay, MealTemplate, Product, WorkoutPlan } from "@/types";
import { TimeSectionTabs } from "./TimeSectionTabs";
import { MealSection } from "./MealSection";
import { FitnessSection } from "./FitnessSection";
import { RoutinesSection } from "./RoutinesSection";
import { WellnessSection } from "./WellnessSection";

// ─── Config per time period ───

interface TimePeriodConfig {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}

const TIME_PERIOD_CONFIG: Record<TimeOfDay, TimePeriodConfig> = {
  AM: {
    icon: <Sunrise className="w-5 h-5 text-telugu-kavi" />,
    iconBg: "bg-red-50",
    title: "Morning (5AM - 12PM)",
    subtitle: "Start your day right",
  },
  MIDDAY: {
    icon: <Sun className="w-5 h-5 text-telugu-kavi" />,
    iconBg: "bg-red-50",
    title: "Midday (12PM - 5PM)",
    subtitle: "Recharge and refuel",
  },
  PM: {
    icon: <Moon className="w-5 h-5 text-telugu-kavi" />,
    iconBg: "bg-red-50",
    title: "Evening (5PM onwards)",
    subtitle: "Wind down and care",
  },
  ANY: {
    icon: <Sun className="w-5 h-5 text-gray-600" />,
    iconBg: "bg-gray-100",
    title: "Any Time",
    subtitle: "",
  },
};

// ─── Tab content router ───

interface TabContentProps {
  timeOfDay: TimeOfDay;
  activeTab: string;
  getTodayMeals: (mealType: "breakfast" | "lunch" | "dinner") => MealTemplate[];
  todayWorkout: WorkoutPlan | undefined;
  products: Product[];
  dayOfWeek: number;
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
}

function TabContent({
  timeOfDay,
  activeTab,
  getTodayMeals,
  todayWorkout,
  products,
  dayOfWeek,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
}: TabContentProps) {
  switch (activeTab) {
    case "breakfast":
      return <MealSection meals={getTodayMeals("breakfast")} mealType="breakfast" />;
    case "lunch":
      return <MealSection meals={getTodayMeals("lunch")} mealType="lunch" />;
    case "dinner":
      return <MealSection meals={getTodayMeals("dinner")} mealType="dinner" />;
    case "fitness":
      return <FitnessSection todayWorkout={todayWorkout} />;
    case "routines":
      return (
        <RoutinesSection
          products={products}
          dayOfWeek={dayOfWeek}
          timeOfDay={timeOfDay}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
        />
      );
    case "wellness":
      return (
        <WellnessSection
          products={products}
          dayOfWeek={dayOfWeek}
          timeOfDay={timeOfDay}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
        />
      );
    default:
      return <p className="text-center text-gray-400 py-8">Select a category</p>;
  }
}

// ─── TimeSection: wraps a single time period (AM / MIDDAY / PM) ───

interface TimeSectionProps {
  timeOfDay: TimeOfDay;
  activeTab: string;
  onTabChange: (tab: string) => void;
  getTodayMeals: (mealType: "breakfast" | "lunch" | "dinner") => MealTemplate[];
  todayWorkout: WorkoutPlan | undefined;
  products: Product[];
  dayOfWeek: number;
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
}

export function TimeSection({
  timeOfDay,
  activeTab,
  onTabChange,
  getTodayMeals,
  todayWorkout,
  products,
  dayOfWeek,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
}: TimeSectionProps) {
  const config = TIME_PERIOD_CONFIG[timeOfDay];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          {config.icon}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{config.title}</h2>
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        </div>
      </div>

      <TimeSectionTabs
        timeOfDay={timeOfDay}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <div className="min-h-[150px] sm:min-h-[200px]">
        <TabContent
          timeOfDay={timeOfDay}
          activeTab={activeTab}
          getTodayMeals={getTodayMeals}
          todayWorkout={todayWorkout}
          products={products}
          dayOfWeek={dayOfWeek}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
        />
      </div>
    </div>
  );
}
