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

// Affirmations & Day Themes
export { affirmationsTable, dayThemes } from './affirmations'

// Notes — Admin task matrix & ideation scrapbook
export { notes } from './notes'

// CMS — Universal content management
export { contentItems } from './content'
