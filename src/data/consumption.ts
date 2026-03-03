// ========================================
// Content Consumption — Type & constant re-exports only
// All content data is managed via CMS (content_items table)
// ========================================

import type { ContentItem, ContentType, ContentStatus } from "@/types/editorial";
export type { ContentItem, ContentType, ContentStatus };

export const CONTENT_TYPES = ["Books", "Essays", "Movies", "Series", "Videos", "Playlists"] as const;
export type ContentFilter = typeof CONTENT_TYPES[number];

export const SUB_CHIPS = ["Looking Forward", "Library"] as const;
export type ContentSubChip = typeof SUB_CHIPS[number];

