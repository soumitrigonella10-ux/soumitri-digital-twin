"use client";

// ─────────────────────────────────────────────────────────────
// Edit Artifact Modal — Admin-only inline artifact editing
//
// Pre-populated with existing artifact data.
// Submits changes via CMS updateContent server action.
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import { X, Upload, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { updateContent } from "@/cms/actions";

const FRAME_TYPES = [
  { value: "hero", label: "Hero (large)" },
  { value: "standard", label: "Standard" },
  { value: "mini", label: "Mini (compact)" },
  { value: "tiny", label: "Tiny (smallest)" },
  { value: "wide", label: "Wide (text card)" },
];

const BORDER_STYLES = [
  { value: "polaroid", label: "Polaroid" },
  { value: "thin", label: "Thin" },
  { value: "shadow", label: "Shadow" },
  { value: "none", label: "None" },
];

const NOTE_POSITIONS = [
  { value: "", label: "No note" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

interface EditArtifactModalProps {
  artifact: {
    id: string;
    title: string;
    medium: string;
    date: string;
    dimensions?: string;
    frameType: string;
    borderStyle: string;
    backgroundColor?: string;
    description?: string;
    imagePath?: string;
    hasWashiTape?: boolean;
    paperNote?: {
      text: string;
      position: string;
    };
    isFeatured?: boolean;
  };
  onClose: () => void;
  onSaved?: () => void;
}

export function EditArtifactModal({ artifact, onClose, onSaved }: EditArtifactModalProps) {
  // Base fields
  const [title, setTitle] = useState(artifact.title);
  const [medium, setMedium] = useState(artifact.medium);
  const [date, setDate] = useState(artifact.date);
  const [dimensions, setDimensions] = useState(artifact.dimensions || "");
  const [description, setDescription] = useState(artifact.description || "");
  const [isFeatured, setIsFeatured] = useState(artifact.isFeatured ?? false);

  // Display fields
  const [frameType, setFrameType] = useState(artifact.frameType);
  const [borderStyle, setBorderStyle] = useState(artifact.borderStyle);
  const [backgroundColor, setBackgroundColor] = useState(artifact.backgroundColor || "#F9F7F2");
  const [hasWashiTape, setHasWashiTape] = useState(artifact.hasWashiTape ?? false);

  // Paper note
  const [paperNoteText, setPaperNoteText] = useState(artifact.paperNote?.text || "");
  const [paperNotePosition, setPaperNotePosition] = useState(artifact.paperNote?.position || "");

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState(artifact.imagePath || "");
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ── Upload replacement image ───────────────────────────────
  const handleFileUpload = useCallback(async (file: File) => {
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
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "artifacts");

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setImagePath(data.url);
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
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!medium.trim()) {
      setError("Medium is required");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateContent({
        id: artifact.id,
        title: title.trim(),
        slug: slugify(title),
        isFeatured,
        coverImage: imagePath || null,
        metadata: {
          medium: medium.trim(),
          date: date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          frameType,
          borderStyle,
        },
        payload: {
          dimensions: dimensions.trim(),
          description: description.trim(),
          backgroundColor,
          imagePath: imagePath || "",
          hasWashiTape,
          paperNoteText: paperNoteText.trim(),
          paperNotePosition,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSaved?.();
          onClose();
        }, 800);
      } else {
        setError(result.error || "Failed to update artifact");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    title, medium, date, dimensions, description, frameType, borderStyle,
    backgroundColor, imagePath, hasWashiTape, paperNoteText, paperNotePosition,
    isFeatured, artifact.id, onClose, onSaved,
  ]);

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
            Edit Artifact
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
          {/* Row: Title + Medium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urban Geometry Study"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Medium
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Digital Photography"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Row: Date + Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="January 2026"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder='e.g. 3840 × 2160 or 12" × 12"'
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
          </div>

          {/* Row: Frame Type + Border Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Frame Size
              </label>
              <select
                value={frameType}
                onChange={(e) => setFrameType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer"
              >
                {FRAME_TYPES.map((ft) => (
                  <option key={ft.value} value={ft.value}>
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Border Style
              </label>
              <select
                value={borderStyle}
                onChange={(e) => setBorderStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer"
              >
                {BORDER_STYLES.map((bs) => (
                  <option key={bs.value} value={bs.value}>
                    {bs.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-9 w-12 rounded border border-stone-300 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#F9F7F2"
                className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Description
              <span className="normal-case tracking-normal text-stone-400 ml-1">
                (shown on wide/text cards)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A reflective description of the piece..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial resize-y min-h-[80px]"
            />
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
              Featured Artifact
            </span>
          </div>

          {/* Washi Tape toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasWashiTape(!hasWashiTape)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                hasWashiTape ? "bg-telugu-kavi" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  hasWashiTape ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">
              Washi Tape Decoration
            </span>
          </div>

          {/* Paper Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Paper Note Text
              </label>
              <input
                type="text"
                value={paperNoteText}
                onChange={(e) => setPaperNoteText(e.target.value)}
                placeholder="e.g. Captured at Golden Hour"
                maxLength={100}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial"
              />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
                Note Position
              </label>
              <select
                value={paperNotePosition}
                onChange={(e) => setPaperNotePosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer"
              >
                {NOTE_POSITIONS.map((np) => (
                  <option key={np.value} value={np.value}>
                    {np.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload / Replace */}
          <div>
            <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">
              Artifact Image
              {imagePath && !imageFile && (
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
                    : imageFile
                      ? "border-green-400 bg-green-50/50"
                      : imagePath
                        ? "border-stone-300 bg-stone-50"
                        : "border-stone-300 bg-white hover:border-stone-400"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
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
              ) : imageFile ? (
                <>
                  <ImageIcon className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-sm text-stone-700 font-editorial font-medium">
                    {imageFile.name}
                  </span>
                  <span className="text-xs text-stone-400 font-editorial mt-0.5">
                    Click to replace
                  </span>
                </>
              ) : imagePath ? (
                <>
                  <ImageIcon className="h-6 w-6 text-stone-500 mb-1" />
                  <span className="text-sm text-stone-600 font-editorial">
                    Image attached — click to replace
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-stone-400 mb-1" />
                  <span className="text-sm text-stone-500 font-editorial">
                    Click to upload image or drag and drop
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
              Artifact updated successfully!
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
              isSubmitting || isUploading || !title.trim() || !medium.trim()
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
