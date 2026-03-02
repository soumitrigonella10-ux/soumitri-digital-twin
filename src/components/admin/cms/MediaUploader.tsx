"use client";

// ─────────────────────────────────────────────────────────────
// Media Uploader — File upload component for CMS admin
//
// Handles drag-and-drop and click-to-upload for images, PDFs, and videos.
// Uploads to /api/cms/upload with admin session cookie.
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, FileText, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  /** Current file URL (if already uploaded) */
  value?: string;
  /** Called with the uploaded file URL */
  onChange: (url: string) => void;
  /** Type of file accepted */
  accept: "image" | "pdf" | "video";
  /** Upload subdirectory (e.g. "essays") */
  uploadType?: string;
  /** Optional label */
  label?: string;
  /** Optional description text */
  description?: string | undefined;
  /** CSS class */
  className?: string;
}

const ACCEPT_MAP = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  pdf: "application/pdf",
  video: "video/mp4,video/webm",
};

const ICON_MAP = {
  image: ImageIcon,
  pdf: FileText,
  video: Video,
};

export function MediaUploader({
  value,
  onChange,
  accept,
  uploadType = "general",
  label,
  description,
  className,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const Icon = ICON_MAP[accept];

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", uploadType);

        const response = await fetch("/api/cms/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, uploadType]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {value ? (
        /* ── Preview existing file ── */
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            {accept === "image" ? (
              <Image
                src={value}
                alt="Uploaded"
                width={64}
                height={64}
                className="h-16 w-16 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                <Icon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {value.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500 truncate">{value}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* ── Upload dropzone ── */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
            isDragOver
              ? "border-gray-900 bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? "Uploading..."
              : "Drop file here or click to browse"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {accept === "image" && "JPG, PNG, WebP, AVIF — max 10MB"}
            {accept === "pdf" && "PDF — max 50MB"}
            {accept === "video" && "MP4, WebM — max 100MB"}
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        onChange={handleFileSelect}
        className="hidden"
      />

      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
