// ─────────────────────────────────────────────────────────────
// Database Seed Script
// Reads all existing TypeScript data files and inserts them
// into the Neon Postgres tables via Drizzle.
//
// Usage:  npx tsx --env-file=.env scripts/seed.ts
// ─────────────────────────────────────────────────────────────

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/db/schema'

// ── Data imports ─────────────────────────────────────────────
import { products }  from '../src/data/products'
import { routines }  from '../src/data/routines'
import { wardrobe }  from '../src/data/wardrobe'
import { wishlist }  from '../src/data/wishlist'
import { meals, dressings, lunchBowlConfig, lunchDressings } from '../src/data/meals'
import { workouts }  from '../src/data/workouts'
import { jewelleryInventory } from '../src/data/jewellery'
import { masterSetupCategories, weeklyCategories } from '../src/data/meals/grocery'
import { SAMPLE_MAKEUP_PRODUCTS } from '../src/data/makeup'

// NOTE: Editorial data imports (essays, sidequests, travel, skills, etc.)
// removed March 2026. Those tables have been superseded by content_items.
// Static data files still exist in @/data/* as build-time fallback for pages.

// ── DB client ────────────────────────────────────────────────
if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is required')
  process.exit(1)
}

const sql = neon(process.env.POSTGRES_URL)
const db = drizzle(sql, { schema })

// ── Helpers ──────────────────────────────────────────────────
let totalInserted = 0

async function seedTable<T extends Record<string, unknown>>(
  tableName: string,
  table: Parameters<typeof db.insert>[0],
  data: T[],
) {
  if (data.length === 0) {
    console.log(`  ⏭  ${tableName}: 0 items (skipped)`)
    return
  }
  try {
    // Insert in batches of 50 to avoid hitting query size limits
    const batchSize = 50
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      await db.insert(table).values(batch as never[])
    }
    totalInserted += data.length
    console.log(`  ✅ ${tableName}: ${data.length} items`)
  } catch (error) {
    console.error(`  ❌ ${tableName}: ${(error as Error).message}`)
    throw error
  }
}

// ══════════════════════════════════════════════════════════════
// SEED ALL TABLES
// ══════════════════════════════════════════════════════════════
async function seed() {
  console.log('\n🌱 Starting database seed...\n')
  const start = Date.now()

  // ── 1. Products (beauty + makeup) ──────────────────────────
  // Combine beauty products and makeup products
  const allProducts = [...products, ...SAMPLE_MAKEUP_PRODUCTS]
  await seedTable('products', schema.products, allProducts.map(p => ({
    id:           p.id,
    name:         p.name,
    category:     p.category,
    brand:        p.brand ?? null,
    shade:        p.shade ?? null,
    actives:      p.actives ?? null,
    cautionTags:  p.cautionTags ?? null,
    routineType:  p.routineType ?? null,
    bodyAreas:    p.bodyAreas ?? null,
    hairPhase:    p.hairPhase ?? null,
    timeOfDay:    p.timeOfDay ?? null,
    weekdays:     p.weekdays ?? null,
    displayOrder: p.displayOrder ?? null,
    notes:        p.notes ?? null,
  })))

  // ── 2. Routines ────────────────────────────────────────────
  await seedTable('routines', schema.routines, routines.map(r => ({
    id:         r.id,
    type:       r.type,
    name:       r.name,
    timeOfDay:  r.timeOfDay,
    notes:      r.notes ?? null,
    schedule:   r.schedule,
    tags:       r.tags,
    occasion:   r.occasion ?? null,
    productIds: r.productIds ?? null,
  })))

  // ── 2b. Routine Steps ──────────────────────────────────────
  const allSteps = routines.flatMap(r =>
    (r.steps ?? []).map((s, i) => ({
      id:           `${r.id}-step-${s.order ?? i}`,
      routineId:    r.id,
      order:        s.order,
      title:        s.title,
      description:  s.description ?? null,
      durationMin:  s.durationMin ?? null,
      productIds:   s.productIds ?? null,
      bodyAreas:    s.bodyAreas ?? null,
      weekdaysOnly: s.weekdaysOnly ?? null,
      essential:    s.essential ?? null,
    }))
  )
  await seedTable('routine_steps', schema.routineSteps, allSteps)

  // ── 3. Wardrobe Items ──────────────────────────────────────
  await seedTable('wardrobe_items', schema.wardrobeItems, wardrobe.map(w => ({
    id:          w.id,
    name:        w.name,
    category:    w.category,
    subcategory: w.subcategory ?? null,
    occasion:    w.occasion ?? null,
    imageUrl:    w.imageUrl,
    subType:     w.subType ?? null,
  })))

  // ── 4. Wishlist Items ──────────────────────────────────────
  await seedTable('wishlist_items', schema.wishlistItems, wishlist.map(w => ({
    id:         w.id,
    name:       w.name,
    brand:      w.brand ?? null,
    category:   w.category,
    tags:       w.tags ?? null,
    imageUrl:   w.imageUrl ?? null,
    websiteUrl: w.websiteUrl ?? null,
    price:      w.price ?? null,
    currency:   w.currency ?? null,
    priority:   w.priority ?? null,
    purchased:  w.purchased ?? false,
  })))

  // ── 5. Jewellery Items ─────────────────────────────────────
  await seedTable('jewellery_items', schema.jewelleryItems, jewelleryInventory.map(j => ({
    id:          j.id,
    name:        j.name,
    category:    j.category,
    subcategory: j.subcategory ?? null,
    imageUrl:    j.imageUrl,
    favorite:    j.favorite ?? false,
  })))

  // ── 6. Meal Templates ──────────────────────────────────────
  await seedTable('meal_templates', schema.mealTemplates, meals.map(m => ({
    id:           m.id,
    name:         m.name,
    timeOfDay:    m.timeOfDay,
    mealType:     m.mealType,
    items:        m.items,
    instructions: m.instructions ?? null,
    weekdays:     m.weekdays ?? null,
    prepTimeMin:  m.prepTimeMin ?? null,
    cookTimeMin:  m.cookTimeMin ?? null,
    servings:     m.servings ?? null,
    tags:         m.tags ?? null,
  })))

  // ── 6b. Meal Ingredients ───────────────────────────────────
  const allIngredients = meals.flatMap(m =>
    (m.ingredients ?? []).map((ing, i) => ({
      id:             `${m.id}-ing-${i}`,
      mealTemplateId: m.id,
      name:           ing.name,
      quantity:       ing.quantity,
      unit:           ing.unit ?? null,
      category:       ing.category ?? null,
    }))
  )
  await seedTable('meal_ingredients', schema.mealIngredients, allIngredients)

  // ── 6c. Simple Dressings (Dressing type) ─────────────────
  await seedTable('dressings', schema.dressings, dressings.map(d => ({
    id:            d.id,
    name:          d.name,
    shelfLifeDays: d.shelfLifeDays,
    baseType:      null,
    ingredients:   d.ingredients.map(name => ({ name, quantity: '', unit: undefined })),
    instructions:  null,
    tips:          null,
    tags:          null,
  })))

  // ── 6d. Lunch Dressings (DressingRecipe type) ─────────────
  await seedTable('dressings (recipes)', schema.dressings, lunchDressings.map(d => ({
    id:            d.id,
    name:          d.name,
    shelfLifeDays: d.shelfLifeDays,
    baseType:      d.baseType ?? null,
    ingredients:   d.ingredients,
    instructions:  d.instructions ?? null,
    tips:          d.tips ?? null,
    tags:          d.tags ?? null,
  })))

  // ── 6e. Grocery Categories ─────────────────────────────────
  const groceryData = [
    ...masterSetupCategories.map((c, i) => ({
      id:       `gc-master-${i}`,
      name:     c.name,
      emoji:    c.emoji,
      listType: 'master',
      items:    c.items,
    })),
    ...weeklyCategories.map((c, i) => ({
      id:       `gc-weekly-${i}`,
      name:     c.name,
      emoji:    c.emoji,
      listType: 'weekly',
      items:    c.items,
    })),
  ]
  await seedTable('grocery_categories', schema.groceryCategories, groceryData)

  // ── 6f. Lunch Bowl Config ──────────────────────────────────
  if (lunchBowlConfig) {
    await seedTable('lunch_bowl_config', schema.lunchBowlConfig, [{
      id:       'default',
      config:   lunchBowlConfig,
      isActive: true,
    }])
  }

  // ── 7. Workout Plans ───────────────────────────────────────
  await seedTable('workout_plans', schema.workoutPlans, workouts.map(w => ({
    id:          w.id,
    name:        w.name,
    weekday:     w.weekday,
    durationMin: w.durationMin,
    goal:        w.goal ?? null,
  })))

  // ── 7b. Workout Sections ────────────────────────────────────
  const allSections = workouts.flatMap(w =>
    w.sections.map((s, i) => ({
      id:            `${w.id}-sec-${i}`,
      workoutPlanId: w.id,
      title:         s.title,
      description:   s.description ?? null,
      sortOrder:     i,
    }))
  )
  await seedTable('workout_sections', schema.workoutSections, allSections)

  // ── 7c. Exercises ──────────────────────────────────────────
  const allExercises = workouts.flatMap(w =>
    w.sections.flatMap((s, si) =>
      s.exercises.map((e, ei) => ({
        id:               `${w.id}-sec-${si}-ex-${ei}`,
        workoutSectionId: `${w.id}-sec-${si}`,
        name:             e.name,
        sets:             e.sets ?? null,
        reps:             e.reps ?? null,
        notes:            e.notes ?? null,
        benefit:          e.benefit ?? null,
        isNew:            e.isNew ?? false,
        isEssential:      e.isEssential ?? false,
        sortOrder:        ei,
      }))
    )
  )
  await seedTable('exercises', schema.exercises, allExercises)

  // ── Editorial tables REMOVED (March 2026) ─────────────────
  // Legacy per-type tables (consumption_items, travel_locations,
  // essays, sidequests, skill_experiments, design_thoughts, topics,
  // artifacts, inspirations) have been dropped.
  //
  // All editorial content is now managed through the universal
  // content_items table via the CMS admin UI.
  // Static data remains in @/data/* as build-time fallback.
  //
  // To seed CMS content, use the admin panel at /admin.

  // ── Done ───────────────────────────────────────────────────
  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n🎉 Seed complete: ${totalInserted} total rows inserted in ${elapsed}s\n`)
}

seed().catch((err) => {
  console.error('\n💥 Seed failed:', err)
  process.exit(1)
})
