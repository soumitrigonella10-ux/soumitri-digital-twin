#!/usr/bin/env node

/**
 * Setup script for NextAuth database tables
 * Run this once after connecting your Vercel Postgres database
 */

import { setupAuthTables } from './src/lib/db.js'

async function main() {
  try {
    console.log('🚀 Setting up NextAuth database tables...')
    await setupAuthTables()
    console.log('✅ Database setup complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

main()