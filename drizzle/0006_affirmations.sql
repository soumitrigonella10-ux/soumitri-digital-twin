-- Migration: 0006_affirmations
-- Add tables for affirmations and day themes (previously hardcoded in TS)

CREATE TABLE IF NOT EXISTS "day_themes" (
  "weekday" integer PRIMARY KEY,
  "emoji" text NOT NULL,
  "title" text NOT NULL,
  "subtitle" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "affirmations" (
  "id" text PRIMARY KEY,
  "text" text NOT NULL,
  "type" text NOT NULL,
  "time_of_day" text NOT NULL,
  "weekday" integer NOT NULL,
  "display_order" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "idx_affirmations_weekday" ON "affirmations" ("weekday");
CREATE INDEX "idx_affirmations_time_of_day" ON "affirmations" ("time_of_day");
