// ─────────────────────────────────────────────────────────────
// CMS Queries — Public-facing read functions
//
// These are used by page components to fetch published content.
// No auth required — only "published" items are returned.
// ─────────────────────────────────────────────────────────────
import { getContentByType, getContentBySlug } from "./actions";
import type { ContentItem } from "./types";
import type { Essay, SkillExperiment, Sidequest } from "@/types/editorial";

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
