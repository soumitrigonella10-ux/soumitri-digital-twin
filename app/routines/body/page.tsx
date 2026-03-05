"use client";

import { useState, useMemo, useCallback } from "react";
import { Droplets, Sun, Moon } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useAppStore } from "@/store/useAppStore";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn, EditProductModal, AddProductModal } from "@/components/routines";
import type { Product } from "@/types";

const BODY_CATEGORIES = ["Body Wash", "Body Lotion", "Body Oil", "Deodorant", "Scrub", "Hair Removal", "Treatment", "Shave", "Post Shave", "Healing"];

function BodyPageContent() {
  const routine = useRoutineProducts({ routineType: "body" });
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
      const res = await fetch(`/api/bodycare?id=${deletingProduct.id}`, { method: "DELETE" });
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

  // Calculate shaving products progress
  const shavingProgress = useMemo(() => {
    const shavingProducts = routine.morningProducts.filter((p) => 
      ['Shave', 'Post Shave', 'Healing'].includes(p.category)
    );
    const completed = shavingProducts.filter((p) => 
      routine.completedProducts.has(p.id)
    ).length;
    const total = shavingProducts.length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [routine.morningProducts, routine.completedProducts]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-body flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Body Products</h1>
            <p className="text-gray-500">Manage your body care routine products</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-blue-500" />}
        </div>
      </header>

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-blue-100 text-blue-700"
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
            products={routine.morningProducts.filter((p) => 
              !['Shave', 'Post Shave', 'Healing'].includes(p.category)
            )}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.body}
            emptyIcon={Droplets}
            emptyMessage="No morning products"
            variant="compact"
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
            theme={PRODUCT_CARD_THEMES.body}
            emptyIcon={Droplets}
            emptyMessage="No evening products"
            variant="compact"
          />
          <RoutineColumn
            title="Shaving"
            icon={Droplets}
            iconColorClass="text-blue-500"
            progressRingColorClass="text-blue-500"
            progressBarColorClass="bg-blue-500"
            progress={shavingProgress}
            products={routine.morningProducts.filter((p) => 
              ['Shave', 'Post Shave', 'Healing'].includes(p.category)
            )}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            onEdit={isAdmin ? setEditingProduct : undefined}
            onDelete={isAdmin ? setDeletingProduct : undefined}
            theme={PRODUCT_CARD_THEMES.body}
            emptyIcon={Droplets}
            emptyMessage="No shaving products"
            variant="compact"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          apiUrl="/api/bodycare"
          accentColor="bg-blue-500"
          categories={BODY_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSaved={refreshFromDb}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          routineType="body"
          apiUrl="/api/bodycare"
          accentColor="bg-blue-500"
          categories={BODY_CATEGORIES}
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

export default function BodyPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <BodyPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
