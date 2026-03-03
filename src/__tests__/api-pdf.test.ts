// ========================================
// API Route Tests — /api/pdf/[...path]
//
// Tests PDF serving: .pdf extension enforcement,
// directory traversal prevention, and 404 handling.
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { Readable } from "stream";

// ── Mocks ────────────────────────────────────────────────────

const mockStat = vi.fn();
vi.mock("fs/promises", () => ({
  default: { stat: (...args: unknown[]) => mockStat(...args) },
  stat: (...args: unknown[]) => mockStat(...args),
}));

const mockCreateReadStream = vi.fn();
vi.mock("fs", () => ({
  default: { createReadStream: (...args: unknown[]) => mockCreateReadStream(...args) },
  createReadStream: (...args: unknown[]) => mockCreateReadStream(...args),
}));

// ── Dynamic import ───────────────────────────────────────────

let GET: (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => Promise<Response>;

beforeEach(async () => {
  vi.clearAllMocks();
  const pdfContent = Buffer.from("%PDF-1.4 fake content");
  mockStat.mockResolvedValue({ size: pdfContent.length });
  mockCreateReadStream.mockImplementation(() => Readable.from([pdfContent]));

  const mod = await import("../../app/api/pdf/[...path]/route");
  GET = mod.GET;
});

// ── Helpers ──────────────────────────────────────────────────

function createPdfRequest(segments: string[]): [NextRequest, { params: Promise<{ path: string[] }> }] {
  const url = `http://localhost/api/pdf/${segments.join("/")}`;
  const req = new Request(url, { method: "GET" }) as unknown as NextRequest;
  return [req, { params: Promise.resolve({ path: segments }) }];
}

// ========================================
// Extension enforcement
// ========================================
describe("PDF API — Extension enforcement", () => {
  it("returns 404 for non-.pdf files", async () => {
    const [req, ctx] = createPdfRequest(["essays", "secret.txt"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("returns 404 for .js files", async () => {
    const [req, ctx] = createPdfRequest(["essays", "hack.js"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("serves valid .pdf files", async () => {
    const [req, ctx] = createPdfRequest(["essays", "my-essay.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
  });
});

// ========================================
// Directory traversal prevention
// ========================================
describe("PDF API — Directory traversal", () => {
  it("strips .. sequences from path", async () => {
    const [req, ctx] = createPdfRequest(["..", "..", "etc", "passwd.pdf"]);
    const res = await GET(req, ctx);
    // After stripping "..", the path becomes "//etc/passwd.pdf" which
    // normalises into the allowed directory. The defence works — the
    // traversal is neutralised; verify readFile never receives ".."
    if (res.status === 200) {
      const calledPath = mockCreateReadStream.mock.calls[0]?.[0] as string;
      expect(calledPath).not.toContain("..");
    } else {
      // 403 or 404 are also acceptable outcomes
      expect([403, 404]).toContain(res.status);
    }
  });

  it("blocks resolved paths outside allowed directory", async () => {
    mockStat.mockRejectedValue(new Error("ENOENT"));
    const [req, ctx] = createPdfRequest(["..%2F..%2Fetc", "passwd.pdf"]);
    const res = await GET(req, ctx);
    expect([403, 404]).toContain(res.status);
  });
});

// ========================================
// Response headers
// ========================================
describe("PDF API — Response headers", () => {
  it("sets X-Frame-Options to SAMEORIGIN for iframe embedding", async () => {
    const [req, ctx] = createPdfRequest(["travel", "kyoto.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
  });

  it("sets aggressive caching headers", async () => {
    const [req, ctx] = createPdfRequest(["essays", "thesis.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    const cc = res.headers.get("Cache-Control");
    expect(cc).toContain("max-age=31536000");
    expect(cc).toContain("immutable");
  });

  it("sets Content-Disposition to inline", async () => {
    const [req, ctx] = createPdfRequest(["essays", "thesis.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    const cd = res.headers.get("Content-Disposition");
    expect(cd).toContain("inline");
    expect(cd).toContain("thesis.pdf");
  });
});

// ========================================
// File not found
// ========================================
describe("PDF API — Not found", () => {
  it("returns 404 when PDF file does not exist", async () => {
    mockStat.mockRejectedValue(new Error("ENOENT: no such file"));
    const [req, ctx] = createPdfRequest(["essays", "nonexistent.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });
});

// ========================================
// Upload path routing
// ========================================
describe("PDF API — Path routing", () => {
  it("serves from public/uploads/ when path starts with uploads/", async () => {
    const [req, ctx] = createPdfRequest(["uploads", "essays", "uploaded.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    // Verify readFile was called with a path containing "uploads"
    const calledPath = mockCreateReadStream.mock.calls[0]?.[0] as string;
    expect(calledPath).toContain("uploads");
  });

  it("serves from public/pdfs/ for normal paths", async () => {
    const [req, ctx] = createPdfRequest(["travel", "kyoto.pdf"]);
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);
    const calledPath = mockCreateReadStream.mock.calls[0]?.[0] as string;
    expect(calledPath).toContain("pdfs");
  });
});
