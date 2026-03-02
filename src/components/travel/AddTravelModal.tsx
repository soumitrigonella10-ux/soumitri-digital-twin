"use client";

// ─────────────────────────────────────────────────────────────
// Add Travel Location Modal — Admin-only
//
// Creates a new travel location via CMS server actions.
// Supports cover image + PDF journal upload.
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, Image as ImageIcon, FileText, Check } from "lucide-react";
import { createContent } from "@/cms/actions";

interface AddTravelModalProps {
  onClose: () => void;
  onPublished?: () => void;
}

export function AddTravelModal({ onClose, onPublished }: AddTravelModalProps) {
  // Base fields
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [dateVisited, setDateVisited] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [climate, setClimate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [inventory, setInventory] = useState("");
  const [isHeroTile, setIsHeroTile] = useState(false);

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // PDF upload
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ── Upload Image ────────────────────────────────────────────
  const handleImageUpload = useCallback(async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF images are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setImageFile(file);
    setError(null);
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "travel");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImageFile(null);
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

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
      formData.append("type", "travel");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setPdfUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPdfFile(null);
    } finally {
      setIsUploadingPdf(false);
    }
  }, []);

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!name.trim()) { setError("Location name is required"); return; }
    if (!country.trim()) { setError("Country is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }
    if (!dateVisited.trim()) { setError("Date visited is required"); return; }
    if (!climate.trim()) { setError("Climate is required"); return; }
    if (!duration.trim()) { setError("Duration is required"); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createContent({
        type: "travel",
        title: name.trim(),
        slug: slugify(name),
        visibility: "published",
        isFeatured: isHeroTile,
        coverImage: imageUrl || null,
        metadata: {
          country: country.trim(),
          dateVisited: dateVisited.trim(),
          climate: climate.trim(),
          duration: duration.trim(),
          coordinates: coordinates.trim(),
        },
        payload: {
          description: description.trim(),
          notes: notes.trim(),
          imageUrl: imageUrl || "",
          pdfUrl: pdfUrl || "",
          inventory: inventory.trim(),
          isHeroTile,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onPublished?.();
          onClose();
        }, 1200);
      } else {
        setError(result.error || "Failed to publish travel location");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name, country, description, dateVisited, climate, duration, coordinates,
    notes, imageUrl, pdfUrl, inventory, isHeroTile, onClose, onPublished,
  ]);

  const isUploading = isUploadingImage || isUploadingPdf;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">
            Add Travel Location
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
          {/* Row: Name + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Location Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kyoto"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Japan"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Row: Date Visited + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Date Visited
              </label>
              <input
                type="text"
                value={dateVisited}
                onChange={(e) => setDateVisited(e.target.value)}
                placeholder="e.g. November 2025"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 9 days"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Row: Climate + Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Climate
              </label>
              <input
                type="text"
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                placeholder="e.g. Mild autumn, 12-18°C"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Coordinates
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="e.g. 35.0116° N, 135.7681° E"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A reflective description of the destination..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Personal observations, takeaways..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]"
            />
          </div>

          {/* Inventory / Packing List */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Packing List
              <span className="normal-case tracking-normal text-stone-400 ml-1">
                (one item per line)
              </span>
            </label>
            <textarea
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              placeholder="Leica M10 with 35mm Summicron&#10;Moleskine watercolor journal&#10;Minimalist wardrobe (neutrals only)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]"
            />
          </div>

          {/* Hero Tile toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsHeroTile(!isHeroTile)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isHeroTile ? "bg-telugu-kavi" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isHeroTile ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">
              Hero Tile (large card)
            </span>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Cover Image
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleImageDrop}
              onClick={() => imageInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                px-4 py-6 cursor-pointer transition-all
                ${isDragOver
                  ? "border-telugu-marigold bg-telugu-marigold/5"
                  : imageFile
                    ? "border-green-400 bg-green-50/50"
                    : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }}
                className="hidden"
              />

              {isUploadingImage ? (
                <>
                  <Loader2 className="h-6 w-6 text-stone-400 animate-spin mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">Uploading image...</span>
                </>
              ) : imageFile ? (
                <>
                  <ImageIcon className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-sm text-stone-700 font-editorial font-medium">{imageFile.name}</span>
                  <span className="text-xs text-stone-400 font-editorial mt-0.5">Click to replace</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-stone-400 mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">Click to upload cover image or drag and drop</span>
                  <span className="text-xs text-stone-400 font-editorial mt-1">JPEG, PNG, WebP, GIF · Max 10MB</span>
                </>
              )}
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Travel Journal PDF
            </label>
            <div
              onClick={() => pdfInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                px-4 py-6 cursor-pointer transition-all
                ${pdfFile
                  ? "border-green-400 bg-green-50/50"
                  : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePdfUpload(file); }}
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
                  <span className="text-sm text-stone-500 font-editorial">Click to upload travel journal PDF</span>
                  <span className="text-xs text-stone-400 font-editorial mt-1">PDF · Max 50MB</span>
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
              Travel location published successfully!
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
            disabled={isSubmitting || isUploading || !name.trim() || !country.trim()}
            className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add Location
          </button>
        </div>
      </div>
    </div>
  );
}
