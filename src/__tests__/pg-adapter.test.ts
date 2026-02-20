/* eslint-disable @typescript-eslint/no-explicit-any */
// ========================================
// Tests for CustomPgAdapter (PostgreSQL auth adapter)
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import CustomPgAdapter from "@/lib/pg-adapter";
import type { Pool } from "pg";

function createMockPool(): Pool {
  return {
    query: vi.fn(),
  } as unknown as Pool;
}

describe("CustomPgAdapter", () => {
  let pool: Pool;
  let adapter: ReturnType<typeof CustomPgAdapter>;

  beforeEach(() => {
    pool = createMockPool();
    adapter = CustomPgAdapter(pool);
  });

  describe("createUser", () => {
    it("inserts user and returns mapped result", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-1", name: "Test", email: "test@example.com", emailVerified: null, image: null }],
      } as any);

      const user = await adapter.createUser!({
        name: "Test",
        email: "test@example.com",
        emailVerified: null,
        image: null,
      } as any);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(user.id).toBe("u-1");
      expect(user.email).toBe("test@example.com");
      expect(user.emailVerified).toBeNull();
    });

    it("maps emailVerified to Date", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-2", name: "V", email: "v@test.com", emailVerified: "2024-01-01T00:00:00Z", image: null }],
      } as any);

      const user = await adapter.createUser!({
        name: "V",
        email: "v@test.com",
        emailVerified: new Date("2024-01-01"),
        image: null,
      } as any);

      expect(user.emailVerified).toBeInstanceOf(Date);
    });
  });

  describe("getUser", () => {
    it("returns null when no rows", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const user = await adapter.getUser!("missing");
      expect(user).toBeNull();
    });

    it("returns mapped user", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-1", name: "Found", email: "found@test.com", emailVerified: null, image: null }],
      } as any);
      const user = await adapter.getUser!("u-1");
      expect(user).not.toBeNull();
      expect(user!.name).toBe("Found");
    });
  });

  describe("getUserByEmail", () => {
    it("returns null when not found", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const result = await adapter.getUserByEmail!("missing@test.com");
      expect(result).toBeNull();
    });

    it("returns user by email", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-3", name: "Email", email: "e@test.com", emailVerified: null, image: null }],
      } as any);
      const result = await adapter.getUserByEmail!("e@test.com");
      expect(result!.email).toBe("e@test.com");
    });
  });

  describe("getUserByAccount", () => {
    it("returns null when no match", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const result = await adapter.getUserByAccount!({ provider: "gh", providerAccountId: "1" });
      expect(result).toBeNull();
    });

    it("returns user by account", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-4", name: "AccUser", email: "acc@test.com", emailVerified: null, image: null }],
      } as any);
      const result = await adapter.getUserByAccount!({ provider: "github", providerAccountId: "gh-1" });
      expect(result!.id).toBe("u-4");
    });
  });

  describe("updateUser", () => {
    it("updates fields and returns mapped user", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ id: "u-1", name: "Updated", email: "upd@test.com", emailVerified: null, image: null }],
      } as any);

      const result = await adapter.updateUser!({
        id: "u-1",
        name: "Updated",
        email: "upd@test.com",
        emailVerified: null,
        image: null,
      });
      expect(result.name).toBe("Updated");
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteUser", () => {
    it("calls DELETE query", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      await adapter.deleteUser!("u-1");
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM users"), ["u-1"]);
    });
  });

  describe("linkAccount", () => {
    it("inserts account and returns it", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const account = await adapter.linkAccount!({
        userId: "u-1",
        type: "oauth",
        provider: "google",
        providerAccountId: "g-1",
      } as any);
      expect(account!.provider).toBe("google");
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("unlinkAccount", () => {
    it("calls DELETE query", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      await adapter.unlinkAccount!({ provider: "google", providerAccountId: "g-1" });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM accounts"),
        ["google", "g-1"]
      );
    });
  });

  describe("Sessions", () => {
    it("createSession returns mapped session", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ sessionToken: "tok-1", userId: "u-1", expires: "2025-01-01T00:00:00Z" }],
      } as any);
      const session = await adapter.createSession!({
        sessionToken: "tok-1",
        userId: "u-1",
        expires: new Date("2025-01-01"),
      });
      expect(session.sessionToken).toBe("tok-1");
      expect(session.expires).toBeInstanceOf(Date);
    });

    it("getSessionAndUser returns null when no rows", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const result = await adapter.getSessionAndUser!("missing");
      expect(result).toBeNull();
    });

    it("getSessionAndUser returns session and user", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{
          sid: "s-1",
          sessionToken: "tok-2",
          userId: "u-1",
          expires: "2025-06-01T00:00:00Z",
          id: "u-1",
          name: "User",
          email: "user@test.com",
          emailVerified: null,
          image: null,
        }],
      } as any);
      const result = await adapter.getSessionAndUser!("tok-2");
      expect(result).not.toBeNull();
      expect(result!.session.sessionToken).toBe("tok-2");
      expect(result!.user.email).toBe("user@test.com");
    });

    it("updateSession returns mapped session", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ sessionToken: "tok-1", userId: "u-1", expires: "2026-01-01T00:00:00Z" }],
      } as any);
      const result = await adapter.updateSession!({
        sessionToken: "tok-1",
        expires: new Date("2026-01-01"),
      });
      expect(result).not.toBeNull();
      expect(result!.expires.getFullYear()).toBe(2026);
    });

    it("updateSession returns null for no rows", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const result = await adapter.updateSession!({ sessionToken: "missing" });
      expect(result).toBeNull();
    });

    it("deleteSession calls DELETE", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      await adapter.deleteSession!("tok-1");
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM sessions"),
        ["tok-1"]
      );
    });
  });

  describe("Verification Tokens", () => {
    it("creates verification token", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ identifier: "test@t.com", token: "v-1", expires: "2025-12-31T00:00:00Z" }],
      } as any);
      const vt = await adapter.createVerificationToken!({
        identifier: "test@t.com",
        token: "v-1",
        expires: new Date("2025-12-31"),
      });
      expect(vt!.identifier).toBe("test@t.com");
      expect(vt!.expires).toBeInstanceOf(Date);
    });

    it("useVerificationToken returns token and deletes", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [{ identifier: "test@t.com", token: "v-1", expires: "2025-12-31T00:00:00Z" }],
      } as any);
      const result = await adapter.useVerificationToken!({
        identifier: "test@t.com",
        token: "v-1",
      });
      expect(result).not.toBeNull();
      expect(result!.token).toBe("v-1");
    });

    it("useVerificationToken returns null when not found", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
      const result = await adapter.useVerificationToken!({
        identifier: "missing@t.com",
        token: "no",
      });
      expect(result).toBeNull();
    });
  });
});
