"use client";

import { Clock, ChefHat, Leaf } from "lucide-react";
import type { MealTemplate } from "@/types";
import { MEAL_THEMES } from "./constants";
import { lunchBowlConfig } from "@/data/meals/lunch";

interface MealSectionProps {
  meals: MealTemplate[];
  mealType: "breakfast" | "lunch" | "dinner";
}

/* ─── Static rice-bowl card for the dashboard when no DB lunch exists ─── */
function LunchBowlFallback() {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[new Date().getDay()];
  const todayPortion = lunchBowlConfig.proteinPortions.find((p) =>
    p.days.split("/").some((d) => d.trim() === today)
  );

  return (
    <div className="lifeos-card overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-emerald-500" />
          <h4 className="font-semibold text-gray-900">Daily Rice Bowl</h4>
        </div>
        <p className="text-xs text-gray-500 mt-1">Rice + Salad + Protein rotation</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
            Midday
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            15 min
          </span>
        </div>
      </div>

      {/* Bowl breakdown */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
        {/* Base */}
        <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium text-gray-800">{lunchBowlConfig.base.item}</span>
          <span className="text-xs text-amber-600 font-medium">{lunchBowlConfig.base.quantity}</span>
        </div>

        {/* Salad options */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
            <Leaf className="w-3 h-3 text-green-500" /> Salad <span className="text-green-500 normal-case">(pick any)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {lunchBowlConfig.salads.map((s, i) => (
              <div key={i} className="p-2 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-800">{s.name}</span>
                {s.options && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{s.options.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Proteins */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Protein <span className="text-purple-500 normal-case">(pick one)</span></p>
          <div className="flex gap-2">
            {lunchBowlConfig.proteinOptions.map((p, i) => (
              <div key={i} className="flex-1 p-2 bg-purple-50 rounded-lg text-center border border-dashed border-purple-200">
                <span className="text-sm text-gray-800">{p.name}</span>
                <p className="text-[11px] text-purple-600 font-medium">{p.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Today's portion */}
        {todayPortion && (
          <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
            <span className="text-xs text-gray-600">{today}&apos;s protein</span>
            <span className="text-xs text-emerald-600 font-semibold">{todayPortion.quantity}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function MealSection({ meals, mealType }: MealSectionProps) {
  const theme = MEAL_THEMES[mealType];

  if (meals.length === 0) {
    /* Show the rice-bowl model for lunch instead of "No lunch scheduled" */
    if (mealType === "lunch") return <LunchBowlFallback />;

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
