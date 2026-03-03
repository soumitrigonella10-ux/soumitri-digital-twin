import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";

/**
 * Serves PDF files from public/pdfs/ or public/uploads/ without frame-blocking headers.
 * This allows the PdfViewer component to embed them via <iframe>.
 *
 * GET /api/pdf/travel/kyoto-2025.pdf           →  public/pdfs/travel/kyoto-2025.pdf
 * GET /api/pdf/uploads/essays/my-essay.pdf     →  public/uploads/essays/my-essay.pdf
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Validate: only allow .pdf extension
  const fileName = segments[segments.length - 1];
  if (!fileName?.endsWith(".pdf")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent directory traversal
  const safePath = segments.join("/").replace(/\.\./g, "");

  // Determine base directory: if path starts with "uploads/", serve from public/uploads/
  // Otherwise serve from public/pdfs/ (original behaviour)
  let filePath: string;
  let allowedDir: string;

  if (safePath.startsWith("uploads/")) {
    filePath = path.join(process.cwd(), "public", safePath);
    allowedDir = path.resolve(path.join(process.cwd(), "public", "uploads"));
  } else {
    filePath = path.join(process.cwd(), "public", "pdfs", safePath);
    allowedDir = path.resolve(path.join(process.cwd(), "public", "pdfs"));
  }

  // Ensure the resolved path stays within the allowed directory
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(allowedDir)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Use stat to verify existence + get size, then stream the file
    // instead of reading the entire PDF into a memory buffer.
    const fileStat = await stat(resolvedPath);
    const nodeStream = createReadStream(resolvedPath);

    const readable = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(readable, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(fileStat.size),
        "Content-Disposition": `inline; filename="${fileName}"`,
        // Allow this response to be framed by our own origin
        "X-Frame-Options": "SAMEORIGIN",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
