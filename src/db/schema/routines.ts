// ─────────────────────────────────────────────────────────────
// Routines + Steps tables
// Maps to: src/types/routines.ts → Routine, RoutineStep
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Routines ─────────────────────────────────────────────────
export const routines = pgTable('routines', {
  id:         text('id').primaryKey(),                     // "r-skin-am-daily"
  type:       text('type').notNull(),                      // "skin" | "hair" | "body" | etc.
  name:       text('name').notNull(),                      // "Skincare AM (Daily)"
  timeOfDay:  text('time_of_day').notNull(),               // "AM" | "PM" | "MIDDAY" | "ANY"
  notes:      text('notes'),

  // Schedule: { weekday?: number[], cycleDay?: number[], frequencyPerWeek?: number }
  schedule:   jsonb('schedule').$type<{
    weekday?: number[]
    cycleDay?: number[]
    frequencyPerWeek?: number
  }>().notNull(),

  // Context tags: { office?: boolean, wfh?: boolean, travel?: boolean, goingOut?: boolean }
  tags:       jsonb('tags').$type<{
    office?: boolean
    wfh?: boolean
    travel?: boolean
    goingOut?: boolean
  }>().notNull(),

  occasion:   jsonb('occasion').$type<string[]>(),         // ["casual", "formal"]
  productIds: jsonb('product_ids').$type<string[]>(),      // ["p-wash-salicylic", ...]

  /** Audit timestamps */
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Routine Steps ────────────────────────────────────────────
export const routineSteps = pgTable('routine_steps', {
  id:           text('id').primaryKey(),                   // Generated: "{routineId}-step-{order}"
  routineId:    text('routine_id').notNull().references(() => routines.id, { onDelete: 'cascade' }),
  order:        integer('step_order').notNull(),
  title:        text('title').notNull(),
  description:  text('description'),
  durationMin:  integer('duration_min'),
  productIds:   jsonb('product_ids').$type<string[]>(),
  bodyAreas:    jsonb('body_areas').$type<string[]>(),
  weekdaysOnly: jsonb('weekdays_only').$type<number[]>(),
  essential:    boolean('essential'),

  /** Audit timestamps */
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  /** Speed up cascade deletes + JOIN lookups from routines → steps */
  routineIdIdx: index('idx_routine_steps_routine_id').on(table.routineId),
}))

// ── Relations ────────────────────────────────────────────────
export const routinesRelations = relations(routines, ({ many }) => ({
  steps: many(routineSteps),
}))

export const routineStepsRelations = relations(routineSteps, ({ one }) => ({
  routine: one(routines, {
    fields: [routineSteps.routineId],
    references: [routines.id],
  }),
}))
