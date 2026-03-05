"use client";

import { useState, useCallback } from "react";
import { Pill, Sun, Moon, Sunrise } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useAppStore } from "@/store/useAppStore";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal, AddProductModal } from "@/components/routines";
import type { Product } from "@/types";

const WELLNESS_CATEGORIES = ["Supplement", "Vitamin", "Mineral", "Probiotic", "Herbal", "Protein", "Collagen", "Omega", "Antioxidant", "Treatment"];

function WellnessPageContent() {
  const routine = useRoutineProducts({ routineType: "wellness" });
  const { isAdmin } = useAdmin();
  const { refreshFromDb } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/wellness?id=${deletingProduct.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await refreshFromDb();
      setDeletingProduct(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingProduct, refreshFromDb]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-wellness flex items-center justify-center">
            <Pill className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Wellness Products</h1>
            <p className="text-gray-500">Track your supplements and wellness routine</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-green-500" />}
        </div>
      </header>

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-green-100 text-green-700"
      />

      {/* Triple-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No morning products"
          />
          <RoutineColumn
            title="Midday"
            icon={Sunrise}
            iconColorClass="text-orange-500"
            progressRingColorClass="text-orange-500"
            progressBarColorClass="bg-orange-500"
            progress={routine.middayProgress}
            products={routine.middayProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No midday products"
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
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No evening products"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          apiUrl="/api/wellness"
          accentColor="bg-green-500"
          categories={WELLNESS_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSaved={refreshFromDb}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          routineType="wellness"
          apiUrl="/api/wellness"
          accentColor="bg-green-500"
          categories={WELLNESS_CATEGORIES}
          onClose={() => setShowAddModal(false)}
          onSaved={refreshFromDb}
        />
      )}

      {/* Delete Confirmation */}
      {deletingProduct && (
        <DeleteConfirmModal
          itemName={deletingProduct.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function WellnessPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <WellnessPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
