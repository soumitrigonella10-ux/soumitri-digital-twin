// ─────────────────────────────────────────────────────────────
// @deprecated — ARCHIVED  (March 2026)
//
// Legacy per-type editorial tables. These have been superseded
// by the universal `content_items` table (src/db/schema/content.ts)
// which stores all editorial content as polymorphic JSONB rows.
//
// These tables were:
//   - Seeded by scripts/seed.ts from static @/data/* files
//   - Never queried at runtime (all reads go through @/cms/actions → content_items)
//   - Dropped in migration 0004_drop-legacy-editorial.sql
//
// Kept here for historical reference only. Do NOT import.
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, boolean, jsonb } from 'drizzle-orm/pg-core'

// ── Shared JSONB shapes (media, content metadata) ────────────
// These match ContentData from content-renderer/types.ts so adapters
// can pass them straight through instead of rebuilding manually.
export type DbMediaItem = {
  src: string
  type?: 'image' | 'video'
  alt: string
  aspectRatio?: string
}
export type DbMetaEntry = { label: string; value: string }

// ── Essays ───────────────────────────────────────────────────
export const essays = pgTable('essays', {
  id:          text('id').primaryKey(),
  slug:        text('slug').notNull().unique(),
  title:       text('title').notNull(),
  excerpt:     text('excerpt'),                            // Short description
  category:    text('category').notNull(),                 // "Philosophy" | "Personal" | etc.
  tags:        jsonb('tags').$type<string[]>(),
  date:        text('date').notNull(),                     // "January 2026"
  readingTime: text('reading_time'),                       // "8 min read"
  pdfUrl:      text('pdf_url'),
  imageUrl:    text('image_url'),
  isFeatured:  boolean('is_featured').default(false),
  // ── Flexible JSONB columns ──
  media:       jsonb('media').$type<DbMediaItem[]>(),      // Multi-media gallery
  contentMeta: jsonb('content_meta').$type<DbMetaEntry[]>(), // Structured metadata for ContentRenderer
})

// ── Consumption (books, movies, series, videos, playlists) ──
export const consumptionItems = pgTable('consumption_items', {
  id:          text('id').primaryKey(),                    // "b-1", "m-3"
  type:        text('type').notNull(),                     // "book" | "movie" | "series" | "video" | "playlist"
  title:       text('title').notNull(),
  author:      text('author'),                             // or director
  description: text('description'),
  metadata:    text('metadata'),                           // "2008 · Systems Theory"
  status:      text('status').notNull(),                   // "CURRENTLY READING" | "COMPLETED" | etc.
  imageUrl:    text('image_url'),
  aspectRatio: text('aspect_ratio'),                       // "3/4", "2/3"
  language:    text('language'),
  genre:       text('genre'),
  comment:     text('comment'),
  watchUrl:    text('watch_url'),
})

// ── Sidequests ───────────────────────────────────────────────
export const sidequests = pgTable('sidequests', {
  id:          text('id').primaryKey(),
  entryId:     text('entry_id').notNull(),                  // "SQ-001"
  title:       text('title').notNull(),
  description: text('description').notNull(),
  category:    text('category').notNull(),
  difficulty:  text('difficulty').notNull(),                // "Easy" | "Medium" | "Hard" | "Expert"
  xp:          integer('xp').notNull(),
  completed:   boolean('completed').default(false),
  imageUrl:    text('image_url'),
  questLog:    text('quest_log'),                           // Long prose text
  // ── Flexible JSONB columns ──
  media:       jsonb('media').$type<DbMediaItem[]>(),
  contentMeta: jsonb('content_meta').$type<DbMetaEntry[]>(),
})

// ── Skill Experiments ────────────────────────────────────────
export const skillExperiments = pgTable('skill_experiments', {
  id:               text('id').primaryKey(),
  experimentNumber: integer('experiment_number').notNull(),
  name:             text('name').notNull(),
  description:      text('description').notNull(),
  category:         text('category').notNull(),            // "Technical" | "Design" | "Strategy" | etc.
  proficiency:      integer('proficiency').notNull(),       // 0–100
  tools:            jsonb('tools').$type<string[]>(),
  isInverted:       boolean('is_inverted').default(false),
  // ── Flexible JSONB columns ──
  media:            jsonb('media').$type<DbMediaItem[]>(),
  contentMeta:      jsonb('content_meta').$type<DbMetaEntry[]>(),
})

// ── Travel Locations ─────────────────────────────────────────
export const travelLocations = pgTable('travel_locations', {
  id:          text('id').primaryKey(),                    // "kyoto-2025"
  name:        text('name').notNull(),
  country:     text('country').notNull(),
  coordinates: text('coordinates'),
  dateVisited: text('date_visited'),
  description: text('description'),
  imageUrl:    text('image_url'),
  isHeroTile:  boolean('is_hero_tile').default(false),
  climate:     text('climate'),
  duration:    text('duration'),
  inventory:   jsonb('inventory').$type<string[]>(),       // ["Leica M10 with 35mm", ...]
  notes:       text('notes'),
  pdfUrl:      text('pdf_url'),
  // ── Flexible JSONB columns ──
  media:       jsonb('media').$type<DbMediaItem[]>(),
  contentMeta: jsonb('content_meta').$type<DbMetaEntry[]>(),
})

// ── Design Thoughts ──────────────────────────────────────────
export const designThoughts = pgTable('design_thoughts', {
  id:                  text('id').primaryKey(),
  title:               text('title').notNull(),
  subtitle:            text('subtitle'),
  category:            text('category').notNull(),
  date:                text('date').notNull(),
  cardType:            text('card_type').notNull(),        // "standard" | "blueprint" | "inverted" | "technical"
  annotationType:      text('annotation_type').notNull(),   // "measurement" | "redline" | "stamp" | "none"
  hasTechnicalPattern: boolean('has_technical_pattern').default(false),
  pdfUrl:              text('pdf_url'),
  // ── Flexible JSONB columns ──
  media:               jsonb('media').$type<DbMediaItem[]>(),
  contentMeta:         jsonb('content_meta').$type<DbMetaEntry[]>(),
})

// ── Topics (navigation/routing configuration) ────────────────
export const topics = pgTable('topics', {
  id:           text('id').primaryKey(),
  slug:         text('slug').notNull().unique(),
  title:        text('title').notNull(),
  description:  text('description'),
  icon:         text('icon'),                              // Lucide icon name
  iconColor:    text('icon_color'),                        // Tailwind text color class
  iconBg:       text('icon_bg'),                           // Tailwind bg color class
  isPublic:     boolean('is_public').notNull().default(true),
  displayOrder: integer('display_order').notNull(),
  subTabs:      jsonb('sub_tabs').$type<{
    id: string
    label: string
    displayOrder: number
  }[]>(),
})
