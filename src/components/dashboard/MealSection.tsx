"use client";

import { Clock } from "lucide-react";
import type { MealTemplate } from "@/types";
import { MEAL_THEMES } from "./constants";

interface MealSectionProps {
  meals: MealTemplate[];
  mealType: "breakfast" | "lunch" | "dinner";
}

export function MealSection({ meals, mealType }: MealSectionProps) {
  const theme = MEAL_THEMES[mealType];

  if (meals.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        No {mealType} scheduled
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <div key={meal.id} className="lifeos-card">
          {/* Meal Header */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-900">{meal.name}</h4>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 ${theme.badgeClass} rounded-full text-xs`}>
                {theme.label}
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
            <div className="px-3 sm:px-4 pb-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                Ingredients
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meal.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate">{ing.name}</span>
                    <span className={`text-xs ${theme.accentClass} font-medium whitespace-nowrap ml-2`}>
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && meal.instructions.length > 0 && (
            <div className="px-3 sm:px-4 pb-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                Instructions
              </p>
              <ol className="space-y-2">
                {meal.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2 sm:gap-3">
                    <span className={`w-6 h-6 rounded-full ${theme.stepBgClass} ${theme.stepTextClass} flex items-center justify-center text-xs font-medium flex-shrink-0`}>
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
            <div className="px-3 sm:px-4 pb-4 border-t border-gray-100 pt-4">
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
    </div>
  );
}
