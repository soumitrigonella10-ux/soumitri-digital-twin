"use client";

import { useState } from "react";
import { ShoppingCart, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

// =====================
// MASTER SETUP (Long-term pantry staples)
// =====================
interface GroceryCategory {
  name: string;
  emoji: string;
  items: { name: string; quantity?: string }[];
}

const masterSetupCategories: GroceryCategory[] = [
  {
    name: "Base / Grains",
    emoji: "🍚",
    items: [
      { name: "Rice (raw)", quantity: "350–400 g" },
    ],
  },
  {
    name: "Dry Fruits",
    emoji: "🥜",
    items: [
      { name: "Walnuts" },
      { name: "Almonds" },
    ],
  },
  {
    name: "Fridge Condiments",
    emoji: "🧴",
    items: [
      { name: "Soy sauce" },
      { name: "Red chili sauce" },
      { name: "Tomato ketchup" },
      { name: "Vinegar (or lemon)" },
      { name: "Peanut butter", quantity: "1 small jar" },
    ],
  },
  {
    name: "Pulses",
    emoji: "🫘",
    items: [
      { name: "Dry chana (chickpeas)", quantity: "100–120 g" },
      { name: "Dry rajma (kidney beans)", quantity: "100–120 g" },
      { name: "Red lentils (masoor dal)" },
      { name: "Moong dal (yellow)", quantity: "½ cup" },
    ],
  },
  {
    name: "Cooking Basics",
    emoji: "🍳",
    items: [
      { name: "Vegetable oil" },
      { name: "Ghee", quantity: "small" },
      { name: "Butter / Olive oil", quantity: "optional" },
      { name: "Cornflour", quantity: "small pack (~2 tsp)" },
      { name: "Besan (gram flour)", quantity: "~60 g (½ cup)" },
    ],
  },
  {
    name: "Whole Spices",
    emoji: "🌶️",
    items: [
      { name: "Cumin seeds" },
      { name: "Mustard seeds" },
      { name: "Fennel seeds" },
      { name: "Ajwain" },
      { name: "Hing (asafoetida)" },
      { name: "Black pepper" },
      { name: "Salt" },
    ],
  },
  {
    name: "Spice Powders / Masalas",
    emoji: "🌶️",
    items: [
      { name: "Coriander powder" },
      { name: "Turmeric powder" },
      { name: "Red chili powder" },
      { name: "Pav bhaji masala" },
      { name: "Roasted cumin powder" },
      { name: "Chilli flakes", quantity: "optional" },
    ],
  },
  {
    name: "Beverages",
    emoji: "🍵",
    items: [
      { name: "Tea leaves" },
      { name: "Matcha - Mezame" },
      { name: "Vanilla essence" },
    ],
  },
];

// =====================
// WEEKLY (Fresh items to buy every week)
// =====================
const weeklyCategories: GroceryCategory[] = [
  {
    name: "Vegetables",
    emoji: "🥬",
    items: [
      { name: "Onion (red)", quantity: "2" },
      { name: "Tomato", quantity: "1" },
      { name: "Capsicum", quantity: "3" },
      { name: "Carrots", quantity: "6–7" },
      { name: "Cucumber", quantity: "3" },
      { name: "Sweet corn kernels", quantity: "250 g (frozen OK)" },
      { name: "Sprouts", quantity: "200 g" },
    ],
  },
  {
    name: "Fruits",
    emoji: "🍊",
    items: [
      { name: "Avocado", quantity: "1 large" },
      { name: "Oranges", quantity: "2" },
    ],
  },
  {
    name: "Bread",
    emoji: "🍞",
    items: [
      { name: "Bread", quantity: "1 loaf" },
    ],
  },
  {
    name: "Dairy",
    emoji: "🥛",
    items: [
      { name: "Paneer", quantity: "~500 g" },
      { name: "Thick curd/dahi", quantity: "500 g" },
      { name: "Milk", quantity: "1 L (optional)" },
    ],
  },
  {
    name: "Aromatics / Add-ons",
    emoji: "🧄",
    items: [
      { name: "Ginger–garlic paste", quantity: "200 g" },
      { name: "Green chili paste", quantity: "100–200 g" },
      { name: "Mint–coriander chutney", quantity: "200–250 g" },
      { name: "Bottled lemon juice", quantity: "250 ml" },
      { name: "Dried curry leaves", quantity: "optional" },
    ],
  },
];

const categoryColors: Record<string, { bg: string; border: string }> = {
  "Base / Grains": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dry Fruits": { bg: "bg-orange-50", border: "border-orange-200" },
  "Fridge Condiments": { bg: "bg-blue-50", border: "border-blue-200" },
  "Pulses": { bg: "bg-yellow-50", border: "border-yellow-200" },
  "Cooking Basics": { bg: "bg-slate-50", border: "border-slate-200" },
  "Whole Spices": { bg: "bg-red-50", border: "border-red-200" },
  "Spice Powders / Masalas": { bg: "bg-rose-50", border: "border-rose-200" },
  "Beverages": { bg: "bg-green-50", border: "border-green-200" },
  "Vegetables": { bg: "bg-emerald-50", border: "border-emerald-200" },
  "Fruits": { bg: "bg-orange-50", border: "border-orange-200" },
  "Bread": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dairy": { bg: "bg-sky-50", border: "border-sky-200" },
  "Aromatics / Add-ons": { bg: "bg-lime-50", border: "border-lime-200" },
};

function GroceryPageContent() {
  const [activeTab, setActiveTab] = useState<"master" | "weekly">("weekly");

  const categories = activeTab === "master" ? masterSetupCategories : weeklyCategories;
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
