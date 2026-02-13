"use client";

import { Droplets, Sun, Moon } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal } from "@/components/routines";

function BodyPageContent() {
  const routine = useRoutineProducts({ routineType: "body" });

  return (
    <div className="w-full space-y-6">
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

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-blue-100 text-blue-700"
      />

      {/* Dual-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RoutineColumn
            title="Morning"
            icon={Sun}
            iconColorClass="text-amber-500"
            progressRingColorClass="text-amber-500"
            progressBarColorClass="bg-amber-500"
            progress={routine.morningProgress}
            products={routine.morningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.body}
            emptyIcon={Droplets}
            emptyMessage="No morning products"
          />
          <RoutineColumn
            title="Evening"
            icon={Moon}
            iconColorClass="text-indigo-500"
            progressRingColorClass="text-indigo-500"
            progressBarColorClass="bg-indigo-500"
            progress={routine.eveningProgress}
            products={routine.eveningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={routine.handleEditStart}
            theme={PRODUCT_CARD_THEMES.body}
            emptyIcon={Droplets}
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
          accentColorClass="bg-blue-500"
        />
      )}
    </div>
  );
}

export default function BodyPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <BodyPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
