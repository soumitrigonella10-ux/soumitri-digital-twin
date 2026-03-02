"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
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
  Ethnic: ["Casual", "Work", "Formal", "Festive"],
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

interface AddWardrobeItemPanelProps {
  open: boolean;
  onClose: () => void;
  onItemAdded?: (item: WardrobeItem) => void;
}

export function AddWardrobeItemPanel({ open, onClose, onItemAdded }: AddWardrobeItemPanelProps) {
  const { upsertWardrobe } = useAppStore();
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

  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setCategory("Top");
    setSubcategory("");
    setOccasion("");
    setSubType("");
    setPreviewUrl(null);
    setSelectedFile(null);
  }, []);

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Name required", variant: "error" });
      return;
    }
    if (!selectedFile) {
      toast({ title: "Image required", description: "Upload a photo of the item", variant: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to Vercel Blob
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

      const imageUrl = uploadData.url;

      // 2. Save item to DB
      const itemRes = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          subcategory: subcategory || undefined,
          occasion: occasion || undefined,
          imageUrl,
          subType: subType || undefined,
        }),
      });
      const itemData = await itemRes.json();

      if (!itemRes.ok || !itemData.success) {
        throw new Error(itemData.error || "Failed to save item");
      }

      // 3. Add to local store so it appears immediately
      const newItem: WardrobeItem = {
        id: itemData.data.id,
        name: itemData.data.name,
        category: itemData.data.category,
        subcategory: itemData.data.subcategory ?? undefined,
        occasion: itemData.data.occasion ?? undefined,
        imageUrl: itemData.data.image_url ?? itemData.data.imageUrl,
        subType: itemData.data.sub_type ?? itemData.data.subType ?? undefined,
      };

      upsertWardrobe(newItem);
      onItemAdded?.(newItem);

      toast({ title: "Item added!", description: `${name} added to ${category}`, variant: "success" });
      resetForm();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subcategories = SUBCATEGORY_MAP[category] ?? [];
  const subTypes = SUBTYPE_OPTIONS[category] ?? [];

  if (!open) return null;

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
          <h2 className="text-lg font-semibold text-gray-900">Add Wardrobe Item</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
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
                  <p className="text-xs text-gray-500">Tap to upload</p>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              <option value="">— None —</option>
              {OCCASION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Select>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !selectedFile}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Add Item
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
