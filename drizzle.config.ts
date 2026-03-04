import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: (process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL_NON_POOLING)!,
  },
})
