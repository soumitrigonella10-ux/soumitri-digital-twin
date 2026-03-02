-- ─────────────────────────────────────────────────────────
-- Migration: notes table for Admin Task Matrix & Ideation Scrapbook
-- ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "notes" (
  "id"          text PRIMARY KEY NOT NULL,
  "type"        text NOT NULL,
  "content"     text NOT NULL,
  "category"    text,
  "completed"   boolean DEFAULT false,
  "sort_order"  integer DEFAULT 0,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast lookups by type (task vs idea)
CREATE INDEX IF NOT EXISTS "idx_notes_type" ON "notes" ("type");
