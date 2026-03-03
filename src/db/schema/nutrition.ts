// ─────────────────────────────────────────────────────────────
// Meal Templates, Ingredients, Dressings tables
// Maps to: src/types/nutrition.ts → MealTemplate, Ingredient, Dressing
// Also covers: grocery lists, lunch bowl configs
// ─────────────────────────────────────────────────────────────
import { pgTable, text, integer, jsonb, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Meal Templates ───────────────────────────────────────────
export const mealTemplates = pgTable('meal_templates', {
  id:           text('id').primaryKey(),                   // "m-paneer-bhurji"
  name:         text('name').notNull(),
  timeOfDay:    text('time_of_day').notNull(),             // "AM" | "PM" | "MIDDAY" | "ANY"
  mealType:     text('meal_type').notNull(),               // "breakfast" | "lunch" | "dinner"
  items:        jsonb('items').$type<string[]>().notNull(), // ["paneer", "onion", ...]
  instructions: jsonb('instructions').$type<string[]>(),   // ["Crumble paneer...", ...]
  weekdays:     jsonb('weekdays').$type<number[]>(),       // [1] = Monday
  prepTimeMin:  integer('prep_time_min'),
  cookTimeMin:  integer('cook_time_min'),
  servings:     integer('servings'),
  tags:         jsonb('tags').$type<string[]>(),           // ["vegetarian", "high-protein"]

  /** Audit timestamps */
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Meal Ingredients (child of meal_templates) ───────────────
export const mealIngredients = pgTable('meal_ingredients', {
  id:             text('id').primaryKey(),                 // Generated: "{mealId}-ing-{index}"
  mealTemplateId: text('meal_template_id').notNull().references(() => mealTemplates.id, { onDelete: 'cascade' }),
  name:           text('name').notNull(),                  // "Paneer (crumbled)"
  quantity:       text('quantity').notNull(),               // "60-65"
  unit:           text('unit'),                            // "g"
  category:       text('category'),

  /** Audit timestamps */
  createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  /** Speed up cascade deletes + JOIN lookups from meals → ingredients */
  mealTemplateIdIdx: index('idx_meal_ingredients_meal_template_id').on(table.mealTemplateId),
}))

// ── Dressings ────────────────────────────────────────────────
export const dressings = pgTable('dressings', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  shelfLifeDays: integer('shelf_life_days').notNull(),
  baseType:      text('base_type'),                        // "yogurt" | "oil" | "tahini" | etc.
  ingredients:   jsonb('ingredients').$type<{ name: string; quantity: string; unit?: string }[]>().notNull(),
  instructions:  jsonb('instructions').$type<string[]>(),
  tips:          jsonb('tips').$type<string[]>(),
  tags:          jsonb('tags').$type<string[]>(),

  /** Audit timestamps */
  createdAt:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Grocery Lists ────────────────────────────────────────────
export const groceryCategories = pgTable('grocery_categories', {
  id:        text('id').primaryKey(),                       // Generated: "gc-{name}"
  name:      text('name').notNull(),
  emoji:     text('emoji').notNull(),
  listType:  text('list_type').notNull(),                   // "master" | "weekly"
  items:     jsonb('items').$type<{ name: string; quantity?: string }[]>().notNull(),

  /** Audit timestamps */
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Lunch Bowl Config ────────────────────────────────────────
// Stored as a single JSON document since it's one config object
export const lunchBowlConfig = pgTable('lunch_bowl_config', {
  id:     text('id').primaryKey().default('default'),
  config: jsonb('config').$type<{
    base: { item: string; quantity: string }
    salads: { name: string; quantity: string }[]
    proteinOptions: { name: string; quantity: string }[]
    proteinPortions: { days: string; quantity: string }[]
    quickProteinTopups: { combo: string; note: string }[]
  }>().notNull(),
  isActive: boolean('is_active').default(true),

  /** Audit timestamps */
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Relations ────────────────────────────────────────────────
export const mealTemplatesRelations = relations(mealTemplates, ({ many }) => ({
  ingredients: many(mealIngredients),
}))

export const mealIngredientsRelations = relations(mealIngredients, ({ one }) => ({
  mealTemplate: one(mealTemplates, {
    fields: [mealIngredients.mealTemplateId],
    references: [mealTemplates.id],
  }),
}))
