"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Target, Sun, Moon, Calendar, Edit2, Check, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay, BodyArea } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Body Area configuration with enhanced colors and impact zones
const BODY_AREAS = {
  UA: { 
    name: "UA", 
    fullName: "Underarm", 
    color: "bg-blue-50 text-blue-700", 
    border: "border-blue-200",
    glowColor: "ring-blue-300",
    impactZone: "Upper body, arms raised"
  },
  IT: { 
    name: "IT", 
    fullName: "Inner Thigh", 
    color: "bg-pink-50 text-pink-700", 
    border: "border-pink-200",
    glowColor: "ring-pink-300",
    impactZone: "Upper leg, inner area"
  },
  BL: { 
    name: "BL", 
    fullName: "Bikini Line", 
    color: "bg-rose-50 text-rose-700", 
    border: "border-rose-200",
    glowColor: "ring-rose-300",
    impactZone: "Lower abdomen, bikini area"
  },
  IA: { 
    name: "IA", 
    fullName: "Intimate Area", 
    color: "bg-purple-50 text-purple-700", 
    border: "border-purple-200",
    glowColor: "ring-purple-300",
    impactZone: "Intimate/private area"
  },
  B: { 
    name: "B", 
    fullName: "Belly/Stomach", 
    color: "bg-green-50 text-green-700", 
    border: "border-green-200",
    glowColor: "ring-green-300",
    impactZone: "Abdomen, stomach area"
  },
  LIPS: { 
    name: "Lips", 
    fullName: "Lips", 
    color: "bg-red-50 text-red-700", 
    border: "border-red-200",
    glowColor: "ring-red-300",
    impactZone: "Lip area, mouth"
  },
  OTHER: { 
    name: "Other", 
    fullName: "Other Areas", 
    color: "bg-gray-50 text-gray-600", 
    border: "border-gray-200",
    glowColor: "ring-gray-300",
    impactZone: "Various areas"
  },
} as const;


function BodySpecificsPageContent() {
  const { data, upsertProduct } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [activeAreaFilter, setActiveAreaFilter] = useState<keyof typeof BODY_AREAS | "ALL">("ALL");
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [highlightedAreas, setHighlightedAreas] = useState<(keyof typeof BODY_AREAS)[]>([]);


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

  // Separate products by time of day and apply day/area filters
  const morningProducts = useMemo(() => {
    let filtered = bodySpecificProducts.filter(p => p.timeOfDay === "AM" || p.timeOfDay === "ANY");
    
    // Apply area filter
    if (activeAreaFilter !== "ALL") {
      filtered = filtered.filter(p => {
        if (activeAreaFilter === "LIPS") return p.category === "Lip Care";
        if (activeAreaFilter === "OTHER") {
          return (!p.bodyAreas || p.bodyAreas.length === 0) && p.category !== "Lip Care";
        }
        return p.bodyAreas?.includes(activeAreaFilter as BodyArea);
      });
    }
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [bodySpecificProducts, activeDayFilter, activeAreaFilter]);

  const eveningProducts = useMemo(() => {
    let filtered = bodySpecificProducts.filter(p => p.timeOfDay === "PM" || p.timeOfDay === "ANY");
    
    // Apply area filter
    if (activeAreaFilter !== "ALL") {
      filtered = filtered.filter(p => {
        if (activeAreaFilter === "LIPS") return p.category === "Lip Care";
        if (activeAreaFilter === "OTHER") {
          return (!p.bodyAreas || p.bodyAreas.length === 0) && p.category !== "Lip Care";
        }
        return p.bodyAreas?.includes(activeAreaFilter as BodyArea);
      });
    }
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(p => !p.weekdays || p.weekdays.includes(activeDayFilter));
    }
    
    return filtered;
  }, [bodySpecificProducts, activeDayFilter, activeAreaFilter]);

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

  // Handle area selection from body diagram
  const handleAreaClick = (area: keyof typeof BODY_AREAS) => {
    setActiveAreaFilter(activeAreaFilter === area ? "ALL" : area);
  };

  // Update highlighted areas based on current products
  const updateHighlightedAreas = useCallback(() => {
    const allProducts = [...morningProducts, ...eveningProducts];
    const areas = new Set<keyof typeof BODY_AREAS>();
    
    allProducts.forEach(product => {
      if (product.category === "Lip Care") {
        areas.add("LIPS");
      } else if (product.bodyAreas) {
        product.bodyAreas.forEach(area => {
          areas.add(area as keyof typeof BODY_AREAS);
        });
      } else {
        areas.add("OTHER");
      }
    });
    
    setHighlightedAreas(Array.from(areas));
  }, [morningProducts, eveningProducts]);

  // Update highlighted areas when products change
  useEffect(() => {
    updateHighlightedAreas();
  }, [updateHighlightedAreas]);

  const toggleWeekday = (dayIndex: number) => {
    const currentWeekdays = editForm.weekdays || [];
    if (currentWeekdays.includes(dayIndex)) {
      setEditForm({
        ...editForm,
        weekdays: currentWeekdays.filter(d => d !== dayIndex)
      });
    } else {
      setEditForm({
        ...editForm,
        weekdays: [...currentWeekdays, dayIndex].sort()
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full px-3 py-8 md:px-4">
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
      </div>

      {/* Body Area Filter */}
      <div className="w-full px-3 py-4 md:px-4">
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
                  "px-2 py-0.5 rounded-full text-xs font-medium transition-all flex items-center gap-1",
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
      </div>

      {/* Day of Week Filter */}
      <div className="w-full px-3 py-4 md:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
          <button
            onClick={() => setActiveDayFilter("ALL")}
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium transition-all",
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
                "px-2 py-0.5 rounded-full text-xs font-medium transition-all",
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

      {/* Routines Grid */}
      <div className="w-full px-3 pb-12 md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {morningProducts.map((product, index) => {
              const shouldHighlightImpact = activeAreaFilter !== "ALL" && (
                product.bodyAreas?.includes(activeAreaFilter as BodyArea) ||
                (activeAreaFilter === "LIPS" && product.category === "Lip Care")
              );
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompleted={completedProducts.has(product.id)}
                  onToggleComplete={() => toggleProductCompletion(product.id)}
                  onEdit={() => handleEditStart(product)}
                  index={index}
                  theme={PRODUCT_CARD_THEMES.bodySpecifics}
                  highlighted={shouldHighlightImpact}
                  highlightRingColor={shouldHighlightImpact ? BODY_AREAS[getProductArea(product)]?.glowColor : undefined}
                  additionalMetadata={product.bodyAreas && product.bodyAreas.length > 0 ? (
                    <div className="flex gap-1">
                      {product.bodyAreas.slice(0, 2).map((area, idx) => {
                        const areaKey = area as keyof typeof BODY_AREAS;
                        const config = BODY_AREAS[areaKey] || BODY_AREAS.OTHER;
                        return (
                          <span
                            key={idx}
                            className={`px-1 py-0.5 text-xs rounded border ${config.color} ${config.border}`}
                          >
                            {config.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : undefined}
                />
              );
            })}
            
            {morningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
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
            {eveningProducts.map((product, index) => {
              const shouldHighlightImpact = activeAreaFilter !== "ALL" && (
                product.bodyAreas?.includes(activeAreaFilter as BodyArea) ||
                (activeAreaFilter === "LIPS" && product.category === "Lip Care")
              );
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompleted={completedProducts.has(product.id)}
                  onToggleComplete={() => toggleProductCompletion(product.id)}
                  onEdit={() => handleEditStart(product)}
                  index={index}
                  theme={PRODUCT_CARD_THEMES.bodySpecifics}
                  highlighted={shouldHighlightImpact}
                  highlightRingColor={shouldHighlightImpact ? BODY_AREAS[getProductArea(product)]?.glowColor : undefined}
                  additionalMetadata={product.bodyAreas && product.bodyAreas.length > 0 ? (
                    <div className="flex gap-1">
                      {product.bodyAreas.slice(0, 2).map((area, idx) => {
                        const areaKey = area as keyof typeof BODY_AREAS;
                        const config = BODY_AREAS[areaKey] || BODY_AREAS.OTHER;
                        return (
                          <span
                            key={idx}
                            className={`px-1 py-0.5 text-xs rounded border ${config.color} ${config.border}`}
                          >
                            {config.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : undefined}
                />
              );
            })}
            
            {eveningProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
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
                            ? "bg-purple-500 text-white"
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
                    className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
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

export default function BodySpecificsPage() {
  return (
    <AuthenticatedLayout>
      <BodySpecificsPageContent />
    </AuthenticatedLayout>
  );
}
