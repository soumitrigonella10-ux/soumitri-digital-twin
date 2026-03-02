"use client";

import { useState, useCallback } from "react";
import { X, Loader2, Check } from "lucide-react";
import { createContent } from "@/cms/actions";

const CATEGORIES = [
  { value: "Tops", label: "Tops" },
  { value: "Bottoms", label: "Bottoms" },
  { value: "Shoes", label: "Shoes" },
  { value: "Bags", label: "Bags" },
  { value: "Suits", label: "Suits" },
  { value: "Seasonals", label: "Seasonals" },
  { value: "Accessories", label: "Accessories" },
  { value: "Other", label: "Other" },
];

const PRIORITIES = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const CURRENCIES = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

interface AddWishlistModalProps {
  onClose: () => void;
  onPublished?: () => void;
}

export function AddWishlistModal({ onClose, onPublished }: AddWishlistModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Tops");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (!category) { setError("Category is required"); return; }

    setError(null);
    setIsSubmitting(true);
    try {
      const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      const parsedPrice = price ? parseFloat(price) : undefined;

      const result = await createContent({
        type: "wishlist-item",
        title: name.trim(),
        slug: slugify(name),
        visibility: "published",
        isFeatured: false,
        coverImage: imageUrl || null,
        metadata: {
          category,
          tags: parsedTags,
          priority,
          purchased: false,
        },
        payload: {
          brand: brand.trim(),
          imageUrl: imageUrl.trim(),
          websiteUrl: websiteUrl.trim(),
          price: parsedPrice,
          currency,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onPublished?.(); onClose(); }, 1200);
      } else {
        setError(result.error || "Failed to publish");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, brand, category, priority, tags, imageUrl, websiteUrl, price, currency, onClose, onPublished]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Add to Wishlist</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Polyamide Tee" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Zara" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Image URL <span className="normal-case tracking-normal text-stone-400 ml-1">(paste a URL)</span></label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://... or /images/products/..." className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          {/* Website URL */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Website URL</label>
            <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Price</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 1299" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Tags <span className="normal-case tracking-normal text-stone-400 ml-1">(comma-separated)</span></label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. Tops, Apparel" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          {error && <p className="text-sm text-red-600 font-editorial">{error}</p>}
          {success && <div className="flex items-center gap-2 text-sm text-green-700 font-editorial"><Check className="h-4 w-4" />Added to wishlist!</div>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || !name.trim()} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}
