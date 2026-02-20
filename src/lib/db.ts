import { Pool } from 'pg'

// Create a connection pool for PostgreSQL (Neon requires SSL)
// - Neon free tier databases suspend after inactivity; cold starts need up to 10s
// - Serverless environments (Vercel) should use a small pool
// - Only create pool when POSTGRES_URL is available
let pool: Pool | null = null

try {
  if (process.env.POSTGRES_URL) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000, // Increased to 20s to handle Neon cold starts reliably
    })
    // eslint-disable-next-line no-console
    console.log('[db] PostgreSQL pool initialized successfully')
  } else {
    // eslint-disable-next-line no-console
    console.log('[db] No POSTGRES_URL found, pool will be null')
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('[db] ❌ Failed to create PostgreSQL pool:', error)
  pool = null
}

export { pool }

// Prevent unhandled pool errors from crashing the process
if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected PG pool error:', err.message)
  })
}

let tablesSetup = false;

// Helper to run the database setup if needed
export async function setupAuthTables() {
  if (tablesSetup || !pool) return;
  
  try {
    // eslint-disable-next-line no-console
    console.log('[db] Attempting to setup auth tables...')
    const client = await pool.connect()
    
    // Check if users table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    if (!result.rows[0].exists) {
      // eslint-disable-next-line no-console
      console.log('[db] Setting up NextAuth database tables...')
      
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
      
      // eslint-disable-next-line no-console
      console.log('[db] ✅ NextAuth database tables created successfully')
    } else {
      // eslint-disable-next-line no-console
      console.log('[db] ✅ NextAuth database tables already exist')
    }
    
    tablesSetup = true;
    client.release()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] ❌ Failed to setup auth tables:', error)
    // Don't throw - allow app to continue but log the error
    // Sign-in will fail with a more specific error when it tries to use the tables
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