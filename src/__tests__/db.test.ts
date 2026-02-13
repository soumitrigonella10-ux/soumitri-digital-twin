// ========================================
// Tests for db.ts — PostgreSQL pool + setup
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock pg module before importing
vi.mock("pg", () => {
  const mockClient = {
    query: vi.fn().mockResolvedValue({ rows: [{ exists: true }] }),
    release: vi.fn(),
  };
  const MockPool = vi.fn().mockImplementation(() => ({
    query: vi.fn(),
    connect: vi.fn().mockResolvedValue(mockClient),
    on: vi.fn(),
    end: vi.fn(),
    _mockClient: mockClient,
  }));
  return { Pool: MockPool };
});

describe("db module", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear environment
    delete process.env.POSTGRES_URL;
  });

  it("pool is null when POSTGRES_URL is not set", async () => {
    delete process.env.POSTGRES_URL;
    const mod = await import("@/lib/db");
    expect(mod.pool).toBeNull();
  });

  it("pool is created when POSTGRES_URL is set", async () => {
    process.env.POSTGRES_URL = "postgresql://user:pass@localhost:5432/testdb";
    const mod = await import("@/lib/db");
    expect(mod.pool).not.toBeNull();
  });

  it("setupAuthTables returns early when pool is null", async () => {
    delete process.env.POSTGRES_URL;
    const mod = await import("@/lib/db");
    // Should not throw
    await mod.setupAuthTables();
  });

  it("setupAuthTables connects and checks for tables when pool exists", async () => {
    process.env.POSTGRES_URL = "postgresql://user:pass@localhost:5432/testdb";
    const mod = await import("@/lib/db");
    
    if (mod.pool) {
      await mod.setupAuthTables();
      // Pool should have had connect called
      expect(mod.pool.connect).toHaveBeenCalled();
    }
  });
});
