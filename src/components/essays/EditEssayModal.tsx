"use client";

// ─────────────────────────────────────────────────────────────
// Edit Essay Modal — Admin-only inline essay editing
//
// Pre-populated with existing essay data.
// Submits changes via CMS updateContent server action.
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, FileText, Check } from "lucide-react";
import { ESSAY_CATEGORIES } from "@/types/editorial";
import { updateContent } from "@/cms/actions";

interface EditEssayModalProps {
  essay: {
    id: string;
    title: string;
    slug: string;
    category: string;
    date: string;
    readingTime: string;
    excerpt: string;
    pdfUrl?: string;
    tags?: string[];
    isFeatured?: boolean;
  };
  onClose: () => void;
  onSaved?: () => void;
}

export function EditEssayModal({ essay, onClose, onSaved }: EditEssayModalProps) {
  const [title, setTitle] = useState(essay.title);
  const [category, setCategory] = useState(essay.category);
  const [publishDate, setPublishDate] = useState(essay.date);
  const [readingTime, setReadingTime] = useState(essay.readingTime);
  const [excerpt, setExcerpt] = useState(essay.excerpt);
  const [isFeatured, setIsFeatured] = useState(essay.isFeatured ?? false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState(essay.pdfUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ESSAY_CATEGORIES.filter((c) => c !== "All");

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ── Upload replacement PDF ─────────────────────────────────
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are accepted");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File must be under 50MB");
      return;
    }

    setPdfFile(file);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "essays");

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
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!excerpt.trim()) {
      setError("Summary is required");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateContent({
        id: essay.id,
        title: title.trim(),
        slug: slugify(title),
        isFeatured,
        metadata: {
          category,
          tags: essay.tags || [],
          date:
            publishDate ||
            new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
        },
        payload: {
          excerpt: excerpt.trim(),
          pdfUrl: pdfUrl || "",
          readingTime: readingTime || "",
          media: [],
          contentMeta: [],
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSaved?.();
          onClose();
        }, 800);
      } else {
        setError(result.error || "Failed to update essay");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    title,
    category,
    publishDate,
    readingTime,
    excerpt,
    pdfUrl,
    isFeatured,
    essay.id,
    essay.tags,
    onClose,
    onSaved,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[8vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">
            Edit Essay
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
          {/* Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Essay Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. On Taste"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Reading Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Publish Date
              </label>
              <input
                type="text"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                placeholder="January 2026"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Reading Time
              </label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="e.g. 10 min read"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isFeatured ? "bg-telugu-kavi" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isFeatured ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">
              Featured Essay
            </span>
          </div>

          {/* Summary / Teaser */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Summary / Teaser
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]"
            />
          </div>

          {/* PDF Upload / Replace */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Essay PDF
              {pdfUrl && !pdfFile && (
                <span className="normal-case tracking-normal text-stone-400 ml-1">
                  (currently attached)
                </span>
              )}
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                px-4 py-6 cursor-pointer transition-all
                ${
                  isDragOver
                    ? "border-telugu-marigold bg-telugu-marigold/5"
                    : pdfFile
                      ? "border-green-400 bg-green-50/50"
                      : pdfUrl
                        ? "border-stone-300 bg-stone-50"
                        : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {isUploading ? (
                <>
                  <Loader2 className="h-6 w-6 text-stone-400 animate-spin mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">
                    Uploading...
                  </span>
                </>
              ) : pdfFile ? (
                <>
                  <FileText className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-sm text-stone-700 font-editorial font-medium">
                    {pdfFile.name}
                  </span>
                  <span className="text-xs text-stone-400 font-editorial mt-0.5">
                    Click to replace
                  </span>
                </>
              ) : pdfUrl ? (
                <>
                  <FileText className="h-6 w-6 text-stone-500 mb-1" />
                  <span className="text-sm text-stone-600 font-editorial">
                    PDF attached — click to replace
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-stone-400 mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">
                    Click to upload PDF or drag and drop
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-red-600 font-editorial">{error}</p>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 font-editorial">
              <Check className="h-4 w-4" />
              Essay updated successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || isUploading || !title.trim() || !excerpt.trim()
            }
            className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
