// ─────────────────────────────────────────────────────────────
// CMS Server Actions — CRUD operations for content items
//
// Every action:
//   1. Validates admin session (RBAC)
//   2. Validates input with Zod (type-specific schemas)
//   3. Mutates the DB
//   4. Returns a typed result
//
// These are Next.js Server Actions — callable from client components
// but executed entirely on the server. No public API exposure.
// ─────────────────────────────────────────────────────────────
"use server";

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { contentItems } from "@/db/schema/content";
import { requireAdmin } from "@/lib/admin-auth";
import { createLogger } from "@/lib/logger";
import { revalidateCmsCache, cachedContentByType, cachedContentBySlug, cachedContentById, cachedAdminQuery } from "./cache";
import type { CmsActionResult, ContentItem, ContentVisibility } from "./types";
import { createContentSchema, updateContentSchema } from "./schemas";

const log = createLogger("cms-actions");

// Lazy-load the registry to avoid sharing this module with client bundles.
// Server actions and client components both need registry.ts, but importing
// it at the top level here creates a cross-boundary webpack chunk conflict.
async function getContentTypeConfig(type: string) {
  const { requireContentType } = await import("./registry");
  // Ensure content types are registered
  await import("./content-types");
  return requireContentType(type);
}

// ── Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return `ci_${crypto.randomUUID()}`;
}

function rowToContentItem(row: typeof contentItems.$inferSelect): ContentItem {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    visibility: row.visibility as ContentVisibility,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    coverImage: row.coverImage,
    isFeatured: row.isFeatured ?? false,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt,
  };
}

// ── CREATE ───────────────────────────────────────────────────

export async function createContent(
  input: Record<string, unknown>
): Promise<CmsActionResult> {
  try {
    // 1. Auth check
    const admin = await requireAdmin();

    // 2. Base validation
    const baseResult = createContentSchema.safeParse(input);
    if (!baseResult.success) {
      return {
        success: false,
        error: "Validation failed",
        errors: baseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { type, title, slug, visibility, metadata, payload, coverImage, isFeatured } =
      baseResult.data;

    // 3. Type-specific validation (lazy-load to avoid cross-boundary chunk)
    const typeConfig = await getContentTypeConfig(type);

    const payloadResult = typeConfig.payloadSchema.safeParse(payload);
    if (!payloadResult.success) {
      return {
        success: false,
        error: "Payload validation failed",
        errors: payloadResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const metadataResult = typeConfig.metadataSchema.safeParse(metadata);
    if (!metadataResult.success) {
      return {
        success: false,
        error: "Metadata validation failed",
        errors: metadataResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // 4. Insert
    const id = generateId();
    const now = new Date();
    const publishedAt = visibility === "published" ? now : null;

    const rows = await db
      .insert(contentItems)
      .values({
        id,
        type,
        slug,
        title,
        visibility,
        metadata: metadataResult.data,
        payload: payloadResult.data,
        coverImage: coverImage ?? null,
        isFeatured: isFeatured ?? false,
        createdAt: now,
        updatedAt: now,
        publishedAt,
      })
      .returning();

    const row = rows[0];
    if (!row) return { success: false, error: "Insert returned no rows" };

    log.info(`✅ Created ${type} "${title}" (${id}) by ${admin.email}`);

    revalidateCmsCache(type, slug);

    return { success: true, data: rowToContentItem(row) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error(`❌ createContent failed: ${message}`);

    // Don't expose internal errors to client
    if (message === "Authentication required" || message === "Admin access required") {
      return { success: false, error: message };
    }

    // Check for unique constraint violation (duplicate slug)
    if (message.includes("idx_content_items_type_slug")) {
      return { success: false, error: "A content item with this slug already exists for this type" };
    }

    return { success: false, error: "Failed to create content" };
  }
}

// ── UPDATE ───────────────────────────────────────────────────

export async function updateContent(
  input: Record<string, unknown>
): Promise<CmsActionResult> {
  try {
    const admin = await requireAdmin();

    const baseResult = updateContentSchema.safeParse(input);
    if (!baseResult.success) {
      return {
        success: false,
        error: "Validation failed",
        errors: baseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { id, ...updates } = baseResult.data;

    // Fetch current item to get its type for validation
    const [existing] = await db
      .select()
      .from(contentItems)
      .where(eq(contentItems.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Content item not found" };
    }

    // Type-specific validation if payload or metadata changed (lazy-load)
    const typeConfig = await getContentTypeConfig(existing.type);

    if (updates.payload) {
      const payloadResult = typeConfig.payloadSchema.safeParse(updates.payload);
      if (!payloadResult.success) {
        return {
          success: false,
          error: "Payload validation failed",
          errors: payloadResult.error.flatten().fieldErrors as Record<string, string[]>,
        };
      }
      updates.payload = payloadResult.data as Record<string, unknown>;
    }

    if (updates.metadata) {
      const metaResult = typeConfig.metadataSchema.safeParse(updates.metadata);
      if (!metaResult.success) {
        return {
          success: false,
          error: "Metadata validation failed",
          errors: metaResult.error.flatten().fieldErrors as Record<string, string[]>,
        };
      }
      updates.metadata = metaResult.data as Record<string, unknown>;
    }

    // Set publishedAt when transitioning to published
    const computedPublishedAt =
      updates.visibility === "published" && existing.visibility !== "published"
        ? new Date()
        : updates.visibility === "published"
          ? existing.publishedAt
          : updates.visibility
            ? null
            : undefined;

    const updateValues: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date(),
    };

    if (computedPublishedAt !== undefined) {
      updateValues.publishedAt = computedPublishedAt;
    }

    const rows = await db
      .update(contentItems)
      .set(updateValues)
      .where(eq(contentItems.id, id))
      .returning();

    const row = rows[0];
    if (!row) return { success: false, error: "Update returned no rows" };

    log.info(`✅ Updated ${existing.type} "${row.title}" (${id}) by ${admin.email}`);

    revalidateCmsCache(existing.type, row.slug, id);

    return { success: true, data: rowToContentItem(row) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error(`❌ updateContent failed: ${message}`);

    if (message === "Authentication required" || message === "Admin access required") {
      return { success: false, error: message };
    }

    if (message.includes("idx_content_items_type_slug")) {
      return { success: false, error: "A content item with this slug already exists for this type" };
    }

    return { success: false, error: "Failed to update content" };
  }
}

// ── DELETE ───────────────────────────────────────────────────

export async function deleteContent(id: string): Promise<CmsActionResult<{ id: string }>> {
  try {
    const admin = await requireAdmin();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid content ID" };
    }

    const [existing] = await db
      .select({ id: contentItems.id, type: contentItems.type, title: contentItems.title })
      .from(contentItems)
      .where(eq(contentItems.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Content item not found" };
    }

    await db.delete(contentItems).where(eq(contentItems.id, id));

    log.info(`🗑️ Deleted ${existing.type} "${existing.title}" (${id}) by ${admin.email}`);

    revalidateCmsCache(existing.type, undefined, id);

    return { success: true, data: { id } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error(`❌ deleteContent failed: ${message}`);

    if (message === "Authentication required" || message === "Admin access required") {
      return { success: false, error: message };
    }

    return { success: false, error: "Failed to delete content" };
  }
}

// ── READ (queries — no auth required for published content) ──

export async function getContentByType(
  type: string,
  options?: { visibility?: ContentVisibility; limit?: number; offset?: number }
): Promise<{ items: ContentItem[]; total: number }> {
  const limit = Math.min(options?.limit ?? 50, 200);
  const offset = Math.max(options?.offset ?? 0, 0);

  const fetch = cachedContentByType(
    async () => {
      const conditions = [eq(contentItems.type, type)];
      if (options?.visibility) {
        conditions.push(eq(contentItems.visibility, options.visibility));
      }

      const [rows, countResult] = await Promise.all([
        db
          .select()
          .from(contentItems)
          .where(and(...conditions))
          .orderBy(desc(contentItems.publishedAt), desc(contentItems.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(contentItems)
          .where(and(...conditions)),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { items: rows.map(rowToContentItem), total };
    },
    type,
    [options?.visibility ?? "all", String(limit), String(offset)]
  );

  return fetch();
}

export async function getContentBySlug(
  type: string,
  slug: string
): Promise<ContentItem | null> {
  const fetch = cachedContentBySlug(
    async () => {
      const [row] = await db
        .select()
        .from(contentItems)
        .where(and(eq(contentItems.type, type), eq(contentItems.slug, slug)))
        .limit(1);

      return row ? rowToContentItem(row) : null;
    },
    type,
    slug
  );

  return fetch();
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const fetch = cachedContentById(
    async () => {
      const [row] = await db
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, id))
        .limit(1);

      return row ? rowToContentItem(row) : null;
    },
    id
  );

  return fetch();
}

/**
 * Admin-only: list all content (all types, all visibilities).
 * Used by the CMS admin dashboard.
 */
export async function listAllContent(
  options?: { type?: string; limit?: number; offset?: number }
): Promise<{ items: ContentItem[]; total: number }> {
  await requireAdmin();

  const limit = Math.min(options?.limit ?? 50, 200);
  const offset = Math.max(options?.offset ?? 0, 0);

  const fetch = cachedAdminQuery(
    async () => {
      const conditions = options?.type ? [eq(contentItems.type, options.type)] : [];
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [rows, countResult] = await Promise.all([
        db
          .select()
          .from(contentItems)
          .where(whereClause)
          .orderBy(desc(contentItems.updatedAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(contentItems)
          .where(whereClause),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { items: rows.map(rowToContentItem), total };
    },
    ["list", options?.type ?? "all", String(limit), String(offset)]
  );

  try {
    return await fetch();
  } catch (error) {
    // Gracefully handle missing table (migration not yet run)
    const message = error instanceof Error ? error.message : "";
    if (message.includes("does not exist") || message.includes("relation")) {
      log.warn("content_items table not found — run the migration first");
      return { items: [], total: 0 };
    }
    throw error;
  }
}

/**
 * Admin-only: get content stats per type.
 */
export async function getContentStats(): Promise<
  { type: string; total: number; published: number; drafts: number }[]
> {
  await requireAdmin();

  const fetch = cachedAdminQuery(
    async () => {
      const rows = await db
        .select({
          type: contentItems.type,
          total: sql<number>`count(*)::int`,
          published: sql<number>`count(*) filter (where ${contentItems.visibility} = 'published')::int`,
          drafts: sql<number>`count(*) filter (where ${contentItems.visibility} = 'draft')::int`,
        })
        .from(contentItems)
        .groupBy(contentItems.type);

      return rows;
    },
    ["stats"]
  );

  try {
    return await fetch();
  } catch (error) {
    // Gracefully handle missing table (migration not yet run)
    const message = error instanceof Error ? error.message : "";
    if (message.includes("does not exist") || message.includes("relation")) {
      log.warn("content_items table not found — run the migration first");
      return [];
    }
    throw error;
  }
}
