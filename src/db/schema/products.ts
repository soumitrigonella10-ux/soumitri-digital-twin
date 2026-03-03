// ─────────────────────────────────────────────────────────────
// Products table — beauty, skincare, hair, body, wellness, makeup
// Maps to: src/types/routines.ts → Product interface
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id:           text('id').primaryKey(),                   // e.g. "p-wash-salicylic"
  name:         text('name').notNull(),                    // "Acmed Cleanser"
  category:     text('category').notNull(),                // "Cleanser", "Primer", etc.
  brand:        text('brand'),
  shade:        text('shade'),
  actives:      jsonb('actives').$type<string[]>(),        // ["Vitamin E", "Salicylic Acid"]
  cautionTags:  jsonb('caution_tags').$type<string[]>(),   // ["photosensitive"]
  routineType:  text('routine_type'),                      // "skin" | "hair" | "body" | etc.
  bodyAreas:    jsonb('body_areas').$type<string[]>(),     // ["UA", "IT", "BL"]
  hairPhase:    text('hair_phase'),                        // "oiling" | "washing" | "postWash" | "daily"
  timeOfDay:    text('time_of_day'),                       // "AM" | "PM" | "MIDDAY" | "ANY"
  weekdays:     jsonb('weekdays').$type<number[]>(),       // [0,1,2,3,4,5,6]
  displayOrder: integer('display_order'),
  notes:        text('notes'),

  /** Audit timestamps */
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
