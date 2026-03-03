// Quick script to verify tables exist in the database
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false'
    ? { rejectUnauthorized: false }
    : true,
})

async function main() {
  const { rows } = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  )
  console.log(`\n✅ Found ${rows.length} tables:\n`)
  rows.forEach(r => console.log(`  - ${r.table_name}`))
  await pool.end()
}

main().catch(e => { console.error(e.message); pool.end() })
