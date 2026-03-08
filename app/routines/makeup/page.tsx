"use client";

import { useState, useMemo, useCallback } from "react";
import { Palette, Sparkles, Eye, Heart } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useAdmin } from "@/hooks/useAdmin";
import type { Product } from "@/types";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { RoutineColumn, EditProductModal, AddProductModal } from "@/components/routines";

const MAKEUP_CATEGORIES = [
  "Foundation", "Concealer", "Primer", "Powder", "Blush", "Bronzer", "Highlighter",
  "Eyeshadow", "Eyeliner", "Mascara", "Eyebrow", "Kajal",
  "Lipstick", "Lip Gloss", "Lip Liner", "Lip Balm",
  "Setting Spray", "Perfume", "Nail", "Body",
];

// Categorize products into 4 main groups
const categorizeMakeupProduct = (category: string): "Eyes" | "Skin" | "Lips" | "Body" => {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("eye") || lowerCategory.includes("mascara") ||
      lowerCategory.includes("liner") || lowerCategory.includes("shadow") ||
      lowerCategory.includes("brow") || lowerCategory.includes("kajal")) {
    return "Eyes";
  }
  if (lowerCategory.includes("lip")) {
    return "Lips";
  }
  if (lowerCategory.includes("body") || lowerCategory.includes("hand") ||
      lowerCategory.includes("nail") || lowerCategory.includes("perfume")) {
    return "Body";
  }
  return "Skin";
};

// Column configuration
const MAKEUP_COLUMNS = {
  Eyes:  { icon: Eye,      iconColor: "text-purple-500", ringColor: "text-purple-500", barColor: "bg-purple-500" },
  Skin:  { icon: Sparkles, iconColor: "text-pink-500",   ringColor: "text-pink-500",   barColor: "bg-pink-500"   },
  Lips:  { icon: Heart,    iconColor: "text-rose-500",   ringColor: "text-rose-500",   barColor: "bg-rose-500"   },
  Body:  { icon: Palette,  iconColor: "text-amber-500",  ringColor: "text-amber-500",  barColor: "bg-amber-500"  },
} as const;

type ColumnKey = keyof typeof MAKEUP_COLUMNS;
const COLUMN_KEYS: ColumnKey[] = ["Eyes", "Skin", "Lips", "Body"];

function computeProgress(products: Product[], completedSet: Set<string>) {
  const total = products.length;
  const completed = products.filter((p) => completedSet.has(p.id)).length;
  return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

function MakeupPageContent() {
  const { data, refreshFromDb } = useAppStore();
  const { isAdmin } = useAdmin();
  const [completedProducts, setCompletedProducts] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const makeupProducts = useMemo(() => {
    return data.products
      .filter((p) => p.routineType === "makeup")
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [data.products]);

  // Group products by makeup category column
  const columnProducts = useMemo(() => {
    const result: Record<ColumnKey, Product[]> = { Eyes: [], Skin: [], Lips: [], Body: [] };
    makeupProducts.forEach((p) => {
      const col = categorizeMakeupProduct(p.category);
      result[col].push(p);
    });
    return result;
  }, [makeupProducts]);

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
      const res = await fetch(`/api/makeup?id=${encodeURIComponent(deletingProduct.id)}`, { method: "DELETE" });
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Makeup Routine</h1>
            <p className="text-gray-500">Your daily beauty ritual</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-pink-500" />}
        </div>
      </header>

      {/* Quad-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
          {COLUMN_KEYS.map((col) => {
            const config = MAKEUP_COLUMNS[col];
            const products = columnProducts[col];
            const progress = computeProgress(products, completedProducts);

            return (
              <RoutineColumn
                key={col}
                title={col}
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
                theme={PRODUCT_CARD_THEMES.makeup}
                emptyIcon={config.icon}
                emptyMessage={`No ${col.toLowerCase()} products`}
                variant="makeup"
              />
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          apiUrl="/api/makeup"
          accentColor="bg-pink-500"
          categories={MAKEUP_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSaved={refreshFromDb}
          showShade
          hideSchedule
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          routineType="makeup"
          apiUrl="/api/makeup"
          accentColor="bg-pink-500"
          categories={MAKEUP_CATEGORIES}
          onClose={() => setShowAddModal(false)}
          onSaved={refreshFromDb}
          showShade
          hideSchedule
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