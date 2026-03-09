"use client";

import { useState, useCallback, useRef } from "react";
import { X, Loader2, Check, ImagePlus, Upload, Link2, Sparkles } from "lucide-react";
import { createContent } from "@/cms/actions";

const CATEGORIES = [
  { value: "Tops", label: "Tops" },
  { value: "Bottoms", label: "Bottoms" },
  { value: "Dresses", label: "Dresses" },
  { value: "Outerwear", label: "Outerwear" },
  { value: "Suits", label: "Suits" },
  { value: "Bags", label: "Bags" },
  { value: "Shoes", label: "Shoes" },
  { value: "Jewellery", label: "Jewellery" },
  { value: "Things", label: "Things" },
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

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from URL state
  const [fetchUrl, setFetchUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [didAutoFill, setDidAutoFill] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFetchMeta = useCallback(async () => {
    const trimmed = fetchUrl.trim();
    if (!trimmed) return;
    setFetchError(null);
    setIsFetching(true);
    try {
      const res = await fetch("/api/wishlist/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setFetchError(json.error || "Could not fetch metadata");
        return;
      }
      const d = json.data;
      if (d.title && !name) setName(d.title);
      if (d.brand && !brand) setBrand(d.brand);
      if (d.image && !imageUrl && !selectedFile) setImageUrl(d.image);
      if (d.url && !websiteUrl) setWebsiteUrl(d.url);
      if (d.price != null && !price) setPrice(String(d.price));
      if (d.currency && currency === "INR") setCurrency(d.currency);
      setDidAutoFill(true);
    } catch {
      setFetchError("Failed to fetch — check the URL and try again");
    } finally {
      setIsFetching(false);
    }
  }, [fetchUrl, name, brand, imageUrl, selectedFile, websiteUrl, price, currency]);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Use PNG, JPEG, WebP, or AVIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5 MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageUrl(""); // Clear manual URL when file is selected
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (!category) { setError("Category is required"); return; }

    setError(null);
    setIsSubmitting(true);
    try {
      // Upload image file to Vercel Blob if one was selected
      let finalImageUrl = imageUrl.trim();
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch("/api/wardrobe/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        setIsUploading(false);
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Image upload failed");
        }
        finalImageUrl = uploadData.url;
      }

      const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      const parsedPrice = price ? parseFloat(price) : undefined;

      const result = await createContent({
        type: "wishlist-item",
        title: name.trim(),
        slug: slugify(name),
        visibility: "published",
        isFeatured: false,
        coverImage: finalImageUrl || null,
        metadata: {
          category,
          tags: parsedTags,
          priority,
          purchased: false,
        },
        payload: {
          brand: brand.trim(),
          imageUrl: finalImageUrl,
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
  }, [name, brand, category, priority, tags, imageUrl, websiteUrl, price, currency, selectedFile, onClose, onPublished]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Add to Wishlist</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Quick Add — paste a product URL to auto-fill */}
          <div className="rounded-lg border border-dashed border-telugu-marigold/50 bg-orange-50/60 p-4 space-y-2">
            <label className="flex items-center gap-1.5 font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-kavi">
              <Sparkles className="h-3.5 w-3.5" />Quick Add — Paste a product link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={fetchUrl}
                  onChange={(e) => { setFetchUrl(e.target.value); setFetchError(null); setDidAutoFill(false); }}
                  placeholder="https://www.zara.com/in/en/..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchMeta}
                disabled={isFetching || !fetchUrl.trim()}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Fetch
              </button>
            </div>
            {fetchError && <p className="text-xs text-red-600 font-editorial">{fetchError}</p>}
            {didAutoFill && <p className="text-xs text-green-700 font-editorial flex items-center gap-1"><Check className="h-3 w-3" />Fields auto-filled — review and edit below</p>}
          </div>

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

          {/* Image — Upload or URL */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Image</label>
            <div className="flex gap-3 items-start">
              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-20 h-20 rounded-lg border-2 border-dashed cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors ${
                  previewUrl ? "border-telugu-marigold bg-orange-50" : "border-stone-300 bg-stone-50 hover:border-telugu-marigold"
                }`}
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <ImagePlus className="w-5 h-5 text-stone-400" />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleFileSelect} className="hidden" />
              {/* Or paste URL */}
              <div className="flex-1">
                <input type="text" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); setPreviewUrl(null); }} placeholder="…or paste image URL" disabled={!!selectedFile} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial disabled:opacity-50" />
                {selectedFile && <p className="text-xs text-stone-400 mt-1">{selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB</p>}
                {isUploading && <p className="text-xs text-telugu-marigold mt-1 flex items-center gap-1"><Upload className="w-3 h-3 animate-bounce" /> Uploading…</p>}
              </div>
            </div>
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
