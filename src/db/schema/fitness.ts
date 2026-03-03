// ─────────────────────────────────────────────────────────────
// Workout Plans, Sections, Exercises tables
// Maps to: src/types/fitness.ts → WorkoutPlan, WorkoutSection, Exercise
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Workout Plans ────────────────────────────────────────────
export const workoutPlans = pgTable('workout_plans', {
  id:          text('id').primaryKey(),                    // "w-pilates-waist-posture"
  name:        text('name').notNull(),
  weekday:     jsonb('weekday').$type<number[]>().notNull(), // [3] = Wednesday
  durationMin: integer('duration_min').notNull(),
  goal:        text('goal'),

  /** Audit timestamps */
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Workout Sections ─────────────────────────────────────────
export const workoutSections = pgTable('workout_sections', {
  id:            text('id').primaryKey(),                  // Generated: "{planId}-sec-{index}"
  workoutPlanId: text('workout_plan_id').notNull().references(() => workoutPlans.id, { onDelete: 'cascade' }),
  title:         text('title').notNull(),
  description:   text('description'),
  sortOrder:     integer('sort_order').notNull(),

  /** Audit timestamps */
  createdAt:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  /** Speed up cascade deletes + JOIN lookups from plans → sections */
  workoutPlanIdIdx: index('idx_workout_sections_workout_plan_id').on(table.workoutPlanId),
}))

// ── Exercises ────────────────────────────────────────────────
export const exercises = pgTable('exercises', {
  id:               text('id').primaryKey(),               // Generated: "{sectionId}-ex-{index}"
  workoutSectionId: text('workout_section_id').notNull().references(() => workoutSections.id, { onDelete: 'cascade' }),
  name:             text('name').notNull(),
  sets:             text('sets'),                          // "3"
  reps:             text('reps'),                          // "10 each side"
  notes:            text('notes'),
  benefit:          text('benefit'),
  isNew:            boolean('is_new').default(false),
  isEssential:      boolean('is_essential').default(false),
  sortOrder:        integer('sort_order').notNull(),

  /** Audit timestamps */
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  /** Speed up cascade deletes + JOIN lookups from sections → exercises */
  workoutSectionIdIdx: index('idx_exercises_workout_section_id').on(table.workoutSectionId),
}))

// ── Relations ────────────────────────────────────────────────
export const workoutPlansRelations = relations(workoutPlans, ({ many }) => ({
  sections: many(workoutSections),
}))

export const workoutSectionsRelations = relations(workoutSections, ({ one, many }) => ({
  plan: one(workoutPlans, {
    fields: [workoutSections.workoutPlanId],
    references: [workoutPlans.id],
  }),
  exercises: many(exercises),
}))

export const exercisesRelations = relations(exercises, ({ one }) => ({
  section: one(workoutSections, {
    fields: [exercises.workoutSectionId],
    references: [workoutSections.id],
  }),
}))
