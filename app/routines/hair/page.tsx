"use client";

import { useState, useMemo, useCallback } from "react";
import { Wind, Sun, Droplet } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useAdmin } from "@/hooks/useAdmin";
import type { Product } from "@/types";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { RoutineColumn, EditProductModal, AddProductModal } from "@/components/routines";

const HAIR_CATEGORIES = ["Hair Oil", "Shampoo", "Conditioner", "Hair Mask", "Serum", "Styling", "Treatment"];

// Hair Phase configuration
const HAIR_PHASES = {
  oiling: { name: "Oiling", color: "bg-amber-100 text-amber-700", icon: Droplet, iconColor: "text-amber-500", ringColor: "text-amber-500", barColor: "bg-amber-500" },
  washing: { name: "Washing", color: "bg-blue-100 text-blue-700", icon: Wind, iconColor: "text-blue-500", ringColor: "text-blue-500", barColor: "bg-blue-500" },
  postWash: { name: "Post-Wash", color: "bg-green-100 text-green-700", icon: Droplet, iconColor: "text-green-500", ringColor: "text-green-500", barColor: "bg-green-500" },
  daily: { name: "Daily", color: "bg-purple-100 text-purple-700", icon: Sun, iconColor: "text-purple-500", ringColor: "text-purple-500", barColor: "bg-purple-500" },
} as const;

type PhaseKey = keyof typeof HAIR_PHASES;

function computeProgress(products: Product[], completedSet: Set<string>) {
  const total = products.length;
  const completed = products.filter((p) => completedSet.has(p.id)).length;
  return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

function HairPageContent() {
  const { data, refreshFromDb } = useAppStore();
  const { isAdmin } = useAdmin();
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hairProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "hair")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Group by phase
  const phaseProducts = useMemo(() => {
    const result: Record<PhaseKey, Product[]> = { oiling: [], washing: [], postWash: [], daily: [] };
    hairProducts.forEach((p) => {
      const phase = (p.hairPhase as PhaseKey) || "daily";
      if (result[phase]) result[phase].push(p);
    });
    return result;
  }, [hairProducts]);

  const toggleProductCompletion = (productId: string) => {
    setCompletedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleDelete = useCallback(async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/haircare?id=${deletingProduct.id}`, { method: "DELETE" });
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
          <div className="w-12 h-12 rounded-2xl bg-category-hair flex items-center justify-center">
            <Wind className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Hair Care Products</h1>
            <p className="text-gray-500">Manage your hair care routine by phase</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-blue-500" />}
        </div>
      </header>

      {/* Quad-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
          {(Object.keys(HAIR_PHASES) as PhaseKey[]).map((phase) => {
            const config = HAIR_PHASES[phase];
            const products = phaseProducts[phase];
            const progress = computeProgress(products, completedProducts);

            return (
              <RoutineColumn
                key={phase}
                title={config.name}
                icon={config.icon}
                iconColorClass={config.iconColor}
                progressRingColorClass={config.ringColor}
                progressBarColorClass={config.barColor}
                progress={progress}
                products={products}
                completedProducts={completedProducts}
                onToggleComplete={toggleProductCompletion}
                onEdit={isAdmin ? setEditingProduct : undefined}
                onDelete={isAdmin ? setDeletingProduct : undefined}
                theme={PRODUCT_CARD_THEMES.hair}
                emptyIcon={config.icon}
                emptyMessage={`No ${config.name.toLowerCase()} products`}
              />
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          apiUrl="/api/haircare"
          accentColor="bg-blue-500"
          categories={HAIR_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSaved={refreshFromDb}
          showHairPhase
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          routineType="hair"
          apiUrl="/api/haircare"
          accentColor="bg-blue-500"
          categories={HAIR_CATEGORIES}
          onClose={() => setShowAddModal(false)}
          onSaved={refreshFromDb}
          showHairPhase
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

export default function HairPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <HairPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
