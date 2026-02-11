"use client";

import { useMemo } from "react";
import { Moon, Clock, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function DinnerPageContent() {
  const { data } = useAppStore();

  // Filter dinner meals
  const dinnerMeals = useMemo(() => {
    return data.mealTemplates.filter(
      (m) => m.mealType === "dinner" || m.timeOfDay === "PM" || m.name.toLowerCase().includes("dinner")
    );
  }, [data.mealTemplates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-dinner flex items-center justify-center">
            <Moon className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dinner</h1>
            <p className="text-gray-500">Evening meal templates</p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="lifeos-card p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-gray-500">6:00 - 8:00 PM</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Ideal window</p>
      </div>

      {/* Meal Templates */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Your Dishes ({dinnerMeals.length})
        </h2>

        {dinnerMeals.map((meal, index) => (
          <div
            key={meal.id}
            className="lifeos-card overflow-hidden animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Meal Header */}
            <div className="p-5">
              <h3 className="font-semibold text-gray-900">{meal.name}</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                  Evening
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
            </div>

            {/* Ingredients */}
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
                      <span className="text-xs text-indigo-600 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {meal.instructions && meal.instructions.length > 0 && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Instructions
                </p>
                <ol className="space-y-2">
                  {meal.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
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

        {dinnerMeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Moon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No dinner dishes found</p>
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="lifeos-card p-5 bg-indigo-50 border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-medium text-indigo-800">Dinner Tips</h3>
        </div>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Eat at least 3 hours before bed</li>
          <li>• Keep portions moderate</li>
          <li>• Include some protein and vegetables</li>
          <li>• Avoid heavy, fried foods late at night</li>
        </ul>
      </div>
    </div>
  );
}

export default function DinnerPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <DinnerPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
