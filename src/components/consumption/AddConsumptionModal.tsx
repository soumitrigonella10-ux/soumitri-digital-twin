"use client";

// ─────────────────────────────────────────────────────────────
// Add Consumption Item Modal — Admin-only
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { createContent } from "@/cms/actions";

const CONTENT_TYPES = [
  { value: "book", label: "Book" },
  { value: "movie", label: "Movie" },
  { value: "essay", label: "Essay" },
  { value: "series", label: "Series" },
  { value: "video", label: "Video" },
];

const STATUSES = [
  { value: "QUEUED", label: "Queued" },
  { value: "CURRENTLY READING", label: "Currently Reading" },
  { value: "CURRENTLY WATCHING", label: "Currently Watching" },
  { value: "LISTENING", label: "Listening" },
  { value: "COMPLETED", label: "Completed" },
];

const ASPECT_RATIOS = [
  { value: "3/4", label: "3:4 (Book)" },
  { value: "2/3", label: "2:3 (Movie poster)" },
  { value: "16/9", label: "16:9 (Widescreen)" },
  { value: "4/5", label: "4:5 (Essay)" },
  { value: "1/1", label: "1:1 (Square)" },
];

interface AddConsumptionModalProps {
  onClose: () => void;
  onPublished?: () => void;
}

export function AddConsumptionModal({ onClose, onPublished }: AddConsumptionModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("book");
  const [status, setStatus] = useState("QUEUED");
  const [metadataText, setMetadataText] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [comment, setComment] = useState("");
  const [watchUrl, setWatchUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("3/4");
  const [topPick, setTopPick] = useState(false);

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleFileUpload = useCallback(async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) { setError("Only JPEG, PNG, WebP, and GIF images are accepted"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }

    setImageFile(file);
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "consumption");
      const response = await fetch("/api/cms/upload", { method: "POST", body: formData });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Upload failed"); }
      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file); }, [handleFileUpload]);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }, [handleFileUpload]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!author.trim()) { setError("Author/Creator is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await createContent({
        type: "consumption",
        title: title.trim(),
        slug: slugify(title),
        visibility: "published",
        isFeatured: false,
        coverImage: imageUrl || null,
        metadata: {
          contentType,
          status,
          metadataText: metadataText.trim(),
          language: language.trim(),
          genre: genre.trim(),
          topPick,
        },
        payload: {
          author: author.trim(),
          description: description.trim(),
          imageUrl: imageUrl || "",
          watchUrl: watchUrl.trim(),
          comment: comment.trim(),
          aspectRatio,
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
  }, [title, author, description, contentType, status, metadataText, language, genre, topPick, imageUrl, watchUrl, comment, aspectRatio, onClose, onPublished]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Add Content</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Title + Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Past Lives" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Author / Creator</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Celine Song" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          {/* Content Type + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Content Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CONTENT_TYPES.map((ct) => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description..." rows={3} maxLength={500} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]" />
          </div>

          {/* Metadata Text + Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Metadata Text</label>
              <input type="text" value={metadataText} onChange={(e) => setMetadataText(e.target.value)} placeholder="e.g. 2024 · Sci-Fi" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Card Aspect Ratio</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {ASPECT_RATIOS.map((ar) => <option key={ar.value} value={ar.value}>{ar.label}</option>)}
              </select>
            </div>
          </div>

          {/* Language + Genre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Language</label>
              <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. English" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Genre</label>
              <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g. Drama" className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">One-liner Takeaway</label>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. Memory distorts; love remains." maxLength={300} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          {/* Watch URL */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Watch / Read URL</label>
            <input type="text" value={watchUrl} onChange={(e) => setWatchUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
          </div>

          {/* Top Pick toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setTopPick(!topPick)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${topPick ? "bg-telugu-kavi" : "bg-stone-300"}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${topPick ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">Top Pick</span>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Cover Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition-all ${isDragOver ? "border-telugu-marigold bg-telugu-marigold/5" : imageFile ? "border-green-400 bg-green-50/50" : "border-stone-300 bg-white hover:border-stone-400"}`}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
              {isUploading ? (<><Loader2 className="h-8 w-8 text-stone-400 animate-spin mb-2" /><span className="text-sm text-stone-500 font-editorial">Uploading...</span></>) : imageFile ? (<><ImageIcon className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm text-stone-700 font-editorial font-medium">{imageFile.name}</span><span className="text-xs text-stone-400 font-editorial mt-1">{(imageFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace</span></>) : (<><Upload className="h-8 w-8 text-stone-400 mb-2" /><span className="text-sm text-stone-500 font-editorial">Click to upload or drag and drop</span><span className="text-xs text-stone-400 font-editorial mt-1">JPEG, PNG, WebP, GIF · Max 10MB</span></>)}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-editorial">{error}</p>}
          {success && <div className="flex items-center gap-2 text-sm text-green-700 font-editorial"><Check className="h-4 w-4" />Content published successfully!</div>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || isUploading || !title.trim() || !author.trim()} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add Content
          </button>
        </div>
      </div>
    </div>
  );
}
