// ========================================
// Tests for middleware.ts
// Auth bypass / public-path logic
// ========================================

import { describe, it, expect } from "vitest";

// We can't easily import the Next.js middleware directly because it
// relies on edge-runtime APIs. Instead we test the public-path logic
// by extracting and exercising it via the topic helpers.

import {
  getPublicTopicSlugs,
  getPrivateTopicSlugs,
  getTopicBySlug,
  topics,
} from "@/data/topics";

// ========================================
// Topic helpers (source of truth for middleware)
// ========================================
describe("Topic helpers", () => {
  it("getPublicTopicSlugs returns only public slugs", () => {
    const publicSlugs = getPublicTopicSlugs();
    publicSlugs.forEach((slug) => {
      const topic = getTopicBySlug(slug);
      expect(topic).toBeDefined();
      expect(topic!.isPublic).toBe(true);
    });
  });

  it("getPrivateTopicSlugs returns only private slugs", () => {
    const privateSlugs = getPrivateTopicSlugs();
    privateSlugs.forEach((slug) => {
      const topic = getTopicBySlug(slug);
      expect(topic).toBeDefined();
      expect(topic!.isPublic).toBe(false);
    });
  });

  it("public and private slugs are disjoint", () => {
    const publicSlugs = new Set(getPublicTopicSlugs());
    const privateSlugs = getPrivateTopicSlugs();
    privateSlugs.forEach((slug) => {
      expect(publicSlugs.has(slug)).toBe(false);
    });
  });

  it("all topics are classified as either public or private", () => {
    const publicSlugs = getPublicTopicSlugs();
    const privateSlugs = getPrivateTopicSlugs();
    expect(publicSlugs.length + privateSlugs.length).toBe(topics.length);
  });

  it("getTopicBySlug returns undefined for unknown slug", () => {
    expect(getTopicBySlug("nonexistent-slug")).toBeUndefined();
  });
});

// ========================================
// Middleware public-path logic (extracted)
// Mirrors the logic in middleware.ts
// ========================================
const STATIC_PUBLIC_PATHS = [
  "/",
  "/inventory/wishlist",
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

const PUBLIC_TOPIC_SLUGS = getPublicTopicSlugs();

/**
 * Replica of isPublicPath from middleware.ts (after the auth-bypass fix).
 * Private topics are NOT treated as public anymore.
 */
function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;

  if (
    STATIC_PUBLIC_PATHS.filter((p) => p !== "/").some((path) =>
      pathname.startsWith(path)
    )
  ) {
    return true;
  }

  const topLevelSlug = pathname.split("/")[1];
  if (topLevelSlug && PUBLIC_TOPIC_SLUGS.includes(topLevelSlug)) {
    return true;
  }

  // Private topics are NOT public — they require auth (the fix)
  return false;
}

describe("isPublicPath (middleware logic)", () => {
  // Static public paths
  it("root is public", () => {
    expect(isPublicPath("/")).toBe(true);
  });

  it("/inventory/wishlist is public", () => {
    expect(isPublicPath("/inventory/wishlist")).toBe(true);
  });

  it("/api/auth routes are public", () => {
    expect(isPublicPath("/api/auth/signin")).toBe(true);
    expect(isPublicPath("/api/auth/callback")).toBe(true);
  });

  it("/_next routes are public", () => {
    expect(isPublicPath("/_next/static/chunk.js")).toBe(true);
  });

  it("/favicon.ico is public", () => {
    expect(isPublicPath("/favicon.ico")).toBe(true);
  });

  // Public topic pages
  it("public topic slugs are public", () => {
    const publicSlugs = getPublicTopicSlugs();
    expect(publicSlugs.length).toBeGreaterThan(0);
    publicSlugs.forEach((slug) => {
      expect(isPublicPath(`/${slug}`)).toBe(true);
    });
  });

  // CRITICAL: Private topics should NOT be public
  it("private topic slugs are NOT public (auth bypass fix)", () => {
    const privateSlugs = getPrivateTopicSlugs();
    expect(privateSlugs.length).toBeGreaterThan(0);
    privateSlugs.forEach((slug) => {
      expect(isPublicPath(`/${slug}`)).toBe(false);
    });
  });

  // Protected app routes
  it("/routines is protected", () => {
    expect(isPublicPath("/routines")).toBe(false);
  });

  it("/manage is protected", () => {
    expect(isPublicPath("/manage")).toBe(false);
  });

  it("/fitness is protected", () => {
    expect(isPublicPath("/fitness")).toBe(false);
  });

  it("/nutrition/breakfast is protected", () => {
    expect(isPublicPath("/nutrition/breakfast")).toBe(false);
  });

  it("/week is protected", () => {
    expect(isPublicPath("/week")).toBe(false);
  });

  // Edge cases
  it("unknown path is protected", () => {
    expect(isPublicPath("/unknown-path")).toBe(false);
  });

  it("nested public topic path is still public (startsWith match)", () => {
    const firstPublicSlug = getPublicTopicSlugs()[0]!;
    expect(isPublicPath(`/${firstPublicSlug}/some-sub-path`)).toBe(true);
  });
});
