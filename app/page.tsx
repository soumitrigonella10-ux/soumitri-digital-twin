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
  Sunrise,
  Heart,
  Activity,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { SmartSection } from "@/components/TaskTile";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay, BodyArea } from "@/types";

// Body Area configuration for tags
const BODY_AREAS = {
  UA: { name: "UA", fullName: "Underarm", color: "bg-blue-100 text-blue-700" },
  IT: { name: "IT", fullName: "Inner Thigh", color: "bg-pink-100 text-pink-700" },
  BL: { name: "BL", fullName: "Bikini Line", color: "bg-rose-100 text-rose-700" },
  IA: { name: "IA", fullName: "Intimate Area", color: "bg-purple-100 text-purple-700" },
  B: { name: "B", fullName: "Belly/Stomach", color: "bg-green-100 text-green-700" },
  LIPS: { name: "Lips", fullName: "Lips", color: "bg-red-100 text-red-700" },
} as const;

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
        <div className="flex items-center gap-1 flex-wrap">
          <p className="text-xs text-gray-400">{product.category}</p>
          {/* Body Area Tags */}
          {product.bodyAreas?.map((area, idx) => {
            const areaData = BODY_AREAS[area as keyof typeof BODY_AREAS];
            if (!areaData) return null;
            return (
              <span
                key={`area-${idx}`}
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  isCompleted && "opacity-50 grayscale",
                  areaData.color
                )}
                title={areaData.fullName}
              >
                {areaData.name}
              </span>
            );
          })}
          {/* Lip Care special case */}
          {product.category === "Lip Care" && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                isCompleted && "opacity-50 grayscale",
                BODY_AREAS.LIPS.color
              )}
              title={BODY_AREAS.LIPS.fullName}
            >
              {BODY_AREAS.LIPS.name}
            </span>
          )}
        </div>
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimeSection, setActiveTimeSection] = useState<TimeOfDay | "ALL">("ALL");
  const [activeTabs, setActiveTabs] = useState<{
    AM: string;
    MIDDAY: string; 
    PM: string;
  }>({
    AM: "breakfast",
    MIDDAY: "lunch",
    PM: "dinner"
  });

  useEffect(() => {
    setMounted(true);
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const dayOfWeek = getDay(today);
  const dateKey = format(today, "yyyy-MM-dd");
  const currentHour = currentTime.getHours();

  // Determine current time period
  const getCurrentTimePeriod = (): TimeOfDay => {
    if (currentHour >= 5 && currentHour < 12) return "AM";
    if (currentHour >= 12 && currentHour < 17) return "MIDDAY"; 
    return "PM";
  };

  const currentTimePeriod = getCurrentTimePeriod();

  // Set active tab for current time period
  const setActiveTab = (timePeriod: TimeOfDay, tab: string) => {
    setActiveTabs(prev => ({
      ...prev,
      [timePeriod]: tab
    }));
  };

  // Get products for specific time and routine type
  const getProductsForTime = (routineType: string, timeOfDay: TimeOfDay) => {
    return getTodayProducts(data.products, routineType, dayOfWeek, timeOfDay);
  };

  // Get wellness products (general wellness items)
  const getWellnessProducts = (timeOfDay: TimeOfDay) => {
    return data.products.filter(p => 
      p.routineType === "wellness" && 
      (p.weekdays === undefined || p.weekdays.includes(dayOfWeek)) &&
      (p.timeOfDay === timeOfDay || p.timeOfDay === "ANY")
    );
  };

  // Get today's meals filtered by weekday and meal type
  const getTodayMeals = (mealType: "breakfast" | "lunch" | "dinner") => {
    return data.mealTemplates.filter((m) => {
      if (m.mealType !== mealType) return false;
      if (m.weekdays && m.weekdays.length > 0 && !m.weekdays.includes(dayOfWeek)) return false;
      return true;
    });
  };

  // Get today's workout
  const todayWorkout = data.workoutPlans.find((w) =>
    w.weekday.includes(dayOfWeek)
  );

  // Time section component
  const TimeSectionTabs = ({ 
    timeOfDay, 
    activeTab, 
    onTabChange 
  }: { 
    timeOfDay: TimeOfDay; 
    activeTab: string; 
    onTabChange: (tab: string) => void; 
  }) => {
    const getTabsForTime = (time: TimeOfDay) => {
      switch (time) {
        case "AM":
          return [
            { id: "breakfast", label: "Food", icon: <Coffee className="w-4 h-4" /> },
            { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
            { id: "routines", label: "Routines", icon: <Sparkles className="w-4 h-4" /> },
            { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> }
          ];
        case "MIDDAY":
          return [
            { id: "lunch", label: "Food", icon: <UtensilsCrossed className="w-4 h-4" /> },
            { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> }
          ];
        case "PM":
          return [
            { id: "dinner", label: "Food", icon: <Moon className="w-4 h-4" /> },
            { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
            { id: "routines", label: "Routines", icon: <Sparkles className="w-4 h-4" /> },
            { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> }
          ];
        default:
          return [];
      }
    };

    const tabs = getTabsForTime(timeOfDay);

    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2",
              activeTab === tab.id
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // Render content for active tab in time section
  const renderTabContent = (timeOfDay: TimeOfDay, activeTab: string) => {
    switch (activeTab) {
      case "breakfast":
        const breakfastMeals = getTodayMeals("breakfast");
        return (
          <div className="space-y-3">
            {breakfastMeals.length > 0 ? breakfastMeals.map((meal) => (
              <div key={meal.id} className="lifeos-card">
                {/* Meal Header */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900">{meal.name}</h4>
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
                </div>

                {/* Ingredients */}
                {meal.ingredients && meal.ingredients.length > 0 && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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

                {/* Instructions */}
                {meal.instructions && meal.instructions.length > 0 && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
            )) : (
              <p className="text-center text-gray-400 py-8">No breakfast scheduled</p>
            )}
          </div>
        );
      
      case "lunch":
        const lunchMeals = getTodayMeals("lunch");
        return (
          <div className="space-y-3">
            {lunchMeals.length > 0 ? lunchMeals.map((meal) => (
              <div key={meal.id} className="lifeos-card">
                {/* Meal Header */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                      Midday
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
                          <span className="text-xs text-orange-600 font-medium">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {meal.instructions && meal.instructions.length > 0 && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                      Instructions
                    </p>
                    <ol className="space-y-2">
                      {meal.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
            )) : (
              <p className="text-center text-gray-400 py-8">No lunch scheduled</p>
            )}
          </div>
        );

      case "dinner":
        const dinnerMeals = getTodayMeals("dinner");
        return (
          <div className="space-y-3">
            {dinnerMeals.length > 0 ? dinnerMeals.map((meal) => (
              <div key={meal.id} className="lifeos-card">
                {/* Meal Header */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900">{meal.name}</h4>
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
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
            )) : (
              <p className="text-center text-gray-400 py-8">No dinner scheduled</p>
            )}
          </div>
        );

      case "fitness":
        return (
          <div className="space-y-3">
            {todayWorkout ? (
              <div className="lifeos-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{todayWorkout.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{todayWorkout.durationMin} minutes</span>
                    </div>
                    {todayWorkout.goal && (
                      <p className="text-sm text-gray-600 mt-2">{todayWorkout.goal}</p>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-colors">
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No workout scheduled</p>
            )}
          </div>
        );

      case "routines":
        const skinProducts = getProductsForTime("skin", timeOfDay);
        const bodyProducts = getProductsForTime("body", timeOfDay);
        const bodySpecificProducts = getProductsForTime("bodySpecific", timeOfDay);
        
        return (
          <div className="space-y-6">
            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skin Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Skin Care</h3>
                  <span className="text-xs text-gray-500">({skinProducts.length})</span>
                </div>
                <div className="space-y-2">
                  {skinProducts.length > 0 ? skinProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(
                        "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
                        getProductCompletion(dateKey, product.id)
                          ? "bg-gray-50 border-gray-200 opacity-70"
                          : "bg-white border-pink-200 hover:border-pink-300 hover:shadow-sm"
                      )}
                      style={{ animationDelay: `${index * 75}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-medium text-sm text-gray-900 transition-all",
                            getProductCompletion(dateKey, product.id) && "line-through text-gray-500"
                          )}>
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-md text-xs font-medium">
                              {product.category}
                            </span>
                            <button
                              onClick={() => toggleProductCompletion(dateKey, product.id)}
                              className={cn(
                                "p-1 rounded-lg transition-all flex-shrink-0",
                                getProductCompletion(dateKey, product.id)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                              )}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 py-6 text-sm">No products</p>
                  )}
                </div>
              </div>

              {/* Body Care Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Body Care</h3>
                  <span className="text-xs text-gray-500">({bodyProducts.length})</span>
                </div>
                <div className="space-y-2">
                  {bodyProducts.length > 0 ? bodyProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(
                        "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
                        getProductCompletion(dateKey, product.id)
                          ? "bg-gray-50 border-gray-200 opacity-70"
                          : "bg-white border-blue-200 hover:border-blue-300 hover:shadow-sm"
                      )}
                      style={{ animationDelay: `${index * 75 + 25}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-medium text-sm text-gray-900 transition-all",
                            getProductCompletion(dateKey, product.id) && "line-through text-gray-500"
                          )}>
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                              {product.category}
                            </span>
                            <button
                              onClick={() => toggleProductCompletion(dateKey, product.id)}
                              className={cn(
                                "p-1 rounded-lg transition-all flex-shrink-0",
                                getProductCompletion(dateKey, product.id)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                              )}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 py-6 text-sm">No products</p>
                  )}
                </div>
              </div>

              {/* Body Specifics Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-purple-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Body Specifics</h3>
                  <span className="text-xs text-gray-500">({bodySpecificProducts.length})</span>
                </div>
                {bodySpecificProducts.length > 0 && (
                  <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100 mb-3">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Priority Care Zone</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {bodySpecificProducts.length > 0 ? bodySpecificProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(
                        "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
                        getProductCompletion(dateKey, product.id)
                          ? "bg-gray-50 border-gray-200 opacity-70"
                          : "bg-white border-purple-200 hover:border-purple-300 hover:shadow-sm"
                      )}
                      style={{ animationDelay: `${index * 75 + 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-medium text-sm text-gray-900 transition-all",
                            getProductCompletion(dateKey, product.id) && "line-through text-gray-500"
                          )}>
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                              {product.category}
                            </span>
                            {/* Body Area Tags */}
                            {product.bodyAreas?.map((area, idx) => {
                              const areaData = BODY_AREAS[area as keyof typeof BODY_AREAS];
                              if (!areaData) return null;
                              return (
                                <span
                                  key={`area-${idx}`}
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    getProductCompletion(dateKey, product.id) && "opacity-50 grayscale",
                                    areaData.color
                                  )}
                                  title={areaData.fullName}
                                >
                                  {areaData.name}
                                </span>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-end mt-2">
                            <button
                              onClick={() => toggleProductCompletion(dateKey, product.id)}
                              className={cn(
                                "p-1 rounded-lg transition-all flex-shrink-0",
                                getProductCompletion(dateKey, product.id)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                              )}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 py-6 text-sm">No products</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "wellness":
        const wellnessProducts = getWellnessProducts(timeOfDay);
        return (
          <div className="space-y-2">
            {wellnessProducts.length > 0 ? wellnessProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={getProductCompletion(dateKey, product.id)}
                onToggle={() => toggleProductCompletion(dateKey, product.id)}
                colorClass="text-green-500"
              />
            )) : (
              <p className="text-center text-gray-400 py-8">No wellness products scheduled</p>
            )}
          </div>
        );

      default:
        return <p className="text-center text-gray-400 py-8">Select a category</p>;
    }
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
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-category-today flex items-center justify-center">
            <Sun className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Today</h1>
            <p className="text-gray-500">
              {format(today, "EEEE, MMMM d")} • {format(currentTime, "h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Current Time</p>
            <p className="text-xs text-gray-500 capitalize">{currentTimePeriod.toLowerCase()} Period</p>
          </div>
        </div>

        {/* Time Period Toggle */}
        <div className="flex gap-2">
          {(["AM", "MIDDAY", "PM"] as TimeOfDay[]).map((time) => (
            <button
              key={time}
              onClick={() => setActiveTimeSection(time)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border-2",
                activeTimeSection === time
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : time === currentTimePeriod
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
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
              "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border-2",
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
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sunrise className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Morning (5AM - 12PM)</h2>
              <p className="text-sm text-gray-500">Start your day right</p>
            </div>
          </div>

          <TimeSectionTabs
            timeOfDay="AM"
            activeTab={activeTabs.AM}
            onTabChange={(tab) => setActiveTab("AM", tab)}
          />

          <div className="min-h-[200px]">
            {renderTabContent("AM", activeTabs.AM)}
          </div>
        </div>
      )}

      {/* MIDDAY Section */}
      {(activeTimeSection === "MIDDAY" || activeTimeSection === "ALL") && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Midday (12PM - 5PM)</h2>
              <p className="text-sm text-gray-500">Recharge and refuel</p>
            </div>
          </div>

          <TimeSectionTabs
            timeOfDay="MIDDAY"
            activeTab={activeTabs.MIDDAY}
            onTabChange={(tab) => setActiveTab("MIDDAY", tab)}
          />

          <div className="min-h-[200px]">
            {renderTabContent("MIDDAY", activeTabs.MIDDAY)}
          </div>
        </div>
      )}

      {/* PM Section */}
      {(activeTimeSection === "PM" || activeTimeSection === "ALL") && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Evening (5PM onwards)</h2>
              <p className="text-sm text-gray-500">Wind down and care</p>
            </div>
          </div>

          <TimeSectionTabs
            timeOfDay="PM"
            activeTab={activeTabs.PM}
            onTabChange={(tab) => setActiveTab("PM", tab)}
          />

          <div className="min-h-[200px]">
            {renderTabContent("PM", activeTabs.PM)}
          </div>
        </div>
      )}
    </div>
  );
}

