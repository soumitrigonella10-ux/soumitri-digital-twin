// ─────────────────────────────────────────────────────────────
// CMS File Upload API — Secured admin-only upload endpoint
//
// Accepts: multipart/form-data with a single "file" field
// Supports: images (jpg, png, webp, avif), PDFs, videos (mp4, webm)
// Stores to: Vercel Blob under cms/{type}/{filename}
// Returns: { url: "https://...blob.vercel-storage.com/..." }
//
// Security:
//   - Admin session validation via requireAdmin()
//   - File type validation (MIME-based)
//   - File size limits per category
//   - Sanitized filenames
//   - Upload type allowlisted (defends against path traversal)
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-auth";
import { createLogger } from "@/lib/logger";

const log = createLogger("cms-upload");

// ── Allowed upload directories (defends against path traversal) ──
const ALLOWED_UPLOAD_TYPES = ["essays", "travel", "images", "general"] as const;
type UploadType = (typeof ALLOWED_UPLOAD_TYPES)[number];

function sanitizeUploadType(raw: string): UploadType {
  const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (ALLOWED_UPLOAD_TYPES.includes(cleaned as UploadType)) {
    return cleaned as UploadType;
  }
  return "general";
}

// ── Allowed file types (validated by MIME type) ──────────────
const ALLOWED_TYPES: Record<string, { mimes: string[]; maxSize: number }> = {
  image: {
    mimes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  pdf: {
    mimes: ["application/pdf"],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  video: {
    mimes: ["video/mp4", "video/webm"],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
};

function getFileCategory(mimeType: string): string | null {
  for (const [category, config] of Object.entries(ALLOWED_TYPES)) {
    if (config.mimes.includes(mimeType)) return category;
  }
  return null;
}

function sanitizeFilename(filename: string): string {
  // Extract extension from the original name
  const lastDot = filename.lastIndexOf(".");
  const ext = lastDot > 0 ? filename.slice(lastDot).toLowerCase() : "";
  const base = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const sanitized = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const timestamp = Date.now().toString(36);
  return `${sanitized}-${timestamp}${ext}`;
}

// ── POST handler ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check — uses shared admin chokepoint
    const admin = await requireAdmin();

    // 2. Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file");
    const uploadType = sanitizeUploadType((formData.get("type") as string) || "general");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file type (MIME-based, not extension-based)
    const category = getFileCategory(file.type);
    if (!category) {
      const allMimes = Object.values(ALLOWED_TYPES).flatMap(t => t.mimes);
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: ${allMimes.join(", ")}` },
        { status: 400 }
      );
    }

    // 4. Validate file size
    const typeConfig = ALLOWED_TYPES[category];
    if (!typeConfig) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > typeConfig.maxSize) {
      const maxMB = Math.round(typeConfig.maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Maximum size for ${category} files: ${maxMB}MB` },
        { status: 400 }
      );
    }

    // 5. Upload to Vercel Blob (stream to avoid buffering a second copy)
    const originalName = (file as File).name || "upload";
    const safeName = sanitizeFilename(originalName);
    const pathname = `cms/${uploadType}/${safeName}`;

    const blob = await put(pathname, file.stream(), {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    log.info(`📁 Uploaded ${category}: ${blob.url} (${(file.size / 1024).toFixed(1)}KB) by ${admin.email}`);

    return NextResponse.json({
      url: blob.url,
      filename: safeName,
      category,
      size: file.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";

    if (message === "Authentication required" || message === "Admin access required") {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    log.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
