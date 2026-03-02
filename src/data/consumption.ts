// ========================================
// Content Consumption Archive Data
// ========================================

import type { ContentItem, ContentType, ContentStatus } from "@/types/editorial";
export type { ContentItem, ContentType, ContentStatus };

export const CONTENT_TYPES = ["Books", "Essays", "Movies", "Series", "Videos", "Playlists"] as const;
export type ContentFilter = typeof CONTENT_TYPES[number];

export const SUB_CHIPS = ["Looking Forward", "Library"] as const;
export type ContentSubChip = typeof SUB_CHIPS[number];

// All content items are now managed via CMS
export const contentItems: ContentItem[] = [];

// Helper functions
export function getItemsByType(type: ContentFilter): ContentItem[] {
  const typeMap: Record<ContentFilter, ContentType[]> = {
    Books: ["book"],
    Essays: ["essay"],
    Movies: ["movie"],
    Series: ["series"],
    Videos: ["video"],
    Playlists: ["playlist"],
  };
  
  const targetTypes = typeMap[type];
  return contentItems.filter(item => targetTypes.includes(item.type));
}

// Sub-chip status mapping
const LIBRARY_STATUSES: ContentStatus[] = ["CURRENTLY READING", "CURRENTLY WATCHING", "LISTENING", "COMPLETED"];

const SUB_CHIP_STATUSES: Record<ContentSubChip, ContentStatus[]> = {
  "Looking Forward": ["QUEUED"],
  "Library": LIBRARY_STATUSES,
};

export function getItemsBySubChip(
  type: ContentFilter,
  subChip: ContentSubChip
): ContentItem[] {
  const items = getItemsByType(type);
  const allowedStatuses = SUB_CHIP_STATUSES[subChip];
  return items.filter(item => allowedStatuses.includes(item.status));
}

export function getItemById(id: string): ContentItem | undefined {
  return contentItems.find(item => item.id === id);
}

/** Get all unique languages across library items (for filter dropdown) */
export function getCompletedLanguages(type?: ContentFilter): string[] {
  let items = contentItems.filter(i => LIBRARY_STATUSES.includes(i.status) && i.language);
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  const langs = new Set(items.map(i => i.language!));
  return Array.from(langs).sort();
}

/** Get all unique genres across library items (for filter dropdown) */
export function getCompletedGenres(type?: ContentFilter): string[] {
  let items = contentItems.filter(i => LIBRARY_STATUSES.includes(i.status) && i.genre);
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  const genres = new Set(items.map(i => i.genre!));
  return Array.from(genres).sort();
}

/** Get all library items (non-queued), optionally filtered by content-type tab, language, and genre */
export function getCompletedItems(
  type?: ContentFilter,
  language?: string,
  genre?: string,
): ContentItem[] {
  let items = contentItems.filter(i => LIBRARY_STATUSES.includes(i.status));
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  if (language) {
    items = items.filter(i => i.language === language);
  }
  if (genre) {
    items = items.filter(i => i.genre === genre);
  }
  return items;
}
