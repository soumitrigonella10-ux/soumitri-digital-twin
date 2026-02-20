"use client";

import { useState, useMemo } from "react";
import { Wind, Sun, Droplet } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Product } from "@/types";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { RoutineColumn, EditProductModal } from "@/components/routines";
import type { EditFormState } from "@/components/routines";

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
  const { data, upsertProduct } = useAppStore();
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({});

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
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  const handleEditStart = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({ displayOrder: product.displayOrder });
  };

  const handleEditSave = (product: Product) => {
    const updates: Partial<Product> = {};
    if (editForm.displayOrder !== undefined) updates.displayOrder = editForm.displayOrder;
    upsertProduct({ ...product, ...updates });
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const editingProductData = editingProduct
    ? data.products.find((p) => p.id === editingProduct) ?? null
    : null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-hair flex items-center justify-center">
            <Wind className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hair Care Products</h1>
            <p className="text-gray-500">Manage your hair care routine by phase</p>
          </div>
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
                onEdit={handleEditStart}
                theme={PRODUCT_CARD_THEMES.hair}
                emptyIcon={config.icon}
                emptyMessage={`No ${config.name.toLowerCase()} products`}
              />
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProductData && (
        <EditProductModal
          product={editingProductData}
          editForm={editForm}
          onEditFormChange={setEditForm}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          accentColorClass="bg-blue-500"
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
