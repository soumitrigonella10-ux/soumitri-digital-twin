// ─────────────────────────────────────────────────────────────
// CMS Queries — Public-facing read functions
//
// These are used by page components to fetch published content.
// No auth required — only "published" items are returned.
// ─────────────────────────────────────────────────────────────
import { getContentByType, getContentBySlug } from "./actions";
import type { ContentItem } from "./types";
import type { Essay, SkillExperiment, Sidequest, ContentItem as EditorialContentItem, DesignThought } from "@/types/editorial";
import type { Artifact, InspirationFragment } from "@/data/artifacts";
import type { WishlistItem } from "@/types/wardrobe";

/**
 * Convert a CMS ContentItem of type "essay" to the Essay interface
 * used by the frontend rendering layer.
 */
export function cmsEssayToEssay(item: ContentItem): Essay {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: (payload.excerpt as string) || "",
    category: (meta.category as string) || "",
    date: (meta.date as string) || "",
    readingTime: (payload.readingTime as string) || "",
    imageUrl: item.coverImage || "",
    isFeatured: item.isFeatured,
    tags: (meta.tags as string[]) || [],
    pdfUrl: (payload.pdfUrl as string) || "",
    media: (payload.media as Essay["media"]) ?? [],
    contentMeta: (payload.contentMeta as Essay["contentMeta"]) ?? [],
  };
}

/**
 * Fetch all published essays from the CMS.
 * Returns an array of Essay objects compatible with existing rendering.
 */
export async function getPublishedEssays(): Promise<Essay[]> {
  const items = await getContentByType("essay", { visibility: "published" });
  return items.map(cmsEssayToEssay);
}

/**
 * Fetch a single published essay by slug.
 */
export async function getPublishedEssayBySlug(
  slug: string
): Promise<Essay | null> {
  const item = await getContentBySlug("essay", slug);
  if (!item || item.visibility !== "published") return null;
  return cmsEssayToEssay(item);
}

// ── Skill Quests ─────────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "skill" to the SkillExperiment interface.
 */
export function cmsItemToSkill(item: ContentItem, index: number): SkillExperiment {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  return {
    id: item.id,
    experimentNumber: index + 1,
    name: item.title,
    tools: (meta.tags as string[]) || [],
    proficiency: (payload.proficiency as number) ?? 0,
    description: (payload.description as string) || "",
    category: (meta.category as string as SkillExperiment["category"]) || "Strategy",
  };
}

/**
 * Fetch all published skill quests from the CMS.
 */
export async function getPublishedSkills(): Promise<SkillExperiment[]> {
  const items = await getContentByType("skill", { visibility: "published" });
  return items.map((item, i) => cmsItemToSkill(item, i));
}

// ── Sidequests ───────────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "sidequest" to the Sidequest interface.
 */
export function cmsItemToSidequest(item: ContentItem): Sidequest {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  return {
    id: item.id,
    entryId: `SQ-${item.slug}`,
    title: item.title,
    description: (payload.description as string) || "",
    category: (meta.category as string) || "",
    difficulty: (meta.difficulty as Sidequest["difficulty"]) || "Medium",
    xp: 0,
    completed: false,
    imageUrl: (payload.imageUrl as string) || item.coverImage || "",
    questLog: (payload.questLog as string) || "",
  };
}

/**
 * Fetch all published sidequests from the CMS.
 */
export async function getPublishedSidequests(): Promise<Sidequest[]> {
  const items = await getContentByType("sidequest", { visibility: "published" });
  return items.map(cmsItemToSidequest);
}

// ── Artifacts ────────────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "artifact" to the Artifact interface
 * used by the frontend rendering layer.
 */
export function cmsItemToArtifact(item: ContentItem): Artifact {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  const paperNoteText = (payload.paperNoteText as string) || "";
  const paperNotePosition = (payload.paperNotePosition as string) || "";

  const artifact: Artifact = {
    id: item.id,
    title: item.title,
    medium: (meta.medium as string) || "",
    date: (meta.date as string) || "",
    frameType: (meta.frameType as Artifact["frameType"]) || "standard",
    offsetType: "none",
    borderStyle: (meta.borderStyle as Artifact["borderStyle"]) || "shadow",
  };

  const dims = (payload.dimensions as string) || "";
  if (dims) artifact.dimensions = dims;

  const desc = (payload.description as string) || "";
  if (desc) artifact.description = desc;

  const bg = (payload.backgroundColor as string) || "";
  if (bg) artifact.backgroundColor = bg;

  const img = (payload.imagePath as string) || "";
  if (img) artifact.imagePath = img;

  if (payload.hasWashiTape) artifact.hasWashiTape = true;

  if (paperNoteText && paperNotePosition) {
    artifact.paperNote = {
      text: paperNoteText,
      position: paperNotePosition as "top-left" | "top-right" | "bottom-left" | "bottom-right",
    };
  }

  return artifact;
}

/**
 * Fetch all published artifacts from the CMS.
 */
export async function getPublishedArtifacts(): Promise<Artifact[]> {
  const items = await getContentByType("artifact", { visibility: "published" });
  return items.map(cmsItemToArtifact);
}

/**
 * Fetch a single published artifact by slug.
 */
export async function getPublishedArtifactBySlug(
  slug: string
): Promise<Artifact | null> {
  const item = await getContentBySlug("artifact", slug);
  if (!item || item.visibility !== "published") return null;
  return cmsItemToArtifact(item);
}

// ── Content Consumption ──────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "consumption" to the EditorialContentItem interface.
 */
export function cmsItemToConsumption(item: ContentItem): EditorialContentItem {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  const result: EditorialContentItem = {
    id: item.id,
    type: (meta.contentType as EditorialContentItem["type"]) || "book",
    title: item.title,
    author: (payload.author as string) || "",
    description: (payload.description as string) || "",
    metadata: (meta.metadataText as string) || "",
    status: (meta.status as EditorialContentItem["status"]) || "QUEUED",
    aspectRatio: (payload.aspectRatio as EditorialContentItem["aspectRatio"]) || "3/4",
  };
  const imageUrl = (payload.imageUrl as string) || (item.coverImage as string);
  if (imageUrl) result.imageUrl = imageUrl;
  const language = meta.language as string;
  if (language) result.language = language;
  const genre = meta.genre as string;
  if (genre) result.genre = genre;
  const comment = payload.comment as string;
  if (comment) result.comment = comment;
  const watchUrl = payload.watchUrl as string;
  if (watchUrl) result.watchUrl = watchUrl;
  if (meta.topPick === true) result.topPick = true;
  return result;
}

/**
 * Fetch all published consumption items from the CMS.
 */
export async function getPublishedConsumption(): Promise<EditorialContentItem[]> {
  const items = await getContentByType("consumption", { visibility: "published" });
  return items.map(cmsItemToConsumption);
}

// ── Inspiration ──────────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "inspiration" to the InspirationFragment interface.
 */
export function cmsItemToInspiration(item: ContentItem): InspirationFragment {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  const result: InspirationFragment = {
    id: item.id,
    type: (meta.inspirationType as InspirationFragment["type"]) || "quote",
    content: (payload.content as string) || "",
  };
  const source = payload.source as string;
  if (source) result.source = source;
  const subtitle = payload.subtitle as string;
  if (subtitle) result.subtitle = subtitle;
  const bg = payload.backgroundColor as string;
  if (bg) result.backgroundColor = bg;
  const accent = payload.accentColor as string;
  if (accent) result.accentColor = accent;
  return result;
}

/**
 * Fetch all published inspirations from the CMS.
 */
export async function getPublishedInspirations(): Promise<InspirationFragment[]> {
  const items = await getContentByType("inspiration", { visibility: "published" });
  return items.map(cmsItemToInspiration);
}

// ── Wishlist ─────────────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "wishlist-item" to the WishlistItem interface.
 */
export function cmsItemToWishlist(item: ContentItem): WishlistItem {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  const result: WishlistItem = {
    id: item.id,
    name: item.title,
    category: (meta.category as WishlistItem["category"]) || "Tops",
  };
  const brand = payload.brand as string;
  if (brand) result.brand = brand;
  const tags = meta.tags as string[];
  if (tags?.length) result.tags = tags;
  const imageUrl = (payload.imageUrl as string) || (item.coverImage as string);
  if (imageUrl) result.imageUrl = imageUrl;
  const websiteUrl = payload.websiteUrl as string;
  if (websiteUrl) result.websiteUrl = websiteUrl;
  const price = payload.price as number;
  if (price != null) result.price = price;
  const currency = payload.currency as string;
  if (currency) result.currency = currency;
  const priority = meta.priority as WishlistItem["priority"];
  if (priority) result.priority = priority;
  if (meta.purchased === true) result.purchased = true;
  return result;
}

/**
 * Fetch all published wishlist items from the CMS.
 */
export async function getPublishedWishlistItems(): Promise<WishlistItem[]> {
  const items = await getContentByType("wishlist-item", { visibility: "published" });
  return items.map(cmsItemToWishlist);
}

// ── Design Thoughts ──────────────────────────────────────────

/**
 * Convert a CMS ContentItem of type "design-thought" to the DesignThought interface.
 */
export function cmsItemToDesignThought(item: ContentItem): DesignThought {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;

  const result: DesignThought = {
    id: item.id,
    title: item.title,
    category: (meta.category as string) || "",
    date: (meta.date as string) || "",
    cardType: (meta.cardType as DesignThought["cardType"]) || "standard",
    annotationType: (meta.annotationType as DesignThought["annotationType"]) || "none",
  };
  const subtitle = payload.subtitle as string;
  if (subtitle) result.subtitle = subtitle;
  if (payload.hasTechnicalPattern === true) result.hasTechnicalPattern = true;
  const pdfUrl = payload.pdfUrl as string;
  if (pdfUrl) result.pdfUrl = pdfUrl;
  return result;
}

/**
 * Fetch all published design thoughts from the CMS.
 */
export async function getPublishedDesignThoughts(): Promise<DesignThought[]> {
  const items = await getContentByType("design-thought", { visibility: "published" });
  return items.map(cmsItemToDesignThought);
}

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
    ...(((payload.mediaUrl as string) || item.coverImage) ? { imageUrl: (payload.mediaUrl as string) || item.coverImage || "" } : {}),
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
  const items = await getContentByType("internet-lore", { visibility: "published" });
  return items.map((item, i) => cmsItemToLoreItem(item, i));
}
