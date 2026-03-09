// ─────────────────────────────────────────────────────────────
// Jewellery Image Upload API
//
// POST /api/jewellery/upload → upload an image to Vercel Blob
//
// Accepts multipart/form-data with a single "file" field.
// Returns { success: true, url: string } on success.
// Requires admin authentication.
// ─────────────────────────────────────────────────────────────
import { type NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-auth";
import { withErrorHandling } from "@/lib/api-utils";
import { removeBackground } from "@/lib/remove-bg";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: 5 MB` },
      { status: 400 }
    );
  }

  // Sanitize filename
  const originalName = (file as File).name || "image.png";
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  // Remove background via remove.bg
  const arrayBuffer = await file.arrayBuffer();
  const processedImage = await removeBackground(arrayBuffer, sanitized);

  // Upload as PNG (remove.bg always returns PNG)
  const pngName = sanitized.replace(/\.[^.]+$/, ".png");
  const pathname = `jewellery/${Date.now()}-${pngName}`;

  const blob = await put(pathname, processedImage, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/png",
  });

  return NextResponse.json({ success: true, url: blob.url });
}, "Upload failed");
