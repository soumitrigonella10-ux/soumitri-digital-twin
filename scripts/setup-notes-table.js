const { neon } = require('@neondatabase/serverless');

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.POSTGRES_URL);

(async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id text PRIMARY KEY NOT NULL,
      type text NOT NULL,
      content text NOT NULL,
      category text,
      completed boolean DEFAULT false,
      sort_order integer DEFAULT 0,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_notes_type ON notes (type)`;
  console.log('Notes table created successfully');

  const r = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'notes'`;
  console.log('Verified:', r.length > 0 ? 'Table EXISTS' : 'NOT FOUND');
})().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
