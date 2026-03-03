-- ─────────────────────────────────────────────────────────────
-- Migration 0005 — Add created_at / updated_at to all core tables
--
-- Adds audit timestamps to every domain table that was missing them.
-- Uses DEFAULT NOW() so existing rows get the migration timestamp.
-- content_items and notes already have timestamps (unchanged).
-- ─────────────────────────────────────────────────────────────

-- Products
ALTER TABLE "products"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Routines
ALTER TABLE "routines"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Routine Steps
ALTER TABLE "routine_steps"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Wardrobe Items
ALTER TABLE "wardrobe_items"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Wishlist Items
ALTER TABLE "wishlist_items"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Jewellery Items
ALTER TABLE "jewellery_items"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Meal Templates
ALTER TABLE "meal_templates"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Meal Ingredients
ALTER TABLE "meal_ingredients"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Dressings
ALTER TABLE "dressings"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Grocery Categories
ALTER TABLE "grocery_categories"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Lunch Bowl Config
ALTER TABLE "lunch_bowl_config"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Workout Plans
ALTER TABLE "workout_plans"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Workout Sections
ALTER TABLE "workout_sections"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Exercises
ALTER TABLE "exercises"
  ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
