// ─────────────────────────────────────────────────────────────
// CMS Cache Layer — Next.js Data Cache with tag-based revalidation
//
// Wraps CMS read queries with unstable_cache so repeated
// requests (SSR, RSC, parallel component trees) hit the
// Next.js data cache instead of PostgreSQL on every call.
//
// Cache tags:
//   "cms"                — global; bust everything
//   "cms:{type}"         — per content type (e.g. "cms:essay")
//   "cms:{type}:{slug}"  — single item by slug
//   "cms:id:{id}"        — single item by id
//   "cms:admin"          — admin dashboard queries
//
// Mutations call revalidateCmsCache() which purges relevant tags.
// ─────────────────────────────────────────────────────────────

import { unstable_cache, revalidateTag } from "next/cache";

/** Default TTL for public content reads (5 minutes). */
const PUBLIC_TTL = 300;

/** Shorter TTL for admin dashboard queries (60 seconds). */
const ADMIN_TTL = 60;

// ── Cached wrapper factories ─────────────────────────────────

/**
 * Cache a content-by-type query.
 * Tagged with both "cms" (global) and "cms:{type}" so mutations
 * can invalidate just the affected type.
 */
export function cachedContentByType<T>(
  fetcher: () => Promise<T>,
  type: string,
  keyParts: string[]
) {
  return unstable_cache(fetcher, [`cms-by-type`, type, ...keyParts], {
    tags: ["cms", `cms:${type}`],
    revalidate: PUBLIC_TTL,
  });
}

/**
 * Cache a single-item-by-slug lookup.
 */
export function cachedContentBySlug<T>(
  fetcher: () => Promise<T>,
  type: string,
  slug: string
) {
  return unstable_cache(fetcher, [`cms-by-slug`, type, slug], {
    tags: ["cms", `cms:${type}`, `cms:${type}:${slug}`],
    revalidate: PUBLIC_TTL,
  });
}

/**
 * Cache a single-item-by-id lookup.
 */
export function cachedContentById<T>(
  fetcher: () => Promise<T>,
  id: string
) {
  return unstable_cache(fetcher, [`cms-by-id`, id], {
    tags: ["cms", `cms:id:${id}`],
    revalidate: PUBLIC_TTL,
  });
}

/**
 * Cache admin dashboard queries (listAll, stats).
 */
export function cachedAdminQuery<T>(
  fetcher: () => Promise<T>,
  keyParts: string[]
) {
  return unstable_cache(fetcher, [`cms-admin`, ...keyParts], {
    tags: ["cms", "cms:admin"],
    revalidate: ADMIN_TTL,
  });
}

// ── Revalidation ─────────────────────────────────────────────

/**
 * Bust the cache after a mutation.
 *
 * @param type  — content type that was mutated (e.g. "essay")
 * @param slug  — optional slug for targeted invalidation
 * @param id    — optional id for targeted invalidation
 */
export function revalidateCmsCache(
  type?: string,
  slug?: string,
  id?: string
) {
  // Always bust the global + admin tags
  revalidateTag("cms");
  revalidateTag("cms:admin");

  if (type) revalidateTag(`cms:${type}`);
  if (type && slug) revalidateTag(`cms:${type}:${slug}`);
  if (id) revalidateTag(`cms:id:${id}`);
}
