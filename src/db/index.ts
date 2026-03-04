import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Create a Neon HTTP client — uses fetch-based queries (no TCP, no cold-start)
// Falls back gracefully if POSTGRES_URL is not set (local dev without DB)

function resolvePostgresUrl(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NON_POOLING ||
    undefined
  )
}

function createDb() {
  const url = resolvePostgresUrl()
  if (!url) {
    console.warn('[db] ⚠️ No Postgres URL found (checked POSTGRES_URL, DATABASE_URL, DATABASE_URL_POSTGRES_URL_NON_POOLING). Database queries will fail.')
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
