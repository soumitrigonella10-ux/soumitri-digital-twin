"use client";

import { useEffect, useMemo, useState } from "react";
import { format, getDay } from "date-fns";
import {
  Sun,
  Sparkles,
  Target,
  Dumbbell,
  Coffee,
  UtensilsCrossed,
  Moon,
  Info,
  Wind,
  Droplets,
  Play,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { SmartSection } from "@/components/TaskTile";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";

// Helper to get products for today filtered by routine type, day, and time
function getTodayProducts(
  products: Product[],
  routineType: string,
  dayOfWeek: number,
  timeOfDay?: TimeOfDay
) {
  return products
    .filter((p) => {
      // Must match routine type
      if (p.routineType !== routineType) return false;
      // Must be scheduled for today (or has no weekday restriction)
      if (p.weekdays && !p.weekdays.includes(dayOfWeek)) return false;
      // Time filter (if specified)
      if (timeOfDay && timeOfDay !== "ANY") {
        if (p.timeOfDay && p.timeOfDay !== "ANY" && p.timeOfDay !== timeOfDay) return false;
      }
      return true;
    })
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
}

// Product card component for homepage
function ProductCard({
  product,
  isCompleted,
  onToggle,
  colorClass,
}: {
  product: Product;
  isCompleted: boolean;
  onToggle: () => void;
  colorClass: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
        isCompleted ? "bg-gray-50 opacity-60" : "bg-white hover:bg-gray-50",
        "border",
        isCompleted ? "border-gray-200" : "border-gray-100"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className={cn("w-5 h-5 flex-shrink-0", colorClass)} />
      ) : (
        <Circle className="w-5 h-5 flex-shrink-0 text-gray-300" />
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm", isCompleted && "line-through text-gray-400")}>
          {product.name}
        </p>
        <p className="text-xs text-gray-400">{product.category}</p>
      </div>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          product.timeOfDay === "AM"
            ? "bg-amber-100 text-amber-700"
            : product.timeOfDay === "PM"
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {product.timeOfDay || "Any"}
      </span>
    </button>
  );
}

export default function TodayPage() {
  const { 
    data, 
    toggleProductCompletion, 
    getProductCompletion,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeOfDay | "ALL">("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const dayOfWeek = getDay(today);
  const dateKey = format(today, "yyyy-MM-dd");

  // Get products for today, sorted by display order
  const todaySkinProducts = useMemo(() => {
    let products = getTodayProducts(data.products, "skin", dayOfWeek);
    if (timeFilter !== "ALL") {
      products = products.filter(p => p.timeOfDay === timeFilter || p.timeOfDay === "ANY");
    }
    return products;
  }, [data.products, dayOfWeek, timeFilter]);

  const todayBodyProducts = useMemo(() => {
    let products = getTodayProducts(data.products, "body", dayOfWeek);
    if (timeFilter !== "ALL") {
      products = products.filter(p => p.timeOfDay === timeFilter || p.timeOfDay === "ANY");
    }
    return products;
  }, [data.products, dayOfWeek, timeFilter]);

  const todayBodySpecificProducts = useMemo(() => {
    let products = getTodayProducts(data.products, "bodySpecific", dayOfWeek);
    if (timeFilter !== "ALL") {
      products = products.filter(p => p.timeOfDay === timeFilter || p.timeOfDay === "ANY");
    }
    return products;
  }, [data.products, dayOfWeek, timeFilter]);

  const todayHairProducts = useMemo(() => {
    let products = getTodayProducts(data.products, "hair", dayOfWeek);
    if (timeFilter !== "ALL") {
      products = products.filter(p => p.timeOfDay === timeFilter || p.timeOfDay === "ANY");
    }
    return products;
  }, [data.products, dayOfWeek, timeFilter]);

  // Calculate product section progress
  const getProductProgress = (products: Product[]) => {
    if (products.length === 0) return 0;
    const completed = products.filter(p => getProductCompletion(dateKey, p.id)).length;
    return Math.round((completed / products.length) * 100);
  };

  // Get today's meals filtered by weekday
  const getTodayMeals = (mealType: "breakfast" | "lunch" | "dinner") => {
    return data.mealTemplates.filter((m) => {
      // Must match meal type
      if (m.mealType !== mealType) return false;
      // Must be scheduled for today (or has no weekday restriction)
      if (m.weekdays && m.weekdays.length > 0 && !m.weekdays.includes(dayOfWeek)) return false;
      return true;
    });
  };

  const breakfastMeals = getTodayMeals("breakfast");
  const lunchMeals = getTodayMeals("lunch");
  const dinnerMeals = getTodayMeals("dinner");

  // Get today's workout
  const todayWorkout = data.workoutPlans.find((w) =>
    w.weekday.includes(dayOfWeek)
  );

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
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-2xl bg-category-today flex items-center justify-center">
            <Sun className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today</h1>
            <p className="text-gray-500">
              {format(today, "EEEE, MMMM d")}
            </p>
          </div>
        </div>
      </header>

      {/* Time Filter */}
      <div className="flex gap-2">
        {(["ALL", "AM", "PM"] as const).map((time) => (
          <button
            key={time}
            onClick={() => setTimeFilter(time as TimeOfDay | "ALL")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
              timeFilter === time
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {time === "AM" && <Sun className="w-4 h-4" />}
            {time === "PM" && <Moon className="w-4 h-4" />}
            {time === "ALL" ? "All Day" : `${time} Routine`}
          </button>
        ))}
      </div>

      {/* Skin Products Section */}
      {todaySkinProducts.length > 0 && (
        <SmartSection
          title="Skin & Face"
          subtitle={`${todaySkinProducts.length} products for today`}
          icon={<Sparkles className="w-5 h-5 text-pink-500" />}
          color="skin"
          progress={getProductProgress(todaySkinProducts)}
        >
          <div className="space-y-2">
            {todaySkinProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={getProductCompletion(dateKey, product.id)}
                onToggle={() => toggleProductCompletion(dateKey, product.id)}
                colorClass="text-pink-500"
              />
            ))}
          </div>
        </SmartSection>
      )}

      {/* Body Products Section */}
      {todayBodyProducts.length > 0 && (
        <SmartSection
          title="Body Care"
          subtitle={`${todayBodyProducts.length} products for today`}
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
          color="body"
          progress={getProductProgress(todayBodyProducts)}
        >
          <div className="space-y-2">
            {todayBodyProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={getProductCompletion(dateKey, product.id)}
                onToggle={() => toggleProductCompletion(dateKey, product.id)}
                colorClass="text-blue-500"
              />
            ))}
          </div>
        </SmartSection>
      )}

      {/* Body Specific Products Section */}
      {todayBodySpecificProducts.length > 0 && (
        <SmartSection
          title="Targeted Care"
          subtitle="High-priority sensitive areas"
          icon={<Target className="w-5 h-5 text-purple-500" />}
          color="bodySpecific"
          progress={getProductProgress(todayBodySpecificProducts)}
        >
          <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3 text-purple-700">
              <Info className="w-4 h-4" />
              <span className="text-xs font-medium">Priority Care Zone</span>
            </div>
            <div className="space-y-2">
              {todayBodySpecificProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompleted={getProductCompletion(dateKey, product.id)}
                  onToggle={() => toggleProductCompletion(dateKey, product.id)}
                  colorClass="text-purple-500"
                />
              ))}
            </div>
          </div>
        </SmartSection>
      )}

      {/* Hair Products Section */}
      {todayHairProducts.length > 0 && (
        <SmartSection
          title="Hair Care"
          subtitle={dayOfWeek === 6 ? "Wash Day!" : `${todayHairProducts.length} products for today`}
          icon={<Wind className="w-5 h-5 text-yellow-500" />}
          color="hair"
          progress={getProductProgress(todayHairProducts)}
        >
          <div className="space-y-2">
            {todayHairProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={getProductCompletion(dateKey, product.id)}
                onToggle={() => toggleProductCompletion(dateKey, product.id)}
                colorClass="text-yellow-500"
              />
            ))}
          </div>
        </SmartSection>
      )}

      {/* Movement Section */}
      {todayWorkout && (
        <SmartSection
          title="Movement"
          subtitle="Today's workout"
          icon={<Dumbbell className="w-5 h-5 text-red-500" />}
          color="fitness"
        >
          <div className="lifeos-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{todayWorkout.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{todayWorkout.durationMin} minutes</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-colors">
                <Play className="w-4 h-4" />
                Start
              </button>
            </div>
          </div>
        </SmartSection>
      )}

      {/* Fueling Section */}
      <SmartSection
        title="Fueling"
        subtitle="Today's meals"
        icon={<Coffee className="w-5 h-5 text-amber-500" />}
        color="breakfast"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Breakfast */}
          <div className="lifeos-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-500 uppercase">Breakfast</span>
            </div>
            {breakfastMeals.length > 0 ? (
              <div className="space-y-2">
                {breakfastMeals.map((meal) => (
                  <div key={meal.id}>
                    <p className="font-medium text-gray-900 text-sm">{meal.name}</p>
                    {meal.ingredients && meal.ingredients.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.ingredients.slice(0, 3).map(i => i.name).join(", ")}
                        {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} more`}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.items.slice(0, 3).join(", ")}
                      </p>
                    )}
                    {meal.prepTimeMin && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTimeMin + (meal.cookTimeMin || 0)} min
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No meals scheduled</p>
            )}
          </div>

          {/* Lunch */}
          <div className="lifeos-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-500 uppercase">Lunch</span>
            </div>
            {lunchMeals.length > 0 ? (
              <div className="space-y-2">
                {lunchMeals.map((meal) => (
                  <div key={meal.id}>
                    <p className="font-medium text-gray-900 text-sm">{meal.name}</p>
                    {meal.ingredients && meal.ingredients.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.ingredients.slice(0, 3).map(i => i.name).join(", ")}
                        {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} more`}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.items.slice(0, 3).join(", ")}
                      </p>
                    )}
                    {meal.prepTimeMin && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTimeMin + (meal.cookTimeMin || 0)} min
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No meals scheduled</p>
            )}
          </div>

          {/* Dinner */}
          <div className="lifeos-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-gray-500 uppercase">Dinner</span>
            </div>
            {dinnerMeals.length > 0 ? (
              <div className="space-y-2">
                {dinnerMeals.map((meal) => (
                  <div key={meal.id}>
                    <p className="font-medium text-gray-900 text-sm">{meal.name}</p>
                    {meal.ingredients && meal.ingredients.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.ingredients.slice(0, 3).map(i => i.name).join(", ")}
                        {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} more`}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {meal.items.slice(0, 3).join(", ")}
                      </p>
                    )}
                    {meal.prepTimeMin && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTimeMin + (meal.cookTimeMin || 0)} min
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No meals scheduled</p>
            )}
          </div>
        </div>
      </SmartSection>

      {/* Footer Note */}
      <footer className="text-center py-6">
        <p className="text-xs text-gray-400">
          All data is stored locally in your browser
        </p>
      </footer>
    </div>
  );
}
