import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Create a Neon HTTP client — uses fetch-based queries (no TCP, no cold-start)
// Falls back gracefully if POSTGRES_URL is not set (local dev without DB)
const sql = neon(process.env.POSTGRES_URL!)

export const db = drizzle(sql, { schema })
