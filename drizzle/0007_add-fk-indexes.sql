-- 0007 — Add indexes on foreign-key columns
--
-- PostgreSQL auto-indexes PKs and UNIQUE constraints but NOT FK columns.
-- Without these, cascade deletes and JOIN queries do sequential scans
-- on child tables.
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "idx_routine_steps_routine_id"
  ON "routine_steps" ("routine_id");

CREATE INDEX IF NOT EXISTS "idx_meal_ingredients_meal_template_id"
  ON "meal_ingredients" ("meal_template_id");

CREATE INDEX IF NOT EXISTS "idx_workout_sections_workout_plan_id"
  ON "workout_sections" ("workout_plan_id");

CREATE INDEX IF NOT EXISTS "idx_exercises_workout_section_id"
  ON "exercises" ("workout_section_id");
