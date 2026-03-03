// ─────────────────────────────────────────────────────────────
// Schema barrel export — all tables and relations
// Used by: drizzle.config.ts (migrations) and src/db/index.ts (client)
// ─────────────────────────────────────────────────────────────

// Products (beauty, skincare, hair, makeup)
export { products } from './products'

// Routines & Steps
export { routines, routineSteps, routinesRelations, routineStepsRelations } from './routines'

// Wardrobe, Wishlist, Jewellery
export { wardrobeItems, wishlistItems, jewelleryItems } from './wardrobe'

// Nutrition (meals, dressings, grocery, lunch bowl)
export {
  mealTemplates, mealIngredients, dressings,
  groceryCategories, lunchBowlConfig,
  mealTemplatesRelations, mealIngredientsRelations,
} from './nutrition'

// Fitness (workouts, sections, exercises)
export {
  workoutPlans, workoutSections, exercises,
  workoutPlansRelations, workoutSectionsRelations, exercisesRelations,
} from './fitness'

// Editorial — REMOVED (March 2026)
// Legacy per-type tables (essays, sidequests, etc.) have been superseded
// by the universal content_items table. See _legacy/ for archived schemas.
// All editorial content is now managed exclusively through content_items.

// Artifacts & Inspirations — REMOVED (March 2026)
// Superseded by content_items with type="artifact" and type="inspiration".
// See _legacy/ for archived schemas.

// Affirmations & Day Themes
export { affirmationsTable, dayThemes } from './affirmations'

// Notes — Admin task matrix & ideation scrapbook
export { notes } from './notes'

// CMS — Universal content management
export { contentItems } from './content'
