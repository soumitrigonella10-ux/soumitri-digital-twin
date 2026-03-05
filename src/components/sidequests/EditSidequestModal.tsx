"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, Check, Image as ImageIcon } from "lucide-react";
import { updateContent } from "@/cms/actions";
import type { Sidequest } from "@/types/editorial";

interface EditSidequestModalProps {
  sidequest: Sidequest;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS = [
  "Style", "Wellness", "Mindfulness", "Beauty",
  "Nutrition", "Connection", "Fitness", "Space",
];

export function EditSidequestModal({ sidequest, onClose, onSuccess }: EditSidequestModalProps) {
  const [title, setTitle] = useState(sidequest.title);
  const [category, setCategory] = useState(sidequest.category);
  const [description, setDescription] = useState(sidequest.description);
  const [questLog, setQuestLog] = useState(sidequest.questLog);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(sidequest.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  // ── Upload image ────────────────────────────────────────────
  const handleFileUpload = useCallback(async (file: File) => {
    const validExts = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      setError("Only image files (jpg, png, webp, avif) are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return;
    }

    setImageFile(file);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "sidequests");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { data } = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // ── Submit update ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError("Name is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }
    if (!questLog.trim()) { setError("Write-up is required"); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateContent({
        id: sidequest.id,
        title: title.trim(),
        slug: slugify(title),
        coverImage: imageUrl || null,
        metadata: {
          category,
          difficulty: sidequest.difficulty,
        },
        payload: {
          description: description.trim(),
          questLog: questLog.trim(),
          imageUrl: imageUrl || "",
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 800);
      } else {
        setError(result.error || "Failed to update sidequest");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [title, category, description, questLog, imageUrl, sidequest.id, sidequest.difficulty, onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[8vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Sidequest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Name of Sidequest</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Master the Art of Minimalist Styling" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Image / Video</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragOver ? "border-[#802626] bg-[#802626]/5" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#802626]" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">Image uploaded</p>
                  <p className="text-xs text-gray-400 truncate max-w-full">{imageFile?.name || imageUrl}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Drop an image here or click to browse</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP — max 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626]">
              {CATEGORY_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Small Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="A brief description shown on cards..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626] resize-none" />
          </div>

          {/* Quest Log */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Write-up</label>
            <textarea value={questLog} onChange={(e) => setQuestLog(e.target.value)} rows={5} placeholder="The full write-up for this sidequest..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#802626]/40 focus:border-[#802626] resize-none" />
          </div>

          {/* Error / Success */}
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              <Check className="h-4 w-4" /> Sidequest updated successfully!
            </div>
          )}
        </div>

        {/* Footer */}
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
