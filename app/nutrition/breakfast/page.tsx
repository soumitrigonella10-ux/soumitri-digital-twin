"use client";

import { useState, useMemo } from "react";
import { Coffee, Plus, Clock, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function BreakfastPageContent() {
  const { data } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");

  // Filter breakfast meals
  const breakfastMeals = useMemo(() => {
    return data.mealTemplates.filter(
      (m) => m.mealType === "breakfast" || m.timeOfDay === "AM" || m.name.toLowerCase().includes("breakfast")
    );
  }, [data.mealTemplates]);

  // Apply day filter
  const filteredMeals = useMemo(() => {
    if (activeDayFilter === "ALL") return breakfastMeals;
    return breakfastMeals.filter(
      (m) => !m.weekdays || m.weekdays.length === 0 || m.weekdays.includes(activeDayFilter)
    );
  }, [breakfastMeals, activeDayFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-breakfast flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Breakfast</h1>
            <p className="text-gray-500">Morning meal templates</p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="lifeos-card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{breakfastMeals.length}</p>
          <p className="text-sm text-gray-500">Dishes</p>
        </div>
        <div className="lifeos-card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-500">7:00 - 9:00 AM</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Ideal window</p>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
        <button
          onClick={() => setActiveDayFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            activeDayFilter === "ALL"
              ? "bg-amber-100 text-amber-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All Days
        </button>
        {DAYS_OF_WEEK.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDayFilter(index)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeDayFilter === index
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meal Templates */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Your Dishes ({filteredMeals.length})
        </h2>

        {filteredMeals.map((meal, index) => (
          <div
            key={meal.id}
            className="lifeos-card overflow-hidden animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Meal Header */}
            <div className="p-5">
              <h3 className="font-semibold text-gray-900">{meal.name}</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                  Morning
                </span>
                {meal.prepTimeMin && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {meal.prepTimeMin + (meal.cookTimeMin || 0)} min
                  </span>
                )}
                {meal.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Schedule Days (read-only) */}
              <div className="mt-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {!meal.weekdays || meal.weekdays.length === 0
                    ? "Every day"
                    : meal.weekdays.length === 7
                    ? "Daily"
                    : meal.weekdays.map((d) => DAYS_OF_WEEK[d]).join(", ")}
                </span>
              </div>
            </div>

            {/* Ingredients - Always visible */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Ingredients
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {meal.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{ing.name}</span>
                      <span className="text-xs text-amber-600 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions - Always visible */}
            {meal.instructions && meal.instructions.length > 0 && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Instructions
                </p>
                <ol className="space-y-2">
                  {meal.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Simple items fallback */}
            {(!meal.ingredients || meal.ingredients.length === 0) && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Components
                </p>
                <div className="flex flex-wrap gap-2">
                  {meal.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredMeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No breakfast dishes found</p>
            <p className="text-sm">Try a different day filter or add new dishes</p>
          </div>
        )}
      </div>

      {/* Add New Template Button */}
      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Breakfast Dish</span>
      </button>

      {/* Tips Card */}
      <div className="lifeos-card p-5 bg-amber-50 border-amber-100">
        <h3 className="font-medium text-amber-800 mb-2">Breakfast Tips</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Eat within 1-2 hours of waking</li>
          <li>• Include protein for sustained energy</li>
          <li>• Add fiber for digestion</li>
          <li>• Hydrate before eating</li>
        </ul>
      </div>
    </div>
  );
}

export default function BreakfastPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <BreakfastPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
