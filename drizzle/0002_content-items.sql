-- ─────────────────────────────────────────────────────────────
-- Migration: content_items — Universal CMS table
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "content_items" (
  "id"            TEXT PRIMARY KEY,
  "type"          TEXT NOT NULL,
  "slug"          TEXT NOT NULL,
  "title"         TEXT NOT NULL,
  "visibility"    TEXT NOT NULL DEFAULT 'draft',
  "metadata"      JSONB DEFAULT '{}'::jsonb,
  "payload"       JSONB DEFAULT '{}'::jsonb,
  "cover_image"   TEXT,
  "is_featured"   BOOLEAN DEFAULT false,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "published_at"  TIMESTAMPTZ
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS "idx_content_items_type"
  ON "content_items" ("type");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_content_items_type_slug"
  ON "content_items" ("type", "slug");

CREATE INDEX IF NOT EXISTS "idx_content_items_visibility"
  ON "content_items" ("visibility");

CREATE INDEX IF NOT EXISTS "idx_content_items_published_at"
  ON "content_items" ("published_at");
