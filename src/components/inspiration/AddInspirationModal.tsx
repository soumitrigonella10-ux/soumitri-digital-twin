"use client";

import { useState, useCallback, useRef } from "react";
import { X, Loader2, Check, Upload, Link } from "lucide-react";
import { createContent } from "@/cms/actions";

const FRAGMENT_TYPES = [
  { value: "image", label: "Image" },
  { value: "music", label: "Music" },
  { value: "quote", label: "Quote" },
  { value: "video", label: "Video" },
];

interface AddInspirationModalProps {
  onClose: () => void;
  onPublished?: () => void;
}

export function AddInspirationModal({ onClose, onPublished }: AddInspirationModalProps) {
  const [title, setTitle] = useState("");
  const [inspirationType, setInspirationType] = useState("quote");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#F9F7F2");
  const [accentColor, setAccentColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "images");
      const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setImageUrl(json.data.url);
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await createContent({
        type: "inspiration",
        title: title.trim(),
        slug: slugify(title),
        visibility: "published",
        isFeatured: false,
        coverImage: null,
        metadata: { inspirationType },
        payload: {
          content: content.trim(),
          source: source.trim(),
          subtitle: subtitle.trim(),
          backgroundColor,
          accentColor: accentColor.trim(),
          imageUrl: imageUrl.trim(),
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
  }, [title, inspirationType, content, source, subtitle, backgroundColor, accentColor, imageUrl, onClose, onPublished]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Add Inspiration</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Title + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Design Quote" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Fragment Type</label>
              <select value={inspirationType} onChange={(e) => setInspirationType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {FRAGMENT_TYPES.map((ft) => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="The quote, caption, track name, or video title..." rows={3} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]" />
          </div>

          {/* Source + Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Source</label>
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Charles Eames" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Subtitle / Duration</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. 4:32" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-9 w-12 rounded border border-stone-300 cursor-pointer" />
                <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial font-mono" />
              </div>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={accentColor || "#C4B6A6"} onChange={(e) => setAccentColor(e.target.value)} className="h-9 w-12 rounded border border-stone-300 cursor-pointer" />
                <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#C4B6A6" className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial font-mono" />
              </div>
            </div>
          </div>

          {/* Image Upload / URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold">Image <span className="normal-case tracking-normal text-stone-400 ml-1">(for image fragments)</span></label>
              <div className="flex items-center gap-1 bg-stone-100 rounded-md p-0.5">
                <button type="button" onClick={() => setImageMode("upload")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-editorial font-semibold uppercase tracking-wider transition-colors ${imageMode === "upload" ? "bg-white text-telugu-kavi shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><Upload className="h-3 w-3" />Upload</button>
                <button type="button" onClick={() => setImageMode("url")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-editorial font-semibold uppercase tracking-wider transition-colors ${imageMode === "url" ? "bg-white text-telugu-kavi shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><Link className="h-3 w-3" />URL</button>
              </div>
            </div>
            {imageMode === "upload" ? (
              <div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full px-3 py-3 rounded-lg border-2 border-dashed border-stone-300 bg-white hover:border-telugu-marigold/50 hover:bg-stone-50 text-sm text-stone-500 transition-colors flex items-center justify-center gap-2 font-editorial">
                  {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : uploadedFileName ? <><Check className="h-4 w-4 text-green-600" /><span className="text-stone-700 truncate max-w-[200px]">{uploadedFileName}</span></> : <><Upload className="h-4 w-4" />Choose image (JPG, PNG, WebP, AVIF)</>}
                </button>
                {imageUrl && uploadedFileName && <p className="mt-1 text-[10px] text-stone-400 font-editorial truncate">Uploaded: {imageUrl}</p>}
              </div>
            ) : (
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://... or /images/..." className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            )}
          </div>

          {error && <p className="text-sm text-red-600 font-editorial">{error}</p>}
          {success && <div className="flex items-center gap-2 text-sm text-green-700 font-editorial"><Check className="h-4 w-4" />Inspiration added!</div>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || !title.trim() || !content.trim()} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add Inspiration
          </button>
        </div>
      </div>
    </div>
  );
}
