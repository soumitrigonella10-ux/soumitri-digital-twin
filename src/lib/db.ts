import { Pool } from 'pg'

// Create a connection pool for PostgreSQL
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

let tablesSetup = false;

// Helper to run the database setup if needed
export async function setupAuthTables() {
  if (tablesSetup) return;
  
  try {
    const client = await pool.connect()
    
    // Check if users table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    if (!result.rows[0].exists) {
      console.log('Setting up NextAuth database tables...')
      
      // Create tables (this is a simplified version - in production you'd use proper migrations)
      await client.query(`
        CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          provider_account_id TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          UNIQUE(provider, provider_account_id)
        );

        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          session_token TEXT NOT NULL UNIQUE,
          user_id TEXT NOT NULL,
          expires TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          email_verified TIMESTAMPTZ,
          image TEXT
        );

        CREATE TABLE IF NOT EXISTS verification_tokens (
          identifier TEXT NOT NULL,
          token TEXT NOT NULL,
          expires TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (identifier, token)
        );

        CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
        CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON sessions(session_token);
        CREATE INDEX IF NOT EXISTS verification_token_expires_idx ON verification_tokens(expires);
      `)
      
      console.log('✅ NextAuth database tables created successfully')
    }
    
    tablesSetup = true;
    client.release()
  } catch (error) {
    console.error('Failed to setup auth tables:', error)
    // Don't throw in production - let the adapter handle missing tables gracefully
  }
}

// Auto-setup tables on first pool connection
pool.on('connect', () => {
  if (!tablesSetup) {
    setupAuthTables().catch(() => {
      // Silent fail during development
    });
  }
});