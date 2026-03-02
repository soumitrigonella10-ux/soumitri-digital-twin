// ─────────────────────────────────────────────────────────────
// CMS File Upload API — Secured admin-only upload endpoint
//
// Accepts: multipart/form-data with a single "file" field
// Supports: images (jpg, png, webp, avif), PDFs, videos (mp4, webm)
// Stores to: public/uploads/{type}/{filename}
// Returns: { url: "/uploads/..." }
//
// Security:
//   - Session validation (admin only)
//   - File type validation
//   - File size limits
//   - Sanitized filenames
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createLogger } from "@/lib/logger";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const log = createLogger("cms-upload");

// ── Allowed file types ───────────────────────────────────────
const ALLOWED_TYPES: Record<string, { extensions: string[]; maxSize: number }> = {
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  pdf: {
    extensions: [".pdf"],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  video: {
    extensions: [".mp4", ".webm"],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
};

function getFileCategory(filename: string): string | null {
  const ext = path.extname(filename).toLowerCase();
  for (const [category, config] of Object.entries(ALLOWED_TYPES)) {
    if (config.extensions.includes(ext)) return category;
  }
  return null;
}

function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext);
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
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      log.warn(`⛔ Upload attempted by non-admin: ${session.user.email}`);
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // 2. Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file type
    const category = getFileCategory(file.name);
    if (!category) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${Object.values(ALLOWED_TYPES).flatMap(t => t.extensions).join(", ")}` },
        { status: 400 }
      );
    }

    // 4. Validate file size
    const typeConfig = ALLOWED_TYPES[category];
    if (!typeConfig) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    const maxSize = typeConfig.maxSize;
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Maximum size for ${category} files: ${maxMB}MB` },
        { status: 400 }
      );
    }

    // 5. Save file
    const safeName = sanitizeFilename(file.name);
    const uploadDir = path.join(process.cwd(), "public", "uploads", uploadType || "general");

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, safeName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uploadType}/${safeName}`;

    log.info(`📁 Uploaded ${category}: ${publicUrl} (${(file.size / 1024).toFixed(1)}KB) by ${session.user.email}`);

    return NextResponse.json({
      url: publicUrl,
      filename: safeName,
      category,
      size: file.size,
    });
  } catch (error) {
    log.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
