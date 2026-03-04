import { Pool } from 'pg'
import { createLogger } from '@/lib/logger'
import { config } from '@/lib/config'

const log = createLogger('db')

// ========================================
// Resolve the Postgres connection URL from env vars.
// Neon’s Vercel integration creates vars with a configurable prefix.
// We check the most common names so the code works regardless of
// how the integration was set up.
// ========================================
export function resolvePostgresUrl(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NON_POOLING ||
    undefined
  )
}

// Create a connection pool for PostgreSQL (Neon requires SSL)
// - Neon free tier databases suspend after inactivity; cold starts need up to 10s
// - Serverless environments (Vercel) should use a small pool
// - Only create pool when a Postgres URL is available
const pgUrl = resolvePostgresUrl()
let pool: Pool | null = null

try {
  if (pgUrl) {
    log.info(`PostgreSQL URL resolved from env (length=${pgUrl.length})`)
    pool = new Pool({
      connectionString: pgUrl,
      // Neon serverless requires SSL.  When POSTGRES_URL points at Neon the
      // shared TLS certificate doesn't match the connection hostname, so
      // strict verification fails.  Guard this with an explicit env flag so
      // moving to another provider restores full certificate verification.
      ssl: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false'
        ? { rejectUnauthorized: false }
        : true,
      max: config.db.maxPoolSize,
      idleTimeoutMillis: config.db.idleTimeoutMs,
      connectionTimeoutMillis: config.db.connectionTimeoutMs,
    })
    log.info('PostgreSQL pool initialized successfully')
  } else {
    log.warn('No Postgres URL found in env (checked POSTGRES_URL, DATABASE_URL, DATABASE_URL_POSTGRES_URL_NON_POOLING). Pool will be null.')
  }
} catch (error) {
  log.error('❌ Failed to create PostgreSQL pool:', error)
  pool = null
}

export { pool }

// Prevent unhandled pool errors from crashing the process
if (pool) {
  pool.on('error', (err) => {
    log.error('Unexpected PG pool error:', err.message)
  })
}

let tablesSetup = false;

// Helper to run the database setup if needed
export async function setupAuthTables() {
  if (tablesSetup || !pool) return;
  
  const client = await pool.connect()
  try {
    log.info('Attempting to setup auth tables...')
    
    // Check if users table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    if (!result.rows[0].exists) {
      log.info('Setting up NextAuth database tables...')
      
      // Column names MUST match the pg-adapter queries (camelCase, quoted)
      // and the setup-neon-tables.js schema
      await client.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          "emailVerified" TIMESTAMPTZ,
          image TEXT
        );

        CREATE TABLE IF NOT EXISTS accounts (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          UNIQUE(provider, "providerAccountId")
        );

        CREATE TABLE IF NOT EXISTS sessions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          "sessionToken" TEXT NOT NULL UNIQUE,
          "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS verification_token (
          identifier TEXT NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (identifier, token)
        );
      `)
      
      log.info('✅ NextAuth database tables created successfully')
    } else {
      log.info('✅ NextAuth database tables already exist')
    }
    
    tablesSetup = true;
  } catch (error) {
    log.error('❌ Failed to setup auth tables:', error)
    // Don't throw - allow app to continue but log the error
    // Sign-in will fail with a more specific error when it tries to use the tables
  } finally {
    client.release()
  }
}

// Auto-setup tables on first pool connection
if (pool) {
  pool.on('connect', () => {
    if (!tablesSetup) {
      setupAuthTables().catch(() => {
        // Silent fail during development
      });
    }
  });
}