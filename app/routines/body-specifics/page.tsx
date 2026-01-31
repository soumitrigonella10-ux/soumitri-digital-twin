"use client";

import { useState, useMemo } from "react";
import { Target, Sun, Moon, Calendar, Edit2, Check, X, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay, BodyArea } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Body Area configuration with abbreviations and colors
const BODY_AREAS = {
  UA: { name: "UA", fullName: "Underarm", color: "bg-pink-100 text-pink-700", border: "border-pink-200" },
  IT: { name: "IT", fullName: "Inner Thigh", color: "bg-orange-100 text-orange-700", border: "border-orange-200" },
  BL: { name: "BL", fullName: "Bikini Line", color: "bg-rose-100 text-rose-700", border: "border-rose-200" },
  IA: { name: "IA", fullName: "Intimate Area", color: "bg-fuchsia-100 text-fuchsia-700", border: "border-fuchsia-200" },
  B: { name: "B", fullName: "Belly/Stomach", color: "bg-amber-100 text-amber-700", border: "border-amber-200" },
  LIPS: { name: "Lips", fullName: "Lips", color: "bg-red-100 text-red-700", border: "border-red-200" },
  OTHER: { name: "Other", fullName: "Occasional", color: "bg-gray-100 text-gray-700", border: "border-gray-200" },
} as const;

type AreaFilterKey = keyof typeof BODY_AREAS | "ALL";

export default function BodySpecificsPage() {
  const { data, upsertProduct } = useAppStore();
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeOfDay | "ALL">("ALL");
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [activeAreaFilter, setActiveAreaFilter] = useState<AreaFilterKey>("ALL");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Helper to determine product's primary area for grouping
  const getProductArea = (product: Product): keyof typeof BODY_AREAS => {
    if (product.category === "Lip Care") return "LIPS";
    if (!product.bodyAreas || product.bodyAreas.length === 0) {
      if (product.category === "Hair Removal") return "OTHER";
      return "OTHER";
    }
    // Priority order for display: UA > B > IT > BL > IA
    if (product.bodyAreas.includes("UA")) return "UA";
    if (product.bodyAreas.includes("B")) return "B";
    if (product.bodyAreas.includes("IT")) return "IT";
    if (product.bodyAreas.includes("BL")) return "BL";
    if (product.bodyAreas.includes("IA")) return "IA";
    return "OTHER";
  };

  // Filter body-specific products
  const bodySpecificProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "bodySpecific")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = bodySpecificProducts;

    // Body area filter
    if (activeAreaFilter !== "ALL") {
      filtered = filtered.filter((p) => {
        if (activeAreaFilter === "LIPS") return p.category === "Lip Care";
        if (activeAreaFilter === "OTHER") {
          return (!p.bodyAreas || p.bodyAreas.length === 0) && p.category !== "Lip Care";
        }
        return p.bodyAreas?.includes(activeAreaFilter as BodyArea);
      });
    }

    // Time of day filter
    if (activeTimeFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => p.timeOfDay === activeTimeFilter || p.timeOfDay === "ANY"
      );
    }

    // Day of week filter
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => !p.weekdays || p.weekdays.length === 0 || p.weekdays.includes(activeDayFilter)
      );
    }

    return filtered;
  }, [bodySpecificProducts, activeTimeFilter, activeDayFilter, activeAreaFilter]);

  // Group filtered products by area for organized display
  const groupedProducts = useMemo(() => {
    const groups: Record<keyof typeof BODY_AREAS, Product[]> = {
      UA: [],
      IT: [],
      BL: [],
      IA: [],
      B: [],
      LIPS: [],
      OTHER: [],
    };

    filteredProducts.forEach((product) => {
      const area = getProductArea(product);
      groups[area].push(product);
    });

    // Sort each group by displayOrder
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof BODY_AREAS].sort(
        (a, b) => (a.displayOrder || 999) - (b.displayOrder || 999)
      );
    });

    return groups;
  }, [filteredProducts]);

  // Get areas that have products (for showing relevant sections)
  const activeAreas = useMemo(() => {
    return (Object.keys(BODY_AREAS) as (keyof typeof BODY_AREAS)[]).filter(
      (area) => groupedProducts[area].length > 0
    );
  }, [groupedProducts]);

  // Calculate dynamic display order - sequential across all filtered products
  const getDynamicOrder = useMemo(() => {
    const orderMap = new Map<string, number>();
    let globalOrder = 1;
    
    // If showing all areas, number within each area group
    // If filtered to specific area, number sequentially across all
    if (activeAreaFilter === "ALL") {
      // Number within each area group
      activeAreas.forEach((areaKey) => {
        let areaOrder = 1;
        groupedProducts[areaKey].forEach((product) => {
          orderMap.set(product.id, areaOrder++);
        });
      });
    } else {
      // Single area selected - number sequentially
      filteredProducts.forEach((product) => {
        orderMap.set(product.id, globalOrder++);
      });
    }
    
    return (productId: string) => orderMap.get(productId) || 0;
  }, [filteredProducts, groupedProducts, activeAreas, activeAreaFilter]);

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
          <div className="w-12 h-12 rounded-2xl bg-category-bodySpecific flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Body Specific Products</h1>
            <p className="text-gray-500">Targeted care for sensitive areas</p>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-purple-800">Priority Care Zone</h3>
            <p className="text-sm text-purple-700 mt-1">
              Products for sensitive areas that require extra attention. Set your preferred order and schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Body Area Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Area:</span>
          <button
            onClick={() => setActiveAreaFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeAreaFilter === "ALL"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All Areas
          </button>
          {(Object.keys(BODY_AREAS) as (keyof typeof BODY_AREAS)[]).map((areaKey) => {
            const area = BODY_AREAS[areaKey];
            const count = bodySpecificProducts.filter((p) => {
              if (areaKey === "LIPS") return p.category === "Lip Care";
              if (areaKey === "OTHER") {
                return (!p.bodyAreas || p.bodyAreas.length === 0) && p.category !== "Lip Care";
              }
              return p.bodyAreas?.includes(areaKey as BodyArea);
            }).length;
            
            if (count === 0) return null;
            
            return (
              <button
                key={areaKey}
                onClick={() => setActiveAreaFilter(areaKey)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  activeAreaFilter === areaKey
                    ? area.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <span>{area.name}</span>
                <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

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
                  ? "bg-purple-100 text-purple-700"
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
                ? "bg-purple-100 text-purple-700"
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
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Products List - Grouped by Area */}
      <div className="space-y-6">
        {filteredProducts.length === 0 ? (
          <div className="lifeos-card p-8 text-center border-2 border-purple-100">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No products match your filters</p>
          </div>
        ) : (
          activeAreas.map((areaKey) => {
            const area = BODY_AREAS[areaKey];
            const products = groupedProducts[areaKey];
            
            if (products.length === 0) return null;
            
            return (
              <div key={areaKey} className="space-y-3">
                {/* Area Header */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl",
                  area.color
                )}>
                  <h2 className="font-semibold">{area.name}</h2>
                  <span className="text-xs opacity-70 ml-auto">{products.length} product{products.length !== 1 ? 's' : ''}</span>
                </div>
                
                {/* Products in this area */}
                {products.map((product, index) => (
            <div
              key={product.id}
                    className={cn(
                      "lifeos-card border-2 p-4 animate-slide-in ml-4",
                      area.border
                    )}
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
                              ? "bg-purple-500 text-white"
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
                              ? "bg-purple-500 text-white"
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
                    {/* Order Badge - Dynamic based on filters */}
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            area.color
                          )}>
                      {getDynamicOrder(product.id) || "-"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{product.category}</span>
                              {/* Body Areas Tags */}
                              {product.bodyAreas && product.bodyAreas.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {product.bodyAreas.map((ba) => (
                                    <span
                                      key={ba}
                                      className={cn(
                                        "text-xs px-1.5 py-0.5 rounded",
                                        BODY_AREAS[ba]?.color || "bg-gray-100 text-gray-600"
                                      )}
                                    >
                                      {ba}
                                    </span>
                                  ))}
                                </div>
                              )}
                        {product.actives.length > 0 && (
                          <span className="text-xs text-gray-400">
                            • {product.actives.join(", ")}
                          </span>
                        )}
                        {product.cautionTags.length > 0 && (
                          <span className="text-xs text-amber-600">
                            ⚠️ {product.cautionTags.join(", ")}
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
                              {!product.weekdays || product.weekdays.length === 0
                                ? "As needed"
                                : product.weekdays.length === 7
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
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-400">
        Showing {filteredProducts.length} of {bodySpecificProducts.length} body specific products
      </div>
    </div>
  );
}
