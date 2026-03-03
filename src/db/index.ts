import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Create a Neon HTTP client — uses fetch-based queries (no TCP, no cold-start)
// Falls back gracefully if POSTGRES_URL is not set (local dev without DB)

function createDb() {
  const url = process.env.POSTGRES_URL
  if (!url) {
    console.warn('[db] ⚠️ POSTGRES_URL is not set — database queries will fail. Using local JSON adapter for auth.')
    return null
  }
  try {
    const sql = neon(url)
    return drizzle(sql, { schema })
  } catch (err) {
    console.error('[db] Failed to initialize database connection:', err)
    return null
  }
}

const _db = createDb()

/**
 * Drizzle database instance.
 * Throws a descriptive error if POSTGRES_URL is not configured.
 */
export const db = new Proxy({} as NonNullable<typeof _db>, {
  get(_target, prop) {
    if (!_db) {
      throw new Error(
        'Database not available — POSTGRES_URL is not set. ' +
        'Uncomment POSTGRES_URL in .env.local to enable database features.'
      )
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop]
  },
})
