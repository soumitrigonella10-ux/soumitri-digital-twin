// ─────────────────────────────────────────────────────────────
// @deprecated — ARCHIVED  (March 2026)
//
// Legacy artifacts & inspirations tables. Superseded by the
// universal `content_items` table (src/db/schema/content.ts).
//
// Dropped in migration 0004_drop-legacy-editorial.sql.
// Kept here for historical reference only. Do NOT import.
// ─────────────────────────────────────────────────────────────
import { pgTable, text, boolean, integer, jsonb } from 'drizzle-orm/pg-core'

// ── Artifacts (studio gallery) ───────────────────────────────
export const artifacts = pgTable('artifacts', {
  id:              text('id').primaryKey(),                 // "artifact-01"
  title:           text('title').notNull(),
  medium:          text('medium').notNull(),                // "Digital Photography"
  date:            text('date').notNull(),                  // "January 2026"
  dimensions:      text('dimensions'),                     // "3840 × 2160"
  frameType:       text('frame_type').notNull(),            // "hero" | "standard" | "mini" | "tiny" | "wide"
  offsetType:      text('offset_type').notNull(),           // "offset-up" | "offset-down" | "pull-left" | "pull-right" | "none"
  borderStyle:     text('border_style').notNull(),          // "polaroid" | "thin" | "shadow" | "none"
  hasWashiTape:    boolean('has_washi_tape').default(false),
  rotation:        text('rotation'),
  paperNote:       jsonb('paper_note').$type<{
    text: string
    position: string
  }>(),
  imagePath:       text('image_path'),
  backgroundColor: text('background_color'),               // "#2D2424"
  description:     text('description'),
})

// ── Inspirations (scrapboard) ────────────────────────────────
export const inspirations = pgTable('inspirations', {
  id:              text('id').primaryKey(),                 // "insp-04"
  type:            text('type').notNull(),                  // "music" | "quote" | "image" | "film" | etc.
  content:         text('content').notNull(),               // The quote text, song name, etc.
  source:          text('source'),                         // "Claude Debussy", "Charles Eames"
  subtitle:        text('subtitle'),                       // "4:32" (duration), etc.
  backgroundColor: text('background_color'),
  accentColor:     text('accent_color'),
  imageUrl:        text('image_url'),
  sortOrder:       integer('sort_order'),
})
