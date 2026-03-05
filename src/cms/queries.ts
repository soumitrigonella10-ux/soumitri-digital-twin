// ─────────────────────────────────────────────────────────────
// CMS Queries — Public-facing read functions
//
// These are used by page components to fetch published content.
// No auth required — only "published" items are returned.
// ─────────────────────────────────────────────────────────────
import { getContentByType } from "./actions";
import type { ContentItem } from "./types";

// ── Internet Lore ────────────────────────────────────────────

import type { LoreItem, LoreCategory, LoreMediaType } from "@/data/internetLore";

/**
 * Convert a CMS ContentItem of type "internet-lore" to the LoreItem interface.
 */
export function cmsItemToLoreItem(item: ContentItem, fallbackIndex: number): LoreItem {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  return {
    id: item.id,
    ref: fallbackIndex + 100,
    title: item.title,
    era: (meta.era as string) || "",
    category: (meta.category as LoreCategory) || "pop-internet-core",
    mediaType: (meta.mediaType as LoreMediaType) || "photo",
    tags: Array.isArray(meta.tags)
      ? (meta.tags as string[])
      : typeof meta.tags === "string"
        ? (meta.tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    ...(((payload.mediaUrl as string) || (payload.imageUrl as string) || item.coverImage) ? { imageUrl: (payload.mediaUrl as string) || (payload.imageUrl as string) || item.coverImage || "" } : {}),
    ...((payload.videoUrl as string) ? { videoUrl: payload.videoUrl as string } : {}),
    ...((payload.quoteText as string) ? { quoteText: payload.quoteText as string } : {}),
    ...((payload.note as string) ? { note: payload.note as string } : {}),
    size: "md" as const,
    _cmsId: item.id,
  };
}

/**
 * Fetch all published internet-lore items from the CMS.
 */
export async function getPublishedLoreItems(): Promise<LoreItem[]> {
  const { items } = await getContentByType("internet-lore", { visibility: "published" });
  return items.map((item, i) => cmsItemToLoreItem(item, i));
}
