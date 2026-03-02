-- Migration: add flexible JSONB columns for ContentRenderer alignment
-- Each content table gets `media` (multi-media gallery) and `content_meta`
-- (structured key-value metadata) columns. Both are nullable JSONB so
-- existing rows are unaffected (backward-compatible, zero downtime).

-- Essays
ALTER TABLE essays ADD COLUMN IF NOT EXISTS media jsonb;
ALTER TABLE essays ADD COLUMN IF NOT EXISTS content_meta jsonb;

-- Sidequests
ALTER TABLE sidequests ADD COLUMN IF NOT EXISTS media jsonb;
ALTER TABLE sidequests ADD COLUMN IF NOT EXISTS content_meta jsonb;

-- Skill Experiments
ALTER TABLE skill_experiments ADD COLUMN IF NOT EXISTS media jsonb;
ALTER TABLE skill_experiments ADD COLUMN IF NOT EXISTS content_meta jsonb;

-- Travel Locations
ALTER TABLE travel_locations ADD COLUMN IF NOT EXISTS media jsonb;
ALTER TABLE travel_locations ADD COLUMN IF NOT EXISTS content_meta jsonb;

-- Design Thoughts
ALTER TABLE design_thoughts ADD COLUMN IF NOT EXISTS media jsonb;
ALTER TABLE design_thoughts ADD COLUMN IF NOT EXISTS content_meta jsonb;
