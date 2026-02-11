"use client";

import { useState, useMemo } from "react";
import { Wind, Sun, Moon, Edit2, Check, X, Droplet, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay, HairPhase } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Hair Phase configuration with abbreviations and colors
const HAIR_PHASES = {
  oiling: { name: "Oiling", fullName: "Pre-Wash Oiling", color: "bg-amber-100 text-amber-700", icon: Droplet },
  washing: { name: "Washing", fullName: "Wash Day", color: "bg-blue-100 text-blue-700", icon: Wind },
  postWash: { name: "Post-Wash", fullName: "Post-Wash Care", color: "bg-green-100 text-green-700", icon: Droplet },
  daily: { name: "Daily", fullName: "Daily Care & Styling", color: "bg-purple-100 text-purple-700", icon: Sun },
} as const;

// Hair Page Content Component
function HairPageContent() {
  const { data, upsertProduct } = useAppStore();
  const [activePhaseFilter, setActivePhaseFilter] = useState<HairPhase | "ALL">("ALL");
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Filter hair products
  const hairProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "hair")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Separate products by hair phase
  const oilingProducts = useMemo(() => {
    return hairProducts.filter(p => p.hairPhase === "oiling");
  }, [hairProducts]);

  const washingProducts = useMemo(() => {
    return hairProducts.filter(p => p.hairPhase === "washing");
  }, [hairProducts]);

  const postWashProducts = useMemo(() => {
    return hairProducts.filter(p => p.hairPhase === "postWash");
  }, [hairProducts]);

  const dailyProducts = useMemo(() => {
    return hairProducts.filter(p => p.hairPhase === "daily");
  }, [hairProducts]);

  // Progress calculations
  const oilingProgress = useMemo(() => {
    const total = oilingProducts.length;
    const completed = oilingProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [oilingProducts, completedProducts]);

  const washingProgress = useMemo(() => {
    const total = washingProducts.length;
    const completed = washingProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [washingProducts, completedProducts]);

  const postWashProgress = useMemo(() => {
    const total = postWashProducts.length;
    const completed = postWashProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [postWashProducts, completedProducts]);

  const dailyProgress = useMemo(() => {
    const total = dailyProducts.length;
    const completed = dailyProducts.filter(p => completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [dailyProducts, completedProducts]);

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
      hairPhase: product.hairPhase,
    });
  };

  const handleEditSave = (product: Product) => {
    upsertProduct({
      ...product,
      displayOrder: editForm.displayOrder,
      hairPhase: editForm.hairPhase as HairPhase,
    });
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <header className="animate-fade-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-category-hair flex items-center justify-center">
              <Wind className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hair Care Products</h1>
              <p className="text-gray-500">Manage your hair care routine by phase</p>
            </div>
          </div>
        </header>
      </div>

      {/* Quad-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {/* Oiling Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Oiling</h3>
              </div>
              <div className="text-xs text-gray-500">
                {oilingProgress.completed}/{oilingProgress.total}
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
                    strokeDasharray={`${(oilingProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-amber-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{oilingProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${oilingProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Oiling Product Cards */}
          <div className="space-y-2">
            {oilingProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.hair}
              />
            ))}
            
            {oilingProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Droplet className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No oiling products</p>
              </div>
            )}
          </div>
        </div>

        {/* Washing Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Washing</h3>
              </div>
              <div className="text-xs text-gray-500">
                {washingProgress.completed}/{washingProgress.total}
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
                    strokeDasharray={`${(washingProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-blue-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{washingProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${washingProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Washing Product Cards */}
          <div className="space-y-2">
            {washingProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.hair}
              />
            ))}
            
            {washingProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Wind className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No washing products</p>
              </div>
            )}
          </div>
        </div>

        {/* Post-Wash Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-gray-900">Post-Wash</h3>
              </div>
              <div className="text-xs text-gray-500">
                {postWashProgress.completed}/{postWashProgress.total}
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
                    strokeDasharray={`${(postWashProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{postWashProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${postWashProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Post-Wash Product Cards */}
          <div className="space-y-2">
            {postWashProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.hair}
              />
            ))}
            
            {postWashProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Droplet className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No post-wash products</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Column */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Daily</h3>
              </div>
              <div className="text-xs text-gray-500">
                {dailyProgress.completed}/{dailyProgress.total}
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
                    strokeDasharray={`${(dailyProgress.percentage / 100) * 87.96} 87.96`}
                    className="text-purple-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{dailyProgress.percentage}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${dailyProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Product Cards */}
          <div className="space-y-2">
            {dailyProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompleted={completedProducts.has(product.id)}
                onToggleComplete={() => toggleProductCompletion(product.id)}
                onEdit={() => handleEditStart(product)}
                index={index}
                theme={PRODUCT_CARD_THEMES.hair}
              />
            ))}
            
            {dailyProducts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Sun className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No daily products</p>
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

                {/* Hair Phase */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hair Phase</label>
                  <div className="flex gap-2 flex-wrap">
                    {(Object.keys(HAIR_PHASES) as (keyof typeof HAIR_PHASES)[]).map((phase) => (
                      <button
                        key={phase}
                        onClick={() => setEditForm({ ...editForm, hairPhase: phase })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          editForm.hairPhase === phase
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {HAIR_PHASES[phase].name}
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

export default function HairPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <HairPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
