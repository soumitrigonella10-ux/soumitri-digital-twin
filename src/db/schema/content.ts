// ─────────────────────────────────────────────────────────────
// Content Items — Universal CMS table
//
// A single polymorphic table for all managed content types.
// Each content type stores its specific data in the `payload` JSONB column,
// validated at the application layer via Zod schemas.
//
// Adding a new content type requires:
//   1. Register the type in src/cms/registry.ts
//   2. Define a Zod schema in src/cms/schemas.ts
//   3. Add a renderer component
//   NO database migration needed.
// ─────────────────────────────────────────────────────────────
import { pgTable, text, timestamp, jsonb, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const contentItems = pgTable('content_items', {
  /** UUID primary key */
  id:         text('id').primaryKey(),

  /** Content type discriminator — e.g. "essay", "sidequest", "travel" */
  type:       text('type').notNull(),

  /** URL-friendly slug — unique per type */
  slug:       text('slug').notNull(),

  /** Human-readable title */
  title:      text('title').notNull(),

  /** Visibility: "draft" | "published" | "archived" */
  visibility: text('visibility').notNull().default('draft'),

  /** Structured metadata (category, tags, reading time, etc.) */
  metadata:   jsonb('metadata').$type<Record<string, unknown>>().default({}),

  /** Type-specific payload — validated by Zod schema at app layer */
  payload:    jsonb('payload').$type<Record<string, unknown>>().default({}),

  /** Optional featured image URL */
  coverImage: text('cover_image'),

  /** Marks whether the item should be featured/highlighted */
  isFeatured: boolean('is_featured').default(false),

  /** Audit timestamps */
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
}, (table) => ({
  /** Fast lookups by type */
  typeIdx: index('idx_content_items_type').on(table.type),
  /** Unique slug per content type */
  typeSlugIdx: uniqueIndex('idx_content_items_type_slug').on(table.type, table.slug),
  /** Filter by visibility */
  visibilityIdx: index('idx_content_items_visibility').on(table.visibility),
  /** Ordering by publish date */
  publishedAtIdx: index('idx_content_items_published_at').on(table.publishedAt),
}))
