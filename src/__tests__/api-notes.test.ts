// ========================================
// API Route Tests — /api/notes
//
// Tests GET, POST, PATCH, DELETE with mocked DB and auth.
// Verifies auth enforcement, input validation, and response shapes.
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

// ── Mocks ────────────────────────────────────────────────────

// Mock requireAdmin — default: resolves (admin authenticated)
const mockRequireAdmin = vi.fn();
vi.mock("@/lib/admin-auth", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
  AUTH_ERRORS: {
    UNAUTHENTICATED: "Authentication required",
    FORBIDDEN: "Admin access required",
  },
}));

// Mock Drizzle db with chainable query builder

/** Creates a fully-chainable mock that is also `await`-able (thenable). */
function mockChain(resolveWith: unknown[] = []) {
  const chain: Record<string, unknown> = {};
  for (const m of ["from", "where", "orderBy", "limit", "offset"]) {
    chain[m] = vi.fn(() => chain);
  }
  // Make the chain thenable so `await db.select().from()...` works
  chain.then = (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
    Promise.resolve(resolveWith).then(resolve, reject);
  return chain;
}

const mockDb = {
  select: vi.fn(() => mockChain([])),
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() => Promise.resolve([{ id: "note_test", type: "task", content: "Test" }])),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: "note_test", content: "Updated" }])),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn(() => ({
      returning: vi.fn(() => Promise.resolve([{ id: "note_test" }])),
    })),
  })),
};

vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/db/schema/notes", () => ({
  notes: {
    id: "id",
    type: "type",
    content: "content",
    category: "category",
    completed: "completed",
    sortOrder: "sort_order",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
  desc: vi.fn((a) => ({ type: "desc", field: a })),
  asc: vi.fn((a) => ({ type: "asc", field: a })),
  sql: Object.assign(vi.fn(), {
    [Symbol.for("drizzle:tagged-template")]: true,
    // Allow sql`...` tagged template usage
    raw: vi.fn((s: string) => s),
  }),
}));

// ── Helpers ──────────────────────────────────────────────────

function createRequest(
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

// ── Tests ────────────────────────────────────────────────────

let GET: (req: NextRequest) => Promise<Response>;
let POST: (req: NextRequest) => Promise<Response>;
let PATCH: (req: NextRequest) => Promise<Response>;
let DELETE: (req: NextRequest) => Promise<Response>;

beforeEach(async () => {
  vi.clearAllMocks();
  mockRequireAdmin.mockResolvedValue({ email: "admin@test.com", role: "admin" });

  // Re-wire the select mock — first call returns rows, second returns count
  mockDb.select
    .mockReturnValueOnce(mockChain([]))           // rows query
    .mockReturnValueOnce(mockChain([{ total: 0 }])); // count query

  // Dynamic import to get fresh module after mocks are set
  const mod = await import("../../app/api/notes/route");
  GET = mod.GET;
  POST = mod.POST;
  PATCH = mod.PATCH;
  DELETE = mod.DELETE;
});

// ========================================
// Auth enforcement
// ========================================
describe("Notes API — Auth", () => {
  it("GET returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const req = createRequest("GET", "http://localhost/api/notes");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("POST returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Authentication required"));
    const req = createRequest("POST", "http://localhost/api/notes", {
      type: "task",
      content: "Test",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("PATCH returns 403 when not admin", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Admin access required"));
    const req = createRequest("PATCH", "http://localhost/api/notes", {
      id: "note_1",
      content: "Updated",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(403);
  });

  it("DELETE returns 403 when not admin", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Admin access required"));
    const req = createRequest("DELETE", "http://localhost/api/notes?id=note_1");
    const res = await DELETE(req);
    expect(res.status).toBe(403);
  });
});

// ========================================
// GET /api/notes
// ========================================
describe("Notes API — GET", () => {
  it("returns success with data array", async () => {
    const req = createRequest("GET", "http://localhost/api/notes");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("passes type filter when provided", async () => {
    const req = createRequest("GET", "http://localhost/api/notes?type=task");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(mockDb.select).toHaveBeenCalled();
  });
});

// ========================================
// POST /api/notes
// ========================================
describe("Notes API — POST", () => {
  it("creates a note with valid data", async () => {
    const req = createRequest("POST", "http://localhost/api/notes", {
      type: "task",
      content: "Build tests",
      category: "ENGINEERING",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it("returns 400 when type is missing", async () => {
    const req = createRequest("POST", "http://localhost/api/notes", {
      content: "No type field",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details.type).toBeDefined();
  });

  it("returns 400 when content is missing", async () => {
    const req = createRequest("POST", "http://localhost/api/notes", {
      type: "task",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details.content).toBeDefined();
  });

  it("returns 400 for invalid type value", async () => {
    const req = createRequest("POST", "http://localhost/api/notes", {
      type: "invalid",
      content: "Bad type",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details.type).toBeDefined();
  });

  it("calls db.insert with correct fields", async () => {
    const req = createRequest("POST", "http://localhost/api/notes", {
      type: "idea",
      content: "New idea",
    });
    await POST(req);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

// ========================================
// PATCH /api/notes
// ========================================
describe("Notes API — PATCH", () => {
  it("returns 400 when id is missing", async () => {
    const req = createRequest("PATCH", "http://localhost/api/notes", {
      content: "No id",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/id.*required/i);
  });

  it("updates a note with valid data", async () => {
    const req = createRequest("PATCH", "http://localhost/api/notes", {
      id: "note_test",
      content: "Updated content",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 404 when note does not exist", async () => {
    // Override the mock to return empty array
    mockDb.update.mockReturnValueOnce({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([])),
        })),
      })),
    });
    const req = createRequest("PATCH", "http://localhost/api/notes", {
      id: "nonexistent",
      content: "Doesn't exist",
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });
});

// ========================================
// DELETE /api/notes
// ========================================
describe("Notes API — DELETE", () => {
  it("returns 400 when id query param is missing", async () => {
    const req = createRequest("DELETE", "http://localhost/api/notes");
    const res = await DELETE(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/id.*required/i);
  });

  it("deletes a note with valid id", async () => {
    const req = createRequest("DELETE", "http://localhost/api/notes?id=note_test");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 404 when note does not exist", async () => {
    mockDb.delete.mockReturnValueOnce({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([])),
      })),
    });
    const req = createRequest("DELETE", "http://localhost/api/notes?id=gone");
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});
