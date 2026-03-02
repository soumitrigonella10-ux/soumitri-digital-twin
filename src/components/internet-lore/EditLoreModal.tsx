"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, Check, Image as ImageIcon, Video, Quote, Film } from "lucide-react";
import { updateContent } from "@/cms/actions";
import type { LoreItem, LoreCategory, LoreMediaType } from "@/data/internetLore";

interface EditLoreModalProps {
  item: LoreItem;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: { value: LoreCategory; label: string }[] = [
  { value: "pop-internet-core", label: "Pop Internet Core" },
  { value: "lobotomy-core", label: "Lobotomy Core" },
  { value: "hood-classics", label: "Hood Classics" },
];

const MEDIA_TYPE_OPTIONS: { value: LoreMediaType; label: string; icon: typeof ImageIcon }[] = [
  { value: "photo", label: "Photo", icon: ImageIcon },
  { value: "video", label: "Video URL", icon: Video },
  { value: "reel", label: "Reel Preview", icon: Film },
  { value: "quote", label: "Quote", icon: Quote },
];

export function EditLoreModal({ item, onClose, onSuccess }: EditLoreModalProps) {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState<LoreCategory>(item.category);
  const [mediaType, setMediaType] = useState<LoreMediaType>(item.mediaType);
  const [era, setEra] = useState(item.era || "");
  const [tagsInput, setTagsInput] = useState((item.tags || []).join(", "));
  const [note, setNote] = useState(item.note || "");
  const [quoteText, setQuoteText] = useState(item.quoteText || "");
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState(item.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleFileUpload = useCallback(async (file: File) => {
    const validExts = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) { setError("Only image files are accepted"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10MB"); return; }

    setImageFile(file);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "internet-lore");
      const response = await fetch("/api/cms/upload", { method: "POST", body: formData });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Upload failed"); }
      const data = await response.json();
      setMediaUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file); },
    [handleFileUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); },
    [handleFileUpload]
  );

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError("Title is required"); return; }

    setError(null);
    setIsSubmitting(true);
    const tags = tagsInput.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean);

    try {
      const result = await updateContent({
        id: item.id,
        title: title.trim(),
        slug: slugify(title),
        coverImage: mediaUrl || null,
        metadata: { category, mediaType, era: era.trim(), tags },
        payload: {
          description: "",
          mediaUrl: mediaUrl || "",
          videoUrl: videoUrl.trim(),
          quoteText: quoteText.trim(),
          note: note.trim(),
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 800);
      } else {
        setError(result.error || "Failed to update entry");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [title, category, mediaType, era, tagsInput, note, quoteText, videoUrl, mediaUrl, item.id, onClose, onSuccess]);

  const showImageUpload = mediaType === "photo" || mediaType === "reel";
  const showVideoUrl = mediaType === "video" || mediaType === "reel";
  const showQuoteText = mediaType === "quote";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[8vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Lore</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
          </div>

          {/* Category + Media Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Tab</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as LoreCategory)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]">
                {CATEGORY_OPTIONS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Type</label>
              <div className="grid grid-cols-4 gap-1">
                {MEDIA_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button key={opt.value} type="button" onClick={() => setMediaType(opt.value)}
                      className={`flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-lg border text-[9px] font-medium uppercase tracking-wider transition-all ${
                        mediaType === opt.value ? "border-[#802626] bg-[#802626]/5 text-[#802626]" : "border-gray-200 text-gray-400 hover:border-gray-300"
                      }`}>
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Era + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Era</label>
              <input type="text" value={era} onChange={(e) => setEra(e.target.value)} placeholder="e.g. 2015" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Tags</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="MEME, REACTION" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
            </div>
          </div>

          {/* Image Upload */}
          {showImageUpload && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{mediaType === "reel" ? "Reel Preview Image" : "Photo"}</label>
              <div onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${isDragOver ? "border-[#802626] bg-[#802626]/5" : "border-gray-300 hover:border-gray-400"}`}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2"><Loader2 className="h-7 w-7 animate-spin text-[#802626]" /><p className="text-sm text-gray-500">Uploading...</p></div>
                ) : mediaUrl ? (
                  <div className="flex flex-col items-center gap-2"><ImageIcon className="h-7 w-7 text-green-600" /><p className="text-sm text-green-700 font-medium">Image ready</p><p className="text-xs text-gray-400 truncate max-w-full">{imageFile?.name || "Current image"}</p></div>
                ) : (
                  <div className="flex flex-col items-center gap-2"><Upload className="h-7 w-7 text-gray-400" /><p className="text-sm text-gray-500">Drop an image or click to browse</p></div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          )}

          {showVideoUrl && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{mediaType === "reel" ? "Reel URL" : "Video URL"}</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
            </div>
          )}

          {showQuoteText && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Quote</label>
              <textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} rows={3} placeholder="The iconic quote..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626] resize-none" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Handwritten Note <span className="text-gray-400 normal-case">(optional)</span></label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A scribble on hover..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg"><Check className="h-4 w-4" /> Updated!</div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting || success} className="px-5 py-2 text-sm rounded-lg bg-[#802626] text-white hover:bg-[#6b1f1f] disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
