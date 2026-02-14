"use client";

import { useState, useMemo } from "react";
import { Palette, Sun, Moon, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { TimeOfDay } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { MakeupWeekView } from "@/components/routines";
import { SAMPLE_MAKEUP_PRODUCTS } from "@/data/makeupProducts";

function MakeupPageContent() {
  const { data: _data } = useAppStore();
  const [view, setView] = useState<"routine" | "week">("routine");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("AM");
  const [completionState, setCompletionState] = useState<Record<string, boolean>>({});
  const [_editingProduct, setEditingProduct] = useState<string | null>(null);

  const makeupProducts = useMemo(() => {
    return SAMPLE_MAKEUP_PRODUCTS.filter(product => 
      product.timeOfDay === timeOfDay || product.timeOfDay === "ANY"
    ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [timeOfDay]);

  const handleToggleComplete = (productId: string) => {
    setCompletionState(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
  };

  const completedCount = Object.values(completionState).filter(Boolean).length;
  const progressPercentage = makeupProducts.length > 0 
    ? Math.round((completedCount / makeupProducts.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Makeup Routine</h1>
            <p className="text-gray-600">Your daily beauty ritual</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex bg-white rounded-lg p-1 border">
            <button
              onClick={() => setView("routine")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                view === "routine"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Routine
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                view === "week"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Week
            </button>
          </div>

          {/* Time of Day Filter */}
          {view === "routine" && (
            <div className="flex bg-white rounded-lg p-1 border">
              {(["AM", "PM"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeOfDay(time)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                    timeOfDay === time
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:text-gray-800"
                  )}
                >
                  {time === "AM" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {time}
                </button>
              ))}
            </div>
          )}

          {/* Progress */}
          {view === "routine" && makeupProducts.length > 0 && (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {completedCount}/{makeupProducts.length} completed ({progressPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {view === "routine" ? (
          <div className="space-y-3">
            {makeupProducts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No makeup products for {timeOfDay}
                </h3>
                <p className="text-gray-500">
                  Add products to start building your makeup routine
                </p>
              </div>
            ) : (
              makeupProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompleted={completionState[product.id] || false}
                  onToggleComplete={() => handleToggleComplete(product.id)}
                  onEdit={() => handleEdit(product.id)}
                  index={index}
                  theme={PRODUCT_CARD_THEMES.makeup}
                  variant="makeup"
                />
              ))
            )}
          </div>
        ) : (
          <MakeupWeekView
            products={makeupProducts}
            completionState={completionState}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>
    </div>
  );
}

export default function MakeupPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <MakeupPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}