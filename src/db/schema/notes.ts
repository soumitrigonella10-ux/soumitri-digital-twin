// ─────────────────────────────────────────────────────────────
// Notes — Admin task matrix & ideation scrapbook
//
// Two note types stored in one table:
//   - "task"  → Admin Task Matrix items (with category + completion)
//   - "idea"  → Ideation Scrapbook entries (fleeting thoughts)
// ─────────────────────────────────────────────────────────────
import { pgTable, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core'

export const notes = pgTable('notes', {
  /** Unique identifier */
  id:          text('id').primaryKey(),

  /** Discriminator — "task" | "idea" */
  type:        text('type').notNull(),

  /** The note/task content */
  content:     text('content').notNull(),

  /** Category label (CAREER, WELLNESS, PERSONAL, etc.) — tasks only */
  category:    text('category'),

  /** Whether the task is completed — tasks only */
  completed:   boolean('completed').default(false),

  /** Display ordering */
  sortOrder:   integer('sort_order').default(0),

  /** Audit timestamps */
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
