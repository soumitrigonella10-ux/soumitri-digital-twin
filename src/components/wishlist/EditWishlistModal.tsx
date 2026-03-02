"use client";

import { useState, useCallback } from "react";
import { X, Loader2, Check } from "lucide-react";
import { updateContent } from "@/cms/actions";
import type { WishlistItem } from "@/types/wardrobe";

const CATEGORIES = [
  { value: "Tops", label: "Tops" }, { value: "Bottoms", label: "Bottoms" },
  { value: "Shoes", label: "Shoes" }, { value: "Bags", label: "Bags" },
  { value: "Suits", label: "Suits" }, { value: "Seasonals", label: "Seasonals" },
  { value: "Accessories", label: "Accessories" }, { value: "Other", label: "Other" },
];

const PRIORITIES = [
  { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" },
];

const CURRENCIES = [
  { value: "INR", label: "INR (₹)" }, { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" }, { value: "GBP", label: "GBP (£)" },
];

interface EditWishlistModalProps {
  item: WishlistItem;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditWishlistModal({ item, onClose, onSaved }: EditWishlistModalProps) {
  const [name, setName] = useState(item.name);
  const [brand, setBrand] = useState(item.brand || "");
  const [category, setCategory] = useState(item.category);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(item.priority || "Medium");
  const [tags, setTags] = useState((item.tags || []).join(", "));
  const [imageUrl, setImageUrl] = useState(item.imageUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(item.websiteUrl || "");
  const [price, setPrice] = useState(item.price ? String(item.price) : "");
  const [currency, setCurrency] = useState(item.currency || "INR");
  const [purchased, setPurchased] = useState(item.purchased || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    setError(null); setIsSubmitting(true);
    try {
      const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      const parsedPrice = price ? parseFloat(price) : undefined;
      const result = await updateContent({
        id: item.id,
        title: name.trim(),
        slug: slugify(name),
        coverImage: imageUrl || null,
        metadata: { category, tags: parsedTags, priority, purchased },
        payload: { brand: brand.trim(), imageUrl: imageUrl.trim(), websiteUrl: websiteUrl.trim(), price: parsedPrice, currency },
      });
      if (result.success) { setSuccess(true); setTimeout(() => { onSaved?.(); onClose(); }, 1200); }
      else { setError(result.error || "Failed to update"); }
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); } finally { setIsSubmitting(false); }
  }, [name, brand, category, priority, tags, imageUrl, websiteUrl, price, currency, purchased, item.id, onClose, onSaved]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Edit Wishlist Item</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as WishlistItem["category"])} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Website URL</label>
            <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Price</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPurchased(!purchased)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${purchased ? "bg-telugu-kavi" : "bg-stone-300"}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${purchased ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">Purchased</span>
          </div>

          {error && <p className="text-sm text-red-600 font-editorial">{error}</p>}
          {success && <div className="flex items-center gap-2 text-sm text-green-700 font-editorial"><Check className="h-4 w-4" />Updated!</div>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || !name.trim()} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
