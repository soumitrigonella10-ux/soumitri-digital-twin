"use client";

import { useState, useMemo } from "react";
import { Wind, Sun, Moon, Edit2, Check, X, Droplet } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay, HairPhase } from "@/types";

// Hair Phase configuration with abbreviations and colors
const HAIR_PHASES = {
  oiling: { name: "Oiling", fullName: "Pre-Wash Oiling", color: "bg-amber-100 text-amber-700", border: "border-amber-200" },
  washing: { name: "Washing", fullName: "Wash Day", color: "bg-blue-100 text-blue-700", border: "border-blue-200" },
  postWash: { name: "Post-Wash", fullName: "Post-Wash Care", color: "bg-green-100 text-green-700", border: "border-green-200" },
  daily: { name: "Daily", fullName: "Daily Care & Styling", color: "bg-purple-100 text-purple-700", border: "border-purple-200" },
} as const;

type PhaseFilterKey = keyof typeof HAIR_PHASES | "ALL";

export default function HairPage() {
  const { data, upsertProduct } = useAppStore();
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeOfDay | "ALL">("ALL");
  const [activePhaseFilter, setActivePhaseFilter] = useState<PhaseFilterKey>("ALL");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Get current day for wash day indicator
  const today = new Date().getDay();
  const isWashDay = today === 0 || today === 3; // Sunday or Wednesday

  // Filter hair products
  const hairProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "hair")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = hairProducts;

    // Phase filter
    if (activePhaseFilter !== "ALL") {
      filtered = filtered.filter((p) => p.hairPhase === activePhaseFilter);
    }

    // Time of day filter
    if (activeTimeFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => p.timeOfDay === activeTimeFilter || p.timeOfDay === "ANY"
      );
    }

    return filtered;
  }, [hairProducts, activeTimeFilter, activePhaseFilter]);

  // Group filtered products by phase for organized display
  const groupedProducts = useMemo(() => {
    const groups: Record<keyof typeof HAIR_PHASES, Product[]> = {
      oiling: [],
      washing: [],
      postWash: [],
      daily: [],
    };

    filteredProducts.forEach((product) => {
      const phase = product.hairPhase || "daily";
      if (groups[phase]) {
        groups[phase].push(product);
      }
    });

    // Sort each group by displayOrder
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof HAIR_PHASES].sort(
        (a, b) => (a.displayOrder || 999) - (b.displayOrder || 999)
      );
    });

    return groups;
  }, [filteredProducts]);

  // Get phases that have products
  const activePhases = useMemo(() => {
    return (Object.keys(HAIR_PHASES) as (keyof typeof HAIR_PHASES)[]).filter(
      (phase) => groupedProducts[phase].length > 0
    );
  }, [groupedProducts]);

  // Calculate dynamic display order
  const getDynamicOrder = useMemo(() => {
    const orderMap = new Map<string, number>();
    
    if (activePhaseFilter === "ALL") {
      // Number within each phase group
      activePhases.forEach((phaseKey) => {
        let phaseOrder = 1;
        groupedProducts[phaseKey].forEach((product) => {
          orderMap.set(product.id, phaseOrder++);
        });
      });
    } else {
      // Single phase selected - number sequentially
      let globalOrder = 1;
      filteredProducts.forEach((product) => {
        orderMap.set(product.id, globalOrder++);
      });
    }
    
    return (productId: string) => orderMap.get(productId) || 0;
  }, [filteredProducts, groupedProducts, activePhases, activePhaseFilter]);

  const handleEditStart = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      displayOrder: product.displayOrder,
      timeOfDay: product.timeOfDay,
    });
  };

  const handleEditSave = (product: Product) => {
    upsertProduct({
      ...product,
      displayOrder: editForm.displayOrder,
      timeOfDay: editForm.timeOfDay as TimeOfDay,
    });
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-hair flex items-center justify-center">
            <Wind className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hair Care</h1>
            <p className="text-gray-500">Your complete hair care routine</p>
          </div>
        </div>
      </header>

      {/* Wash Day Indicator */}
      <div className={cn(
        "border rounded-2xl p-4",
        isWashDay ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <Droplet className={cn("w-5 h-5", isWashDay ? "text-blue-600" : "text-gray-400")} />
          <div>
            <h3 className={cn("font-medium", isWashDay ? "text-blue-800" : "text-gray-600")}>
              {isWashDay ? "Today is Wash Day!" : "Next Wash Day: " + (today < 3 ? "Wednesday" : "Sunday")}
            </h3>
            <p className={cn("text-sm", isWashDay ? "text-blue-700" : "text-gray-500")}>
              Wash days: Sunday & Wednesday
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Hair Phase Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Phase:</span>
          <button
            onClick={() => setActivePhaseFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activePhaseFilter === "ALL"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All Phases
          </button>
          {(Object.keys(HAIR_PHASES) as (keyof typeof HAIR_PHASES)[]).map((phaseKey) => {
            const phase = HAIR_PHASES[phaseKey];
            const count = hairProducts.filter((p) => p.hairPhase === phaseKey).length;
            
            if (count === 0) return null;
            
            return (
              <button
                key={phaseKey}
                onClick={() => setActivePhaseFilter(phaseKey)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  activePhaseFilter === phaseKey
                    ? phase.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <span>{phase.name}</span>
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
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {time === "AM" && <Sun className="w-3.5 h-3.5" />}
              {time === "PM" && <Moon className="w-3.5 h-3.5" />}
              {time === "ALL" ? "All Times" : time}
            </button>
          ))}
        </div>

        
      </div>

      {/* Products List - Grouped by Phase */}
      <div className="space-y-6">
        {filteredProducts.length === 0 ? (
          <div className="lifeos-card p-8 text-center border-2 border-yellow-100">
            <Wind className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No products match your filters</p>
          </div>
        ) : (
          activePhases.map((phaseKey) => {
            const phase = HAIR_PHASES[phaseKey];
            const products = groupedProducts[phaseKey];
            
            if (products.length === 0) return null;
            
            return (
              <div key={phaseKey} className="space-y-3">
                {/* Phase Header */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl",
                  phase.color
                )}>
                  <h2 className="font-semibold">{phase.name}</h2>
                  <span className="text-xs opacity-70 ml-auto">{products.length} product{products.length !== 1 ? 's' : ''}</span>
                </div>
                
                {/* Products in this phase */}
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={cn(
                      "lifeos-card border-2 p-4 animate-slide-in ml-4",
                      phase.border
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
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                              >
                                {time}
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
                            phase.color
                          )}>
                            {getDynamicOrder(product.id) || "-"}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{product.category}</span>
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
        Showing {filteredProducts.length} of {hairProducts.length} hair products
      </div>
    </div>
  );
}
