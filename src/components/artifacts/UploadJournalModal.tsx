"use client";

import { useState, useRef, useCallback } from "react";
import { X, Loader2, FileText, Check } from "lucide-react";
import { createContent } from "@/cms/actions";

interface UploadJournalModalProps {
  onClose: () => void;
  onPublished?: () => void;
}

export function UploadJournalModal({ onClose, onPublished }: UploadJournalModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // PDF upload
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Cover image upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ── Upload PDF ──────────────────────────────────────────────
  const handlePdfUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("PDF must be under 50MB");
      return;
    }

    setPdfFile(file);
    setError(null);
    setIsUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "journals");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { data } = await response.json();
      setPdfUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPdfFile(null);
    } finally {
      setIsUploadingPdf(false);
    }
  }, []);

  // ── Upload Cover Image ──────────────────────────────────────
  const handleCoverUpload = useCallback(async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are accepted for covers");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image must be under 10MB");
      return;
    }

    setCoverFile(file);
    setError(null);
    setIsUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "journals");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { data } = await response.json();
      setCoverUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover upload failed");
      setCoverFile(null);
    } finally {
      setIsUploadingCover(false);
    }
  }, []);

  const handlePdfDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handlePdfUpload(file);
    },
    [handlePdfUpload]
  );

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!pdfUrl) {
      setError("Please upload a PDF journal");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createContent({
        type: "journal",
        title: title.trim(),
        slug: slugify(title),
        visibility: "published",
        isFeatured: false,
        coverImage: coverUrl || null,
        metadata: {
          date: date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        },
        payload: {
          description: description.trim(),
          pdfUrl,
          coverUrl: coverUrl || "",
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onPublished?.();
          onClose();
        }, 1200);
      } else {
        setError(result.error || "Failed to publish journal");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [title, date, description, pdfUrl, coverUrl, onClose, onPublished]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">
            Add Journal
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Watercolor Experiments — March 2026"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="March 2026"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Description
              <span className="normal-case tracking-normal text-stone-400 ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes about this journal..."
              rows={2}
              maxLength={300}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[60px]"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Journal PDF
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handlePdfDrop}
              onClick={() => pdfInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                px-4 py-6 cursor-pointer transition-all
                ${isDragOver
                  ? "border-telugu-marigold bg-telugu-marigold/5"
                  : pdfFile
                    ? "border-green-400 bg-green-50/50"
                    : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
                className="hidden"
              />

              {isUploadingPdf ? (
                <>
                  <Loader2 className="h-6 w-6 text-stone-400 animate-spin mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">Uploading PDF...</span>
                </>
              ) : pdfFile ? (
                <>
                  <FileText className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-sm text-stone-700 font-editorial font-medium">{pdfFile.name}</span>
                  <span className="text-xs text-stone-400 font-editorial mt-0.5">Click to replace</span>
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 text-stone-400 mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">
                    Drop a PDF here, or <span className="text-telugu-marigold font-medium">browse</span>
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">Max 50MB</span>
                </>
              )}
            </div>
          </div>

          {/* Cover Image (optional) */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Cover Image
              <span className="normal-case tracking-normal text-stone-400 ml-1">(optional)</span>
            </label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                px-4 py-4 cursor-pointer transition-all
                ${coverFile
                  ? "border-green-400 bg-green-50/50"
                  : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
                className="hidden"
              />

              {isUploadingCover ? (
                <>
                  <Loader2 className="h-5 w-5 text-stone-400 animate-spin mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">Uploading...</span>
                </>
              ) : coverFile ? (
                <span className="text-sm text-stone-700 font-editorial font-medium">{coverFile.name}</span>
              ) : (
                <span className="text-sm text-stone-500 font-editorial">
                  <span className="text-telugu-marigold font-medium">Choose cover image</span>
                </span>
              )}
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-red-600 font-editorial">{error}</p>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-700 font-editorial text-sm">
              <Check className="h-4 w-4" /> Journal published!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploadingPdf || isUploadingCover || success}
            className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] disabled:bg-stone-300 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
