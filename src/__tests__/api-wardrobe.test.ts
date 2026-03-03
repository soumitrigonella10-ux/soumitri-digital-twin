// ========================================
// API Route Tests — /api/wardrobe + /api/wardrobe/upload
//
// Tests CRUD operations, auth enforcement, input validation,
// blob upload with MIME/size checks.
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

/** Creates a fully-chainable mock that is also `await`-able (thenable). */
function mockChain(resolveWith: unknown[] = []) {
  const chain: Record<string, unknown> = {};
  for (const m of ["from", "where", "orderBy", "limit", "offset"]) {
    chain[m] = vi.fn(() => chain);
  }
  chain.then = (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
    Promise.resolve(resolveWith).then(resolve, reject);
  return chain;
}

const DEFAULT_WARDROBE_ROWS = [
  { id: "top_1", name: "White Tee", category: "Top", imageUrl: "https://blob.vercel-storage.com/img.jpg" },
];

const mockDb = {
  select: vi.fn(() => mockChain(DEFAULT_WARDROBE_ROWS)),
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() =>
        Promise.resolve([{ id: "top_new", name: "New Item", category: "Top", imageUrl: "/img.jpg" }])
      ),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn(() => Promise.resolve()),
  })),
};

vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/db/schema/wardrobe", () => ({
  wardrobeItems: {
    id: "id",
    name: "name",
    category: "category",
    subcategory: "subcategory",
    occasion: "occasion",
    imageUrl: "image_url",
    subType: "sub_type",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
  desc: vi.fn((a) => ({ type: "desc", field: a })),
  sql: Object.assign(vi.fn(), {
    [Symbol.for("drizzle:tagged-template")]: true,
    raw: vi.fn((s: string) => s),
  }),
}));

const mockDel = vi.fn().mockResolvedValue(undefined);
const mockPut = vi.fn().mockResolvedValue({ url: "https://blob.vercel-storage.com/wardrobe/test.jpg" });
vi.mock("@vercel/blob", () => ({
  del: (...args: unknown[]) => mockDel(...args),
  put: (...args: unknown[]) => mockPut(...args),
}));

// ── Helpers ──────────────────────────────────────────────────

function createJsonRequest(
  method: string,
  url: string,
  body?: Record<string, unknown>
): NextRequest {
  const init: RequestInit = { method };
  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  return new Request(url, init) as unknown as NextRequest;
}

function createFormDataRequest(file: File): NextRequest {
  const entries = new Map<string, FormDataEntryValue>();
  entries.set("file", file);
  return {
    method: "POST",
    formData: async () => ({
      get: (key: string) => entries.get(key) ?? null,
    }),
  } as unknown as NextRequest;
}

// ── Dynamic imports ──────────────────────────────────────────

let crudGET: (req: NextRequest) => Promise<Response>;
let crudPOST: (req: NextRequest) => Promise<Response>;
let crudDELETE: (req: NextRequest) => Promise<Response>;
let uploadPOST: (req: NextRequest) => Promise<Response>;

beforeEach(async () => {
  vi.clearAllMocks();
  mockRequireAdmin.mockResolvedValue({ email: "admin@test.com", role: "admin" });

  const crud = await import("../../app/api/wardrobe/route");
  crudGET = crud.GET;
  crudPOST = crud.POST;
  crudDELETE = crud.DELETE;

  const upload = await import("../../app/api/wardrobe/upload/route");
  uploadPOST = upload.POST;
});

// ========================================
// Auth enforcement
// ========================================
describe("Wardrobe API — Auth", () => {
  it("GET returns 401 when unauthenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const req = createJsonRequest("GET", "http://localhost/api/wardrobe");
    const res = await crudGET(req);
    expect(res.status).toBe(401);
  });

  it("POST returns 401 when unauthenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const req = createJsonRequest("POST", "http://localhost/api/wardrobe", {
      name: "Shirt", category: "Top", imageUrl: "/img.jpg",
    });
    const res = await crudPOST(req);
    expect(res.status).toBe(401);
  });

  it("DELETE returns 403 when forbidden", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Admin access required"));
    const req = createJsonRequest("DELETE", "http://localhost/api/wardrobe?id=top_1");
    const res = await crudDELETE(req);
    expect(res.status).toBe(403);
  });

  it("Upload returns 401 when unauthenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const file = new File(["pixels"], "test.png", { type: "image/png" });
    const req = createFormDataRequest(file);
    const res = await uploadPOST(req);
    expect(res.status).toBe(401);
  });
});

// ========================================
// GET /api/wardrobe
// ========================================
describe("Wardrobe API — GET", () => {
  it("returns success with data array", async () => {    // GET handler calls select() twice: rows + count
    mockDb.select
      .mockReturnValueOnce(mockChain(DEFAULT_WARDROBE_ROWS))
      .mockReturnValueOnce(mockChain([{ total: 1 }]));    const req = createJsonRequest("GET", "http://localhost/api/wardrobe");
    const res = await crudGET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});

// ========================================
// POST /api/wardrobe
// ========================================
describe("Wardrobe API — POST", () => {
  it("creates item with valid data", async () => {
    const req = createJsonRequest("POST", "http://localhost/api/wardrobe", {
      name: "Blue Dress",
      category: "Dress",
      imageUrl: "/images/blue-dress.jpg",
    });
    const res = await crudPOST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it("returns 400 when name is missing", async () => {
    const req = createJsonRequest("POST", "http://localhost/api/wardrobe", {
      category: "Top",
      imageUrl: "/img.jpg",
    });
    const res = await crudPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details.name).toBeDefined();
  });

  it("returns 400 when category is missing", async () => {
    const req = createJsonRequest("POST", "http://localhost/api/wardrobe", {
      name: "Something",
      imageUrl: "/img.jpg",
    });
    const res = await crudPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when imageUrl is missing", async () => {
    const req = createJsonRequest("POST", "http://localhost/api/wardrobe", {
      name: "Something",
      category: "Top",
    });
    const res = await crudPOST(req);
    expect(res.status).toBe(400);
  });
});

// ========================================
// DELETE /api/wardrobe
// ========================================
describe("Wardrobe API — DELETE", () => {
  it("returns 400 when id is missing", async () => {
    const req = createJsonRequest("DELETE", "http://localhost/api/wardrobe");
    const res = await crudDELETE(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/id.*required/i);
  });

  it("returns 404 when item not found", async () => {
    mockDb.select.mockReturnValueOnce(mockChain([]));
    const req = createJsonRequest("DELETE", "http://localhost/api/wardrobe?id=gone");
    const res = await crudDELETE(req);
    expect(res.status).toBe(404);
  });

  it("deletes item and attempts blob cleanup for HTTPS URLs", async () => {
    const req = createJsonRequest("DELETE", "http://localhost/api/wardrobe?id=top_1");
    const res = await crudDELETE(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockDel).toHaveBeenCalledWith("https://blob.vercel-storage.com/img.jpg");
  });
});

// ========================================
// POST /api/wardrobe/upload
// ========================================
describe("Wardrobe Upload API", () => {
  it("uploads a valid image file", async () => {
    const file = new File(["pixels"], "test.png", { type: "image/png" });
    const req = createFormDataRequest(file);
    const res = await uploadPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.url).toContain("blob.vercel-storage.com");
  });

  it("rejects invalid MIME type", async () => {
    const file = new File(["data"], "hack.exe", { type: "application/octet-stream" });
    const req = createFormDataRequest(file);
    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Invalid file type/i);
  });

  it("rejects oversized files", async () => {
    // Create a blob > 5MB
    const bigContent = new Uint8Array(6 * 1024 * 1024);
    const file = new File([bigContent], "huge.png", { type: "image/png" });
    const req = createFormDataRequest(file);
    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too large/i);
  });

  it("rejects request with no file", async () => {
    const req = {
      method: "POST",
      formData: async () => ({
        get: () => null,
      }),
    } as unknown as NextRequest;
    const res = await uploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/No file/i);
  });
});
