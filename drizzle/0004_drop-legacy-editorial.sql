-- ─────────────────────────────────────────────────────────────
-- Migration 0004: Drop legacy editorial tables
--
-- These per-type tables were created in 0000 and extended in 0001,
-- then superseded by the universal `content_items` table (0002).
--
-- No runtime code has ever queried these tables — pages read from
-- static @/data/* files and CMS-managed content_items exclusively.
-- The seed script populated them, but nothing consumed the rows.
--
-- Archived Drizzle definitions: src/db/schema/_legacy/
-- ─────────────────────────────────────────────────────────────

-- Editorial tables (from editorial.ts)
DROP TABLE IF EXISTS "essays" CASCADE;
DROP TABLE IF EXISTS "consumption_items" CASCADE;
DROP TABLE IF EXISTS "sidequests" CASCADE;
DROP TABLE IF EXISTS "skill_experiments" CASCADE;
DROP TABLE IF EXISTS "travel_locations" CASCADE;
DROP TABLE IF EXISTS "design_thoughts" CASCADE;
DROP TABLE IF EXISTS "topics" CASCADE;

-- Artifacts tables (from artifacts.ts)
DROP TABLE IF EXISTS "artifacts" CASCADE;
DROP TABLE IF EXISTS "inspirations" CASCADE;
