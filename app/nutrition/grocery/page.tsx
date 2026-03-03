"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Package, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useDbData } from "@/hooks/useDbData";

interface GroceryCategory {
  id: string;
  name: string;
  emoji: string;
  listType: string;
  items: { name: string; quantity?: string }[];
}

// Color mapping stays in code — pure presentational config
const categoryColors: Record<string, { bg: string; border: string }> = {
  "Grains & Flours": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dry Fruits & Seeds": { bg: "bg-orange-50", border: "border-orange-200" },
  "Essentials & Condiments": { bg: "bg-yellow-50", border: "border-yellow-200" },
  "Pulses & Lentils": { bg: "bg-lime-50", border: "border-lime-200" },
  "Cooking Basics": { bg: "bg-stone-50", border: "border-stone-200" },
  "Whole Spices": { bg: "bg-rose-50", border: "border-rose-200" },
  "Spice Powders": { bg: "bg-red-50", border: "border-red-200" },
  "Beverages": { bg: "bg-cyan-50", border: "border-cyan-200" },
  "Vegetables": { bg: "bg-emerald-50", border: "border-emerald-200" },
  "Fruits": { bg: "bg-green-50", border: "border-green-200" },
  "Bread": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dairy & Eggs": { bg: "bg-blue-50", border: "border-blue-200" },
  "Aromatics & Fresh Herbs": { bg: "bg-teal-50", border: "border-teal-200" },
};

function GroceryPageContent() {
  const [activeTab, setActiveTab] = useState<"master" | "weekly">("weekly");
  const { data: allCategories, loading } = useDbData<GroceryCategory[]>("/api/grocery", []);

  const categories = useMemo(
    () => allCategories.filter((c) => c.listType === activeTab),
    [allCategories, activeTab]
  );
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-grocery flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
            <p className="text-gray-500">
              {totalItems} items • {activeTab === "master" ? "Pantry staples" : "Buy this week"}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("master")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            activeTab === "master"
              ? "bg-slate-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Package className="w-4 h-4" />
          Master Setup
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            activeTab === "weekly"
              ? "bg-slate-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Weekly Fresh
        </button>
      </div>

      {/* Description */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
      <>
      <div className="lifeos-card p-4 bg-gradient-to-r from-slate-50 to-gray-50">
        {activeTab === "master" ? (
          <div>
            <p className="text-sm text-gray-600 font-medium">🛒 Long-term pantry staples</p>
            <p className="text-xs text-gray-500 mt-1">
              Stock these once and replenish as needed. These form the foundation of your kitchen.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 font-medium">🥬 Fresh items for the week</p>
            <p className="text-xs text-gray-500 mt-1">
              Buy these every week to keep your meals fresh and nutritious.
            </p>
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((category, catIndex) => {
          const colors = categoryColors[category.name] || { bg: "bg-gray-50", border: "border-gray-200" };
          
          return (
            <div
              key={category.name}
              className={cn(
                "lifeos-card p-4 border animate-slide-in",
                colors.bg,
                colors.border
              )}
              style={{ animationDelay: `${catIndex * 50}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{category.emoji}</span>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <span className="ml-auto text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                  {category.items.length} items
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{item.name}</span>
                    {item.quantity && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="lifeos-card p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              {activeTab === "master" ? "Pantry Essentials" : "Weekly Shopping"}
            </p>
            <p className="text-xs text-green-600">
              {categories.length} categories • {totalItems} total items
            </p>
          </div>
          <div className="text-3xl">
            {activeTab === "master" ? "🏪" : "🛒"}
          </div>
        </div>
      </div>
      </> /* end loading guard */
      )}
    </div>
  );
}

export default function GroceryPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <GroceryPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
