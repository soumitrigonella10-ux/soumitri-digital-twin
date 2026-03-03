// ─────────────────────────────────────────────────────────────
// Affirmations & Day Themes tables
// Maps to: src/data/routines/affirmations.ts types
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, index, timestamp } from 'drizzle-orm/pg-core'

// ── Day Themes (one per weekday) ─────────────────────────────
export const dayThemes = pgTable('day_themes', {
  weekday:   integer('weekday').primaryKey(),              // 0=Sun .. 6=Sat
  emoji:     text('emoji').notNull(),
  title:     text('title').notNull(),
  subtitle:  text('subtitle').notNull(),

  /** Audit timestamps */
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Affirmations ─────────────────────────────────────────────
export const affirmationsTable = pgTable('affirmations', {
  id:           text('id').primaryKey(),                   // "aff-mon-m1"
  text:         text('text').notNull(),
  type:         text('type').notNull(),                    // "affirmation" | "action" | "visualization"
  timeOfDay:    text('time_of_day').notNull(),             // "morning" | "midday" | "evening"
  weekday:      integer('weekday').notNull(),              // 0=Sun .. 6=Sat
  displayOrder: integer('display_order'),

  /** Audit timestamps */
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  weekdayIdx:   index('idx_affirmations_weekday').on(table.weekday),
  timeOfDayIdx: index('idx_affirmations_time_of_day').on(table.timeOfDay),
}))
