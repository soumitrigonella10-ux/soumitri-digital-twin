"use client";

import { useState, useMemo } from "react";
import { Droplets, Sun, Moon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



export default function BodyPage() {
  const { data, upsertProduct } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Filter body products  
  const bodyProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "body")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Separate products by time of day and apply day filter
  const morningProducts = useMemo(() => {
    let filtered = bodyProducts.filter(p => p.timeOfDay === "AM" || p.timeOfDay === "ANY");
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [bodyProducts, activeDayFilter]);

  const eveningProducts = useMemo(() => {
    let filtered = bodyProducts.filter(p => p.timeOfDay === "PM" || p.timeOfDay === "ANY");
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [bodyProducts, activeDayFilter]);

  // Progress calculations
  const morningProgress = useMemo(() => {
    const total = morningProducts.length;
    const completed = morningProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [morningProducts, completedProducts]);

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

  const handleEditStart = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      displayOrder: product.displayOrder,
      timeOfDay: product.timeOfDay,
      weekdays: product.weekdays,
    });
  };

  const handleEditSave = (product: Product) => {
    upsertProduct({
      ...product,
      displayOrder: editForm.displayOrder,
      timeOfDay: editForm.timeOfDay as TimeOfDay,
      weekdays: editForm.weekdays,
    });
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const toggleWeekday = (day: number) => {
    const current = editForm.weekdays || [];
    if (current.includes(day)) {
      setEditForm({ ...editForm, weekdays: current.filter((d) => d !== day) });
    } else {
      setEditForm({ ...editForm, weekdays: [...current, day].sort() });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full px-3 py-8 md:px-4">
        <header className="animate-fade-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-category-body flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Body Products</h1>
              <p className="text-gray-500">Manage your body care routine products</p>
            </div>
          </div>
        </header>
      </div>

      {/* Day of Week Filter */}
      <div className="w-full px-3 py-4 md:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
          <button
            onClick={() => setActiveDayFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeDayFilter === "ALL"
                ? "bg-blue-100 text-blue-700"
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
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Dual-Column Routine Board */}
      <div className="w-full px-3 pb-12 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.body}
              />
            ))}
            
            {morningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Droplets className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No morning products</p>
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
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.body}
              />
            ))}
            
            {eveningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Droplets className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No evening products</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (() => {
        const product = data.products.find(p => p.id === editingProduct);
        if (!product) return null;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit {product.name}</h3>
                <button
                  onClick={handleEditCancel}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.displayOrder || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Time of Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                  <div className="flex gap-2">
                    {(["AM", "PM", "ANY"] as TimeOfDay[]).map((time) => (
                      <button
                        key={time}
                        onClick={() => setEditForm({ ...editForm, timeOfDay: time })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          editForm.timeOfDay === time
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekdays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => toggleWeekday(idx)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          editForm.weekdays?.includes(idx)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSave(product)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}