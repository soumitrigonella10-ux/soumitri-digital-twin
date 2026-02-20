"use client";

import { useState, useMemo, useCallback } from "react";
import { Target, Sun, Moon } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { cn } from "@/lib/utils";
import type { Product, BodyArea } from "@/types";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal } from "@/components/routines";
import { BODY_AREAS, getProductArea } from "@/data/bodyAreas";

function BodySpecificsPageContent() {
  const routine = useRoutineProducts({ routineType: "bodySpecific" });
  const [activeAreaFilter, setActiveAreaFilter] = useState<keyof typeof BODY_AREAS | "ALL">("ALL");

  // Apply area filter on top of time-filtered products
  const applyAreaFilter = useCallback(
    (products: Product[]) => {
      if (activeAreaFilter === "ALL") return products;
      return products.filter((p) => {
        return p.bodyAreas?.includes(activeAreaFilter as BodyArea);
      });
    },
    [activeAreaFilter]
  );

  // Deduplicate products by name when viewing "ALL" areas
  const deduplicateProducts = useCallback((products: Product[]): Product[] => {
    if (activeAreaFilter !== "ALL") return products;
    
    const productMap = new Map<string, Product>();
    
    products.forEach((product) => {
      const existing = productMap.get(product.name);
      if (existing) {
        // Merge body areas and weekdays
        const mergedBodyAreas = Array.from(
          new Set([...(existing.bodyAreas || []), ...(product.bodyAreas || [])])
        );
        const mergedWeekdays = Array.from(
          new Set([...(existing.weekdays || []), ...(product.weekdays || [])])
        ).sort();
        
        productMap.set(product.name, {
          ...existing,
          bodyAreas: mergedBodyAreas,
          weekdays: mergedWeekdays,
        });
      } else {
        productMap.set(product.name, product);
      }
    });
    
    return Array.from(productMap.values()).sort(
      (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
    );
  }, [activeAreaFilter]);

  const morningProducts = useMemo(
    () => deduplicateProducts(applyAreaFilter(routine.morningProducts)),
    [routine.morningProducts, applyAreaFilter, deduplicateProducts]
  );

  const eveningProducts = useMemo(
    () => deduplicateProducts(applyAreaFilter(routine.eveningProducts)),
    [routine.eveningProducts, applyAreaFilter, deduplicateProducts]
  );

  // Recompute progress for area-filtered products
  const morningProgress = useMemo(() => {
    const total = morningProducts.length;
    const completed = morningProducts.filter((p) => routine.completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [morningProducts, routine.completedProducts]);

  const eveningProgress = useMemo(() => {
    const total = eveningProducts.length;
    const completed = eveningProducts.filter((p) => routine.completedProducts.has(p.id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [eveningProducts, routine.completedProducts]);

  const renderProductExtras = useCallback(
    (product: Product) => {
      const shouldHighlight =
        activeAreaFilter !== "ALL" &&
        product.bodyAreas?.includes(activeAreaFilter as BodyArea);

      return {
        highlighted: shouldHighlight || undefined,
        highlightRingColor: shouldHighlight
          ? BODY_AREAS[getProductArea(product)]?.glowColor
          : undefined,
        additionalMetadata:
          product.bodyAreas && product.bodyAreas.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {product.bodyAreas.map((area, idx) => {
                const areaKey = area as keyof typeof BODY_AREAS;
                const config = BODY_AREAS[areaKey] || BODY_AREAS.UA;
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
          ) : undefined,
      };
    },
    [activeAreaFilter]
  );

  return (
    <div className="w-full space-y-6">
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
          const count = routine.filteredProducts.filter((p) => {
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

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-purple-100 text-purple-700"
      />

      {/* Dual-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoutineColumn
            title="Morning"
            icon={Sun}
            iconColorClass="text-amber-500"
            progressRingColorClass="text-amber-500"
            progressBarColorClass="bg-amber-500"
            progress={morningProgress}
            products={morningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.bodySpecifics}
            emptyIcon={Target}
            emptyMessage="No morning products"
            renderProductExtras={renderProductExtras}
          />
          <RoutineColumn
            title="Evening"
            icon={Moon}
            iconColorClass="text-indigo-500"
            progressRingColorClass="text-indigo-500"
            progressBarColorClass="bg-indigo-500"
            progress={eveningProgress}
            products={eveningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.bodySpecifics}
            emptyIcon={Target}
            emptyMessage="No evening products"
            renderProductExtras={renderProductExtras}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {routine.editingProductData && (
        <EditProductModal
          product={routine.editingProductData}
          editForm={routine.editForm}
          onEditFormChange={routine.setEditForm}
          onSave={routine.handleEditSave}
          onCancel={routine.handleEditCancel}
          accentColorClass="bg-purple-500"
        />
      )}
    </div>
  );
}

export default function BodySpecificsPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <BodySpecificsPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
