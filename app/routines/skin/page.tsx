"use client";

import { useState, useCallback } from "react";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useAppStore } from "@/store/useAppStore";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal, AddProductModal } from "@/components/routines";
import type { Product } from "@/types";

const SKIN_CATEGORIES = ["Cleanser", "Essence", "Serum", "Moisturizer", "Sunscreen", "Retinoid", "Exfoliant", "Treatment"];

function SkinPageContent() {
  const routine = useRoutineProducts({ routineType: "skin" });
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
      const res = await fetch(`/api/skincare?id=${deletingProduct.id}`, { method: "DELETE" });
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
          <div className="w-12 h-12 rounded-2xl bg-category-skin flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Skin Products</h1>
            <p className="text-gray-500">Manage your skincare routine products</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-pink-500" />}
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
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
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
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.skin}
            emptyIcon={Sparkles}
            emptyMessage="No evening products"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          apiUrl="/api/skincare"
          accentColor="bg-pink-500"
          categories={SKIN_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSaved={refreshFromDb}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          routineType="skin"
          apiUrl="/api/skincare"
          accentColor="bg-pink-500"
          categories={SKIN_CATEGORIES}
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
