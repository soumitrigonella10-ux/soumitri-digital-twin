"use client";

import { useState, useMemo } from "react";
import { Droplets, Sun, Moon, Calendar, Edit2, Check, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BodyPage() {
  const { data, upsertProduct } = useAppStore();
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeOfDay | "ALL">("ALL");
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Filter body products
  const bodyProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "body")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = bodyProducts;

    // Time of day filter
    if (activeTimeFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => p.timeOfDay === activeTimeFilter || p.timeOfDay === "ANY"
      );
    }

    // Day of week filter
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => !p.weekdays || p.weekdays.includes(activeDayFilter)
      );
    }

    return filtered;
  }, [bodyProducts, activeTimeFilter, activeDayFilter]);

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
    <div className="space-y-8">
      {/* Header */}
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

      {/* Filters */}
      <div className="space-y-4">
        {/* Time of Day Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Time:</span>
          {(["ALL", "AM", "PM", "ANY"] as const).map((time) => (
            <button
              key={time}
              onClick={() => setActiveTimeFilter(time as TimeOfDay | "ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                activeTimeFilter === time
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {time === "AM" && <Sun className="w-3.5 h-3.5" />}
              {time === "PM" && <Moon className="w-3.5 h-3.5" />}
              {time === "ALL" ? "All Times" : time}
            </button>
          ))}
        </div>

        {/* Day of Week Filter */}
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

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="lifeos-card p-8 text-center">
            <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No products match your filters</p>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="lifeos-card p-4 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {editingProduct === product.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSave(product)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Display Order */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 w-24">Order:</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.displayOrder || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 1 })
                      }
                      className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>

                  {/* Time of Day */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 w-24">Time:</label>
                    <div className="flex gap-2">
                      {(["AM", "PM", "ANY"] as TimeOfDay[]).map((time) => (
                        <button
                          key={time}
                          onClick={() => setEditForm({ ...editForm, timeOfDay: time })}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
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
                  <div className="flex items-start gap-3">
                    <label className="text-sm text-gray-600 w-24 pt-1.5">Days:</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day, idx) => (
                        <button
                          key={day}
                          onClick={() => toggleWeekday(idx)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
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
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Order Badge */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {product.displayOrder || "-"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{product.category}</span>
                        {product.actives.length > 0 && (
                          <span className="text-xs text-gray-400">
                            • {product.actives.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Time Badge */}
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1",
                        product.timeOfDay === "AM"
                          ? "bg-amber-100 text-amber-700"
                          : product.timeOfDay === "PM"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {product.timeOfDay === "AM" && <Sun className="w-3 h-3" />}
                      {product.timeOfDay === "PM" && <Moon className="w-3 h-3" />}
                      {product.timeOfDay || "Any"}
                    </span>

                    {/* Days Badge */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {!product.weekdays || product.weekdays.length === 7
                          ? "Daily"
                          : product.weekdays.map((d) => DAYS_OF_WEEK[d].charAt(0)).join("")}
                      </span>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditStart(product)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-400">
        Showing {filteredProducts.length} of {bodyProducts.length} body products
      </div>
    </div>
  );
}
