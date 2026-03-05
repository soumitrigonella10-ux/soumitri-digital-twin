// @vitest-environment node
// ========================================
// API Route Tests — /api/cms/upload
//
// Tests file upload with MIME validation, size limits,
// upload type allowlisting, and auth enforcement.
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

// ── Mocks ────────────────────────────────────────────────────

const mockRequireAdmin = vi.fn();
vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
  AUTH_ERRORS: {
    UNAUTHENTICATED: "Authentication required",
    FORBIDDEN: "Admin access required",
  },
}));

const mockPut = vi.fn().mockResolvedValue({
  url: "https://abc.public.blob.vercel-storage.com/cms/essays/test-abc123.pdf",
});
vi.mock("@vercel/blob", () => ({
  put: (...args: unknown[]) => mockPut(...args),
}));

vi.mock("@/lib/logger", () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// ── Helpers ──────────────────────────────────────────────────

function createUploadRequest(
  file: File | null,
  type?: string
): NextRequest {
  const entries = new Map<string, FormDataEntryValue>();
  if (file) entries.set("file", file);
  if (type) entries.set("type", type);
  return {
    method: "POST",
    formData: async () => ({
      get: (key: string) => entries.get(key) ?? null,
    }),
  } as unknown as NextRequest;
}

// ── Dynamic imports ──────────────────────────────────────────

let POST: (req: NextRequest) => Promise<Response>;
let GET: () => Promise<Response>;

beforeEach(async () => {
  vi.clearAllMocks();
  mockRequireAdmin.mockResolvedValue({ email: "admin@test.com", role: "admin" });
  mockPut.mockResolvedValue({
    url: "https://abc.public.blob.vercel-storage.com/cms/essays/test-abc123.pdf",
  });

  const mod = await import("../../app/api/cms/upload/route");
  POST = mod.POST;
  GET = mod.GET;
});

// ========================================
// Auth enforcement
// ========================================
describe("CMS Upload — Auth", () => {
  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const file = new File(["content"], "essay.pdf", { type: "application/pdf" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Authentication required");
  });

  it("returns 403 when not admin", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Admin access required"));
    const file = new File(["content"], "essay.pdf", { type: "application/pdf" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(403);
  });
});

// ========================================
// Method blocking
// ========================================
describe("CMS Upload — Method blocking", () => {
  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const data = await res.json();
    expect(data.error).toMatch(/Method not allowed/i);
  });
});

// ========================================
// File validation
// ========================================
describe("CMS Upload — File validation", () => {
  it("returns 400 when no file is provided", async () => {
    const req = createUploadRequest(null, "essays");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/No file/i);
  });

  it("rejects unsupported MIME types", async () => {
    const file = new File(["data"], "malware.exe", { type: "application/octet-stream" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Unsupported file type/i);
  });

  it("accepts image/jpeg", async () => {
    const file = new File(["pixels"], "photo.jpg", { type: "image/jpeg" });
    const req = createUploadRequest(file, "travel");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.url).toBeDefined();
    expect(body.data.category).toBe("image");
  });

  it("accepts application/pdf", async () => {
    const file = new File(["pdf-content"], "paper.pdf", { type: "application/pdf" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.category).toBe("pdf");
  });

  it("accepts video/mp4", async () => {
    const file = new File(["video-data"], "clip.mp4", { type: "video/mp4" });
    const req = createUploadRequest(file, "images");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.category).toBe("video");
  });

  it("rejects images over 10MB", async () => {
    const bigContent = new Uint8Array(11 * 1024 * 1024);
    const file = new File([bigContent], "huge.png", { type: "image/png" });
    const req = createUploadRequest(file, "images");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too large/i);
    expect(data.error).toMatch(/10MB/);
  });

  it("rejects PDFs over 50MB", async () => {
    const bigContent = new Uint8Array(51 * 1024 * 1024);
    const file = new File([bigContent], "massive.pdf", { type: "application/pdf" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too large/i);
    expect(data.error).toMatch(/50MB/);
  });
});

// ========================================
// Upload type allowlisting (path traversal defense)
// ========================================
describe("CMS Upload — Upload type sanitization", () => {
  it("accepts known types (essays, travel, images, general)", async () => {
    for (const type of ["essays", "travel", "images", "sidequests", "consumption", "internet-lore", "general"]) {
      mockPut.mockResolvedValueOnce({
        url: `https://blob.vercel-storage.com/cms/${type}/test.jpg`,
      });
      const file = new File(["px"], "test.jpg", { type: "image/jpeg" });
      const req = createUploadRequest(file, type);
      const res = await POST(req);
      expect(res.status).toBe(200);
    }
  });

  it("defaults unknown type to 'general'", async () => {
    const file = new File(["px"], "test.jpg", { type: "image/jpeg" });
    const req = createUploadRequest(file, "../../etc");
    const res = await POST(req);
    expect(res.status).toBe(200);
    // Check that put was called with cms/general/ prefix
    expect(mockPut).toHaveBeenCalled();
    const callArgs = mockPut.mock.calls[0];
    expect(callArgs[0]).toMatch(/^cms\/general\//);
  });

  it("strips non-alpha characters from type", async () => {
    const file = new File(["px"], "test.jpg", { type: "image/jpeg" });
    const req = createUploadRequest(file, "essays/../../../etc");
    const res = await POST(req);
    expect(res.status).toBe(200);
    // After stripping non-alpha, "essays/../../../etc" → "essaysetc" → not in allowlist → "general"
    const callArgs = mockPut.mock.calls[0];
    expect(callArgs[0]).toMatch(/^cms\/general\//);
  });
});

// ========================================
// Successful upload response shape
// ========================================
describe("CMS Upload — Response shape", () => {
  it("returns url, filename, category, and size", async () => {
    const file = new File(["data"], "test-doc.pdf", { type: "application/pdf" });
    const req = createUploadRequest(file, "essays");
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveProperty("url");
    expect(body.data).toHaveProperty("filename");
    expect(body.data).toHaveProperty("category");
    expect(body.data).toHaveProperty("size");
    expect(typeof body.data.url).toBe("string");
    expect(typeof body.data.filename).toBe("string");
    expect(body.data.category).toBe("pdf");
    expect(typeof body.data.size).toBe("number");
  });

  it("returns sanitized filename with timestamp", async () => {
    const file = new File(["px"], "My Photo (2).jpg", { type: "image/jpeg" });
    const req = createUploadRequest(file, "travel");
    const res = await POST(req);
    const body = await res.json();
    // Filename should be lowercased, with non-alnum replaced by dashes
    expect(body.data.filename).toMatch(/^my-photo-2-[a-z0-9]+\.jpg$/);
  });
});
