"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Save, Trash2, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ToastProvider";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { WardrobeCategory, WardrobeItem } from "@/types";

// ── Category → subcategory / subType options ─────────────────

const CATEGORIES: WardrobeCategory[] = [
  "Top", "Bottom", "Dress", "Outerwear", "Ethnic",
  "Shoes", "Bags", "Innerwear", "Activewear", "Others",
];

const SUBCATEGORY_MAP: Partial<Record<WardrobeCategory, string[]>> = {
  Top: ["Basics", "Elevated tops", "Seasonals"],
  Bottom: [],
  Ethnic: ["Tops", "Bottoms", "Sets", "Duppattas", "Sarees", "Blouse"],
  Shoes: ["Casual", "Formal", "Heels", "Boots", "Flats", "Sneakers"],
  Outerwear: [],
  Dress: [],
};

const OCCASION_OPTIONS = [
  "Business Casual", "Business Ethnic", "Casual", "Formal",
  "Date Night", "Festive", "Daily", "Travel",
];

const SUBTYPE_OPTIONS: Partial<Record<WardrobeCategory, string[]>> = {
  Bottom: ["Jeans", "Straight", "Skinny", "Bootcut", "Baggy", "Home", "Semi-fancy", "Fancy", "Casuals", "Skirt Casual", "Skirt Formal"],
  Dress: ["Casual", "Formal", "Semi-formal", "Ethnic"],
  Outerwear: ["Blazer", "Jacket", "Cardigan", "Coat", "Shrug", "Shawl", "Ethnic"],
};

// ─────────────────────────────────────────────────────────────

interface EditWardrobeItemPanelProps {
  open: boolean;
  item: WardrobeItem | null;
  onClose: () => void;
  onItemUpdated?: (item: WardrobeItem) => void;
  onItemDeleted?: (id: string) => void;
}

export function EditWardrobeItemPanel({
  open,
  item,
  onClose,
  onItemUpdated,
  onItemDeleted,
}: EditWardrobeItemPanelProps) {
  const { upsertWardrobe, deleteById } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WardrobeCategory>("Top");
  const [subcategory, setSubcategory] = useState("");
  const [occasion, setOccasion] = useState("");
  const [subType, setSubType] = useState("");

  // Image state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Loading
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setSubcategory(item.subcategory ?? "");
      setOccasion(item.occasion ?? "");
      setSubType(item.subType ?? "");
      setPreviewUrl(item.imageUrl);
      setSelectedFile(null);
      setImageChanged(false);
      setShowDeleteConfirm(false);
    }
  }, [item]);

  const handleClose = () => {
    if (!isSaving && !isDeleting) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Use PNG, JPEG, WebP, or AVIF", variant: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5 MB", variant: "error" });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageChanged(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!name.trim()) {
      toast({ title: "Name required", variant: "error" });
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = item.imageUrl;

      // Upload new image if changed
      if (imageChanged && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/wardrobe/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Image upload failed");
        }

        imageUrl = uploadData.url;
      }

      // Update item in DB
      const res = await fetch("/api/wardrobe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          name: name.trim(),
          category,
          subcategory: subcategory || undefined,
          occasion: occasion || undefined,
          imageUrl,
          subType: subType || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update item");
      }

      // Update local store
      const updatedItem: WardrobeItem = {
        id: item.id,
        name: name.trim(),
        category,
        ...(subcategory ? { subcategory } : {}),
        ...(occasion ? { occasion } : {}),
        imageUrl,
        ...(subType ? { subType } : {}),
      };

      upsertWardrobe(updatedItem);
      onItemUpdated?.(updatedItem);

      toast({ title: "Item updated!", description: `${name} saved`, variant: "success" });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/wardrobe?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete item");
      }

      // Remove from local store
      deleteById("wardrobe", item.id);
      onItemDeleted?.(item.id);

      toast({ title: "Item deleted", description: `${item.name} removed`, variant: "success" });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "error" });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const subcategories = SUBCATEGORY_MAP[category] ?? [];
  const subTypes = SUBTYPE_OPTIONS[category] ?? [];
  const busy = isSaving || isDeleting;

  if (!open || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Item</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={busy}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <div
              onClick={() => !busy && fileInputRef.current?.click()}
              className={cn(
                "relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl border-2 border-dashed cursor-pointer",
                "flex items-center justify-center transition-colors",
                previewUrl
                  ? "border-orange-300 bg-[#FDF5E6]"
                  : "border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50"
              )}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-2xl"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Tap to change</p>
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
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Black Silk Blouse"
              disabled={busy}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as WardrobeCategory);
                setSubcategory("");
                setSubType("");
              }}
              disabled={busy}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          {/* Subcategory (if applicable) */}
          {subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={busy}
              >
                <option value="">— None —</option>
                {subcategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          )}

          {/* SubType (if applicable) */}
          {subTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-type</label>
              <Select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                disabled={busy}
              >
                <option value="">— None —</option>
                {subTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          )}

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
            <Select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              disabled={busy}
            >
              <option value="">— None —</option>
              {OCCASION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Select>
          </div>

          {/* Delete section */}
          <div className="pt-4 border-t">
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-red-600 font-medium">
                  Are you sure you want to delete &quot;{item.name}&quot;?
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={busy}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={busy}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={busy}
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Item
              </Button>
            )}
          </div>
        </form>

        {/* Footer — Save */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <Button
            type="submit"
            onClick={handleSave}
            disabled={busy || !name.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
