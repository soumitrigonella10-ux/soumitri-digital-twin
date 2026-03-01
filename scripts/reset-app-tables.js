// Quick script to drop all application tables (not auth) and recreate them
// Usage: node --env-file=.env scripts/reset-app-tables.js
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
})

async function main() {
  const appTables = [
    'exercises', 'workout_sections', 'workout_plans',
    'meal_ingredients', 'meal_templates', 'dressings',
    'grocery_categories', 'lunch_bowl_config',
    'routine_steps', 'routines',
    'products',
    'wardrobe_items', 'wishlist_items', 'jewellery_items',
    'consumption_items',
    'essays', 'sidequests', 'skill_experiments',
    'travel_locations', 'design_thoughts', 'topics',
    'artifacts', 'inspirations',
    '__drizzle_migrations',
  ]

  console.log('\n🗑️  Dropping application tables...\n')
  for (const table of appTables) {
    try {
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
      console.log(`  ✅ Dropped ${table}`)
    } catch (e) {
      console.log(`  ⚠️  ${table}: ${e.message}`)
    }
  }
  console.log('\n✅ All application tables dropped. Auth tables preserved.\n')
  await pool.end()
}

main().catch(e => { console.error(e); pool.end() })
