"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { Gem, Heart, Loader2, Edit2, Trash2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useDbData } from "@/hooks/useDbData";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCrudModal, Field, inputClass, selectClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import type { JewelleryItem } from "@/types";

const JEWELLERY_CATEGORIES = ["Earrings", "Necklace", "Ring", "Bracelet", "Watch", "Other"] as const;

// Derive subcategories from items
function getSubcategories(items: JewelleryItem[], category: string): string[] {
  const subs = new Set<string>();
  items.forEach((i) => {
    if (i.category === category && i.subcategory) subs.add(i.subcategory);
  });
  return Array.from(subs).sort();
}

/* ─── Add/Edit Modal ─── */
function JewelleryFormModal({
  item,
  onClose,
  onSaved,
}: {
  item?: JewelleryItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "Earrings");
  const [subcategory, setSubcategory] = useState(item?.subcategory ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [favorite, setFavorite] = useState(item?.favorite ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPEG, WebP, and AVIF images are allowed");
      return;
    }

    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5 MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageUrl(""); // Clear URL input when file is selected
    setError(null);
  }, []);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(item?.imageUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [item?.imageUrl]);

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imageUrl.trim();

      // Upload file if selected
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/jewellery/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Image upload failed");
        }
        finalImageUrl = uploadData.url;
        setIsUploading(false);
      }

      const payload: Record<string, unknown> = {
        id: item?.id ?? `j-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        name: name.trim(),
        category,
        subcategory: subcategory.trim() || null,
        imageUrl: finalImageUrl,
        favorite,
      };
      const res = await fetch("/api/jewellery", {
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
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, category, subcategory, imageUrl, favorite, selectedFile, item?.id, isEdit, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Jewellery" : "Add Jewellery"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor="bg-cyan-600"
    >
      <Field label="Name *">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gold Hoop Earrings" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category *">
          <select value={category} onChange={(e) => setCategory(e.target.value as JewelleryItem["category"])} className={selectClass}>
            {JEWELLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Subcategory">
          <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. Hoops" className={inputClass} />
        </Field>
      </div>

      {/* Image Upload Section */}
      <Field label="Image">
        <div className="space-y-3">
          {/* File Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative w-full h-36 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden",
              "flex items-center justify-center transition-colors",
              previewUrl
                ? "border-cyan-300 bg-[#FDF5E6]"
                : "border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50"
            )}
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-xl"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearSelectedFile(); }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <div className="text-center">
                <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Tap to upload from gallery</p>
                <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPEG, WebP, AVIF · Max 5 MB</p>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* URL Input */}
          <input
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (e.target.value.trim()) {
                setSelectedFile(null);
                setPreviewUrl(e.target.value.trim());
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
            placeholder="Paste image URL instead..."
            className={inputClass}
            disabled={!!selectedFile}
          />
        </div>
      </Field>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} className="w-4 h-4 rounded text-cyan-500" />
        <span className="text-sm text-stone-700">Favorite</span>
      </label>
    </AdminCrudModal>
  );
}

// Jewellery Page Content
function JewelleryPageContent() {
  const { data: items, loading, refetch } = useDbData<JewelleryItem[]>("/api/jewellery", []);
  const { isAdmin } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("Earrings");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<JewelleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<JewelleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ["Earrings", "Necklace", "Other"];

  // Get subcategories dynamically based on selected category
  const subcategories = useMemo(() => {
    return getSubcategories(items, selectedCategory);
  }, [items, selectedCategory]);

  // Auto-select first subcategory when subcategories change
  const activeSubcategory = selectedSubcategory && subcategories.includes(selectedSubcategory)
    ? selectedSubcategory
    : subcategories[0] ?? null;

  // Filter items by category and subcategory
  const filteredItems = useMemo(() => {
    let result = items.filter((i) => i.category === selectedCategory);
    if (activeSubcategory) {
      result = result.filter((i) => i.subcategory === activeSubcategory);
    }
    return result;
  }, [items, selectedCategory, activeSubcategory]);

  // Reset subcategory when main category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  const handleDelete = useCallback(async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jewellery?id=${deletingItem.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      refetch();
      setDeletingItem(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingItem, refetch]);

  return (
    <div className="space-y-8">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      )}

      {!loading && (
        <>
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-jewellery flex items-center justify-center">
            <Gem className="w-6 h-6 text-cyan-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Jewellery</h1>
            <p className="text-gray-500">{items.length} pieces</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-cyan-600" />}
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              selectedCategory === cat
                ? "bg-cyan-100 text-cyan-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory Filter — appears when a main category is selected */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activeSubcategory === sub
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="lifeos-card-interactive overflow-hidden animate-slide-in group relative"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image */}
            <div className="aspect-square bg-[#FDF5E6] relative flex items-center justify-center">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  className="object-contain"
                />
              ) : (
                <Gem className="w-8 h-8 text-cyan-300" />
              )}

              {/* Favorite Badge */}
              {item.favorite && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-red-500 fill-current" />
                </div>
              )}

              {/* Admin Actions (hover) */}
              {isAdmin && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setEditingItem(item)} className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <Gem className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No jewellery in this category</p>
        </div>
      )}

        </> /* end !loading */
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <JewelleryFormModal
          item={editingItem}
          onClose={() => { setShowAddModal(false); setEditingItem(null); }}
          onSaved={refetch}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <DeleteConfirmModal
          itemName={deletingItem.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function JewelleryPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <JewelleryPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
