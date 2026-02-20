// ========================================
// Tests for JsonAdapter (auth adapter using JSON file)
// ========================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fs before importing the module
vi.mock("fs", () => {
  let store: Record<string, string> = {};
  return {
    default: {
      readFileSync: vi.fn((path: string) => {
        if (store[path]) return store[path];
        throw new Error("ENOENT");
      }),
      writeFileSync: vi.fn((path: string, data: string) => {
        store[path] = data;
      }),
    },
    __resetStore: () => {
      store = {};
    },
  };
});

// Must import after mock
import { JsonAdapter } from "@/lib/json-adapter";
import fs from "fs";

function resetFsStore() {
  // Reset the in-memory store
  const mod = vi.mocked(fs);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mod as any).__resetStore?.();
  // Also clear call counts
  vi.mocked(fs.readFileSync).mockClear();
  vi.mocked(fs.writeFileSync).mockClear();
}

/** Helper to construct createUser input with proper typing */
function userInput(name: string, email: string, emailVerified: Date | null = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { name, email, emailVerified, image: null } as any;
}

describe("JsonAdapter", () => {
  let adapter: ReturnType<typeof JsonAdapter>;

  beforeEach(() => {
    resetFsStore();
    adapter = JsonAdapter();
  });

  describe("createUser", () => {
    it("creates a user with generated id", async () => {
      const user = await adapter.createUser!(userInput("Test", "test@example.com", new Date("2024-01-01")));

      expect(user.id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test");
      expect(user.emailVerified).toBeInstanceOf(Date);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("creates a user without emailVerified", async () => {
      const user = await adapter.createUser!(userInput("NoVerify", "noverify@example.com"));

      expect(user.emailVerified).toBeNull();
    });
  });

  describe("getUser", () => {
    it("returns null for non-existent user", async () => {
      const user = await adapter.getUser!("nonexistent");
      expect(user).toBeNull();
    });

    it("returns user after creation", async () => {
      const created = await adapter.createUser!(userInput("Lookup", "lookup@example.com"));
      const found = await adapter.getUser!(created.id);
      expect(found).not.toBeNull();
      expect(found!.email).toBe("lookup@example.com");
    });
  });

  describe("getUserByEmail", () => {
    it("returns null when email not found", async () => {
      const user = await adapter.getUserByEmail!("missing@test.com");
      expect(user).toBeNull();
    });

    it("finds user by email", async () => {
      await adapter.createUser!(userInput("Email", "find@email.com"));
      const found = await adapter.getUserByEmail!("find@email.com");
      expect(found).not.toBeNull();
      expect(found!.name).toBe("Email");
    });
  });

  describe("getUserByAccount", () => {
    it("returns null when no account matches", async () => {
      const user = await adapter.getUserByAccount!({
        provider: "github",
        providerAccountId: "123",
      });
      expect(user).toBeNull();
    });

    it("finds user by linked account", async () => {
      const created = await adapter.createUser!(userInput("AccountUser", "account@test.com"));
      await adapter.linkAccount!({
        userId: created.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "gh-123",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      const found = await adapter.getUserByAccount!({
        provider: "github",
        providerAccountId: "gh-123",
      });
      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });
  });

  describe("updateUser", () => {
    it("updates user fields", async () => {
      const created = await adapter.createUser!(userInput("OldName", "update@test.com"));
      const updated = await adapter.updateUser!({
        id: created.id,
        name: "NewName",
        email: "update@test.com",
        emailVerified: new Date("2024-06-01"),
        image: null,
      });
      expect(updated.name).toBe("NewName");
    });

    it("throws for non-existent user", async () => {
      await expect(
        adapter.updateUser!({
          id: "missing",
          name: "Test",
          email: "test@test.com",
          emailVerified: null,
          image: null,
        })
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteUser", () => {
    it("removes user, accounts, and sessions", async () => {
      const created = await adapter.createUser!(userInput("Delete", "delete@test.com"));
      await adapter.linkAccount!({
        userId: created.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "g-1",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      await adapter.createSession!({
        sessionToken: "sess-1",
        userId: created.id,
        expires: new Date(Date.now() + 86400000),
      });

      await adapter.deleteUser!(created.id);

      const found = await adapter.getUser!(created.id);
      expect(found).toBeNull();
    });
  });

  describe("linkAccount / unlinkAccount", () => {
    it("links and unlinks an account", async () => {
      const user = await adapter.createUser!(userInput("Link", "link@test.com"));
      const account = await adapter.linkAccount!({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "gh-456",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      expect(account!.provider).toBe("github");

      await adapter.unlinkAccount!({
        provider: "github",
        providerAccountId: "gh-456",
      });

      const found = await adapter.getUserByAccount!({
        provider: "github",
        providerAccountId: "gh-456",
      });
      expect(found).toBeNull();
    });
  });

  describe("Sessions", () => {
    it("creates session", async () => {
      const user = await adapter.createUser!(userInput("Sess", "sess@test.com"));
      const session = await adapter.createSession!({
        sessionToken: "token-123",
        userId: user.id,
        expires: new Date("2025-01-01"),
      });
      expect(session.sessionToken).toBe("token-123");
      expect(session.expires).toBeInstanceOf(Date);
    });

    it("getSessionAndUser returns session+user", async () => {
      const user = await adapter.createUser!(userInput("SessUser", "sessuser@test.com"));
      await adapter.createSession!({
        sessionToken: "tok-abc",
        userId: user.id,
        expires: new Date("2025-06-01"),
      });
      const result = await adapter.getSessionAndUser!("tok-abc");
      expect(result).not.toBeNull();
      expect(result!.session.sessionToken).toBe("tok-abc");
      expect(result!.user.email).toBe("sessuser@test.com");
    });

    it("getSessionAndUser returns null for missing token", async () => {
      const result = await adapter.getSessionAndUser!("missing-token");
      expect(result).toBeNull();
    });

    it("updates session expires", async () => {
      const user = await adapter.createUser!(userInput("UpdSess", "updsess@test.com"));
      await adapter.createSession!({
        sessionToken: "tok-upd",
        userId: user.id,
        expires: new Date("2025-01-01"),
      });
      const updated = await adapter.updateSession!({
        sessionToken: "tok-upd",
        expires: new Date("2026-01-01"),
      });
      expect(updated).not.toBeNull();
      expect(updated!.expires.getFullYear()).toBe(2026);
    });

    it("updateSession returns null for missing token", async () => {
      const result = await adapter.updateSession!({
        sessionToken: "nonexistent",
      });
      expect(result).toBeNull();
    });

    it("deletes session", async () => {
      const user = await adapter.createUser!(userInput("DelSess", "delsess@test.com"));
      await adapter.createSession!({
        sessionToken: "tok-del",
        userId: user.id,
        expires: new Date("2025-01-01"),
      });
      await adapter.deleteSession!("tok-del");
      const result = await adapter.getSessionAndUser!("tok-del");
      expect(result).toBeNull();
    });
  });

  describe("Verification Tokens", () => {
    it("creates and uses verification token", async () => {
      const token = await adapter.createVerificationToken!({
        identifier: "test@email.com",
        token: "verify-abc",
        expires: new Date("2025-12-31"),
      });
      expect(token!.identifier).toBe("test@email.com");
      expect(token!.token).toBe("verify-abc");
      expect(token!.expires).toBeInstanceOf(Date);

      const used = await adapter.useVerificationToken!({
        identifier: "test@email.com",
        token: "verify-abc",
      });
      expect(used).not.toBeNull();
      expect(used!.identifier).toBe("test@email.com");

      // Using same token again should return null
      const usedAgain = await adapter.useVerificationToken!({
        identifier: "test@email.com",
        token: "verify-abc",
      });
      expect(usedAgain).toBeNull();
    });

    it("returns null for non-existent verification token", async () => {
      const result = await adapter.useVerificationToken!({
        identifier: "missing@test.com",
        token: "no-token",
      });
      expect(result).toBeNull();
    });
  });
});
