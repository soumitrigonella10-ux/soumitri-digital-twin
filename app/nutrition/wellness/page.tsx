"use client";

import { useState, useMemo } from "react";
import { Pill, Clock, Sun, Moon, Sparkles, Sunrise, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WellnessPageContent() {
  const { data } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());

  // Filter wellness products
  const wellnessProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "wellness")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Separate products by time of day and apply day filter
  const morningProducts = useMemo(() => {
    let filtered = wellnessProducts.filter(p => p.timeOfDay === "AM" || p.timeOfDay === "ANY");
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [wellnessProducts, activeDayFilter]);

  const middayProducts = useMemo(() => {
    let filtered = wellnessProducts.filter(p => p.timeOfDay === "MIDDAY" || p.timeOfDay === "ANY");
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [wellnessProducts, activeDayFilter]);

  const eveningProducts = useMemo(() => {
    let filtered = wellnessProducts.filter(p => p.timeOfDay === "PM" || p.timeOfDay === "ANY");
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [wellnessProducts, activeDayFilter]);

  // Progress calculations
  const morningProgress = useMemo(() => {
    const total = morningProducts.length;
    const completed = morningProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [morningProducts, completedProducts]);

  const middayProgress = useMemo(() => {
    const total = middayProducts.length;
    const completed = middayProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [middayProducts, completedProducts]);

  const eveningProgress = useMemo(() => {
    const total = eveningProducts.length;
    const completed = eveningProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [eveningProducts, completedProducts]);

  const toggleProductCompletion = (productId: string) => {
    setCompletedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <header className="animate-fade-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-category-wellness flex items-center justify-center">
              <Pill className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wellness Products</h1>
              <p className="text-gray-500">Track your supplements and wellness routine</p>
            </div>
          </div>
        </header>
      </div>

      {/* Day of Week Filter */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
          <button
            onClick={() => setActiveDayFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeDayFilter === "ALL"
                ? "bg-green-100 text-green-700"
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
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Triple-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Morning Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Morning</h3>
              </div>
              <div className="text-xs text-gray-500">
                {morningProgress.completed}/{morningProgress.total}
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${(morningProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-amber-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{morningProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${morningProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Morning Product Cards */}
          <div className="space-y-2">
            {morningProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                index={index}
                theme={PRODUCT_CARD_THEMES.wellness}
                variant="compact"
              />
            ))}
            
            {morningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Pill className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No morning products</p>
              </div>
            )}
          </div>
        </div>

        {/* Midday Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Midday</h3>
              </div>
              <div className="text-xs text-gray-500">
                {middayProgress.completed}/{middayProgress.total}
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${(middayProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-orange-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{middayProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${middayProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Midday Product Cards */}
          <div className="space-y-2">
            {middayProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                index={index}
                theme={PRODUCT_CARD_THEMES.wellness}
                variant="compact"
              />
            ))}
            
            {middayProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Pill className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No midday products</p>
              </div>
            )}
          </div>
        </div>

        {/* Evening Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-gray-900">Evening</h3>
              </div>
              <div className="text-xs text-gray-500">
                {eveningProgress.completed}/{eveningProgress.total}
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${(eveningProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-indigo-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{eveningProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${eveningProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Evening Product Cards */}
          <div className="space-y-2">
            {eveningProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                index={index}
                theme={PRODUCT_CARD_THEMES.wellness}
                variant="compact"
              />
            ))}
            
            {eveningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Pill className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No evening products</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function WellnessPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <WellnessPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
