"use client";

import { Sparkles, Sun, Moon } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal } from "@/components/routines";

function SkinPageContent() {
  const routine = useRoutineProducts({ routineType: "skin" });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-skin flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skin Products</h1>
            <p className="text-gray-500">Manage your skincare routine products</p>
          </div>
        </div>
      </header>

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-pink-100 text-pink-700"
      />

      {/* Dual-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RoutineColumn
            title="Morning"
            icon={Sun}
            iconColorClass="text-amber-500"
            progressRingColorClass="text-pink-500"
            progressBarColorClass="bg-pink-500"
            progress={routine.morningProgress}
            products={routine.morningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.skin}
            emptyIcon={Sparkles}
            emptyMessage="No morning products"
          />
          <RoutineColumn
            title="Evening"
            icon={Moon}
            iconColorClass="text-rose-500"
            progressRingColorClass="text-rose-500"
            progressBarColorClass="bg-rose-500"
            progress={routine.eveningProgress}
            products={routine.eveningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.skin}
            emptyIcon={Sparkles}
            emptyMessage="No evening products"
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
          accentColorClass="bg-pink-500"
        />
      )}
    </div>
  );
}

export default function SkinPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <SkinPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
