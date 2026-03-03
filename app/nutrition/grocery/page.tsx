"use client";

import { useState, useMemo, useCallback } from "react";
import { ShoppingCart, Package, RefreshCw, Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useDbData } from "@/hooks/useDbData";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCrudModal, Field, inputClass, selectClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";

interface GroceryCategory {
  id: string;
  name: string;
  emoji: string;
  listType: string;
  items: { name: string; quantity?: string }[];
}

// Color mapping stays in code — pure presentational config
const categoryColors: Record<string, { bg: string; border: string }> = {
  "Grains & Flours": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dry Fruits & Seeds": { bg: "bg-orange-50", border: "border-orange-200" },
  "Essentials & Condiments": { bg: "bg-yellow-50", border: "border-yellow-200" },
  "Pulses & Lentils": { bg: "bg-lime-50", border: "border-lime-200" },
  "Cooking Basics": { bg: "bg-stone-50", border: "border-stone-200" },
  "Whole Spices": { bg: "bg-rose-50", border: "border-rose-200" },
  "Spice Powders": { bg: "bg-red-50", border: "border-red-200" },
  "Beverages": { bg: "bg-cyan-50", border: "border-cyan-200" },
  "Vegetables": { bg: "bg-emerald-50", border: "border-emerald-200" },
  "Fruits": { bg: "bg-green-50", border: "border-green-200" },
  "Bread": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dairy & Eggs": { bg: "bg-blue-50", border: "border-blue-200" },
  "Aromatics & Fresh Herbs": { bg: "bg-teal-50", border: "border-teal-200" },
};

/* ─── Grocery Category Form Modal ─── */
function GroceryCategoryFormModal({
  category,
  defaultListType,
  onClose,
  onSaved,
}: {
  category?: GroceryCategory | null;
  defaultListType: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name ?? "");
  const [emoji, setEmoji] = useState(category?.emoji ?? "🛒");
  const [listType, setListType] = useState(category?.listType ?? defaultListType);
  const [items, setItems] = useState<{ name: string; quantity?: string }[]>(
    category?.items ?? [{ name: "", quantity: "" }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => setItems([...items, { name: "", quantity: "" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "name" | "quantity", value: string) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const filteredItems = items.filter((i) => i.name.trim());
      const payload = {
        id: category?.id ?? `gc-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: name.trim(),
        emoji: emoji.trim() || "🛒",
        listType,
        items: filteredItems.map((i) => ({ name: i.name.trim(), quantity: i.quantity?.trim() || undefined })),
      };
      const res = await fetch("/api/grocery", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed");
      setSuccess(true);
      setTimeout(() => { onSaved(); onClose(); }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, emoji, listType, items, category?.id, isEdit, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Category" : "Add Category"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor="bg-slate-700"
    >
      <div className="grid grid-cols-[1fr_80px_120px] gap-3">
        <Field label="Category Name *">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Vegetables" />
        </Field>
        <Field label="Emoji">
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className={inputClass} placeholder="🛒" />
        </Field>
        <Field label="List Type">
          <select value={listType} onChange={(e) => setListType(e.target.value)} className={selectClass}>
            <option value="master">Master</option>
            <option value="weekly">Weekly</option>
          </select>
        </Field>
      </div>

      <Field label="Items">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={item.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
                placeholder="Item name"
                className={cn(inputClass, "flex-1")}
              />
              <input
                value={item.quantity ?? ""}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                placeholder="Qty"
                className={cn(inputClass, "w-24")}
              />
              <button onClick={() => removeItem(idx)} className="p-1.5 text-gray-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add item
        </button>
      </Field>
    </AdminCrudModal>
  );
}

function GroceryPageContent() {
  const [activeTab, setActiveTab] = useState<"master" | "weekly">("weekly");
  const { data: allCategories, loading, refetch } = useDbData<GroceryCategory[]>("/api/grocery", []);
  const { isAdmin } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GroceryCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<GroceryCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = useMemo(
    () => allCategories.filter((c) => c.listType === activeTab),
    [allCategories, activeTab]
  );
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  const handleDelete = useCallback(async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/grocery?id=${deletingCategory.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      refetch();
      setDeletingCategory(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingCategory, refetch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-grocery flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-slate-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
            <p className="text-gray-500">
              {totalItems} items • {activeTab === "master" ? "Pantry staples" : "Buy this week"}
            </p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-slate-700" />}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("master")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            activeTab === "master"
              ? "bg-slate-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Package className="w-4 h-4" />
          Master Setup
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
            activeTab === "weekly"
              ? "bg-slate-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Weekly Fresh
        </button>
      </div>

      {/* Description */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
      <>
      <div className="lifeos-card p-4 bg-gradient-to-r from-slate-50 to-gray-50">
        {activeTab === "master" ? (
          <div>
            <p className="text-sm text-gray-600 font-medium">🛒 Long-term pantry staples</p>
            <p className="text-xs text-gray-500 mt-1">
              Stock these once and replenish as needed. These form the foundation of your kitchen.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 font-medium">🥬 Fresh items for the week</p>
            <p className="text-xs text-gray-500 mt-1">
              Buy these every week to keep your meals fresh and nutritious.
            </p>
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((category, catIndex) => {
          const colors = categoryColors[category.name] || { bg: "bg-gray-50", border: "border-gray-200" };
          
          return (
            <div
              key={category.name}
              className={cn(
                "lifeos-card p-4 border animate-slide-in group relative",
                colors.bg,
                colors.border
              )}
              style={{ animationDelay: `${catIndex * 50}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{category.emoji}</span>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <span className="ml-auto text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                  {category.items.length} items
                </span>
                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingCategory(category)} className="p-1 text-gray-400 hover:text-gray-700">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeletingCategory(category)} className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{item.name}</span>
                    {item.quantity && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="lifeos-card p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              {activeTab === "master" ? "Pantry Essentials" : "Weekly Shopping"}
            </p>
            <p className="text-xs text-green-600">
              {categories.length} categories • {totalItems} total items
            </p>
          </div>
          <div className="text-3xl">
            {activeTab === "master" ? "🏪" : "🛒"}
          </div>
        </div>
      </div>
      </> /* end loading guard */
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <GroceryCategoryFormModal
          category={editingCategory}
          defaultListType={activeTab}
          onClose={() => { setShowAddModal(false); setEditingCategory(null); }}
          onSaved={refetch}
        />
      )}

      {/* Delete Confirmation */}
      {deletingCategory && (
        <DeleteConfirmModal
          itemName={deletingCategory.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCategory(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function GroceryPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <GroceryPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
