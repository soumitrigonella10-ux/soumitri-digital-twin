CREATE TABLE "artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"medium" text NOT NULL,
	"date" text NOT NULL,
	"dimensions" text,
	"frame_type" text NOT NULL,
	"offset_type" text NOT NULL,
	"border_style" text NOT NULL,
	"has_washi_tape" boolean DEFAULT false,
	"rotation" text,
	"paper_note" jsonb,
	"image_path" text,
	"background_color" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "consumption_items" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"description" text,
	"metadata" text,
	"status" text NOT NULL,
	"image_url" text,
	"aspect_ratio" text,
	"language" text,
	"genre" text,
	"comment" text,
	"watch_url" text
);
--> statement-breakpoint
CREATE TABLE "design_thoughts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"card_type" text NOT NULL,
	"annotation_type" text NOT NULL,
	"has_technical_pattern" boolean DEFAULT false,
	"pdf_url" text
);
--> statement-breakpoint
CREATE TABLE "dressings" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"shelf_life_days" integer NOT NULL,
	"base_type" text,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb,
	"tips" jsonb,
	"tags" jsonb
);
--> statement-breakpoint
CREATE TABLE "essays" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"category" text NOT NULL,
	"tags" jsonb,
	"date" text NOT NULL,
	"reading_time" text,
	"pdf_url" text,
	"image_url" text,
	"is_featured" boolean DEFAULT false,
	CONSTRAINT "essays_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_section_id" text NOT NULL,
	"name" text NOT NULL,
	"sets" text,
	"reps" text,
	"notes" text,
	"benefit" text,
	"is_new" boolean DEFAULT false,
	"is_essential" boolean DEFAULT false,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grocery_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	"list_type" text NOT NULL,
	"items" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspirations" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"source" text,
	"subtitle" text,
	"background_color" text,
	"accent_color" text,
	"image_url" text,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "jewellery_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"image_url" text NOT NULL,
	"favorite" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "lunch_bowl_config" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"config" jsonb NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "meal_ingredients" (
	"id" text PRIMARY KEY NOT NULL,
	"meal_template_id" text NOT NULL,
	"name" text NOT NULL,
	"quantity" text NOT NULL,
	"unit" text,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "meal_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"time_of_day" text NOT NULL,
	"meal_type" text NOT NULL,
	"items" jsonb NOT NULL,
	"instructions" jsonb,
	"weekdays" jsonb,
	"prep_time_min" integer,
	"cook_time_min" integer,
	"servings" integer,
	"tags" jsonb
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"brand" text,
	"shade" text,
	"actives" jsonb,
	"caution_tags" jsonb,
	"routine_type" text,
	"body_areas" jsonb,
	"hair_phase" text,
	"time_of_day" text,
	"weekdays" jsonb,
	"display_order" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "routine_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"routine_id" text NOT NULL,
	"step_order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"duration_min" integer,
	"product_ids" jsonb,
	"body_areas" jsonb,
	"weekdays_only" jsonb,
	"essential" boolean
);
--> statement-breakpoint
CREATE TABLE "routines" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"time_of_day" text NOT NULL,
	"notes" text,
	"schedule" jsonb NOT NULL,
	"tags" jsonb NOT NULL,
	"occasion" jsonb,
	"product_ids" jsonb
);
--> statement-breakpoint
CREATE TABLE "sidequests" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"xp" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"image_url" text,
	"quest_log" text
);
--> statement-breakpoint
CREATE TABLE "skill_experiments" (
	"id" text PRIMARY KEY NOT NULL,
	"experiment_number" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"proficiency" integer NOT NULL,
	"tools" jsonb,
	"is_inverted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"icon_color" text,
	"icon_bg" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"display_order" integer NOT NULL,
	"sub_tabs" jsonb,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_locations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"coordinates" text,
	"date_visited" text,
	"description" text,
	"image_url" text,
	"is_hero_tile" boolean DEFAULT false,
	"climate" text,
	"duration" text,
	"inventory" jsonb,
	"notes" text,
	"pdf_url" text
);
--> statement-breakpoint
CREATE TABLE "wardrobe_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"occasion" text,
	"image_url" text NOT NULL,
	"sub_type" text
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"category" text NOT NULL,
	"tags" text[],
	"image_url" text,
	"website_url" text,
	"price" real,
	"currency" text,
	"priority" text,
	"purchased" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"weekday" jsonb NOT NULL,
	"duration_min" integer NOT NULL,
	"goal" text
);
--> statement-breakpoint
CREATE TABLE "workout_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_plan_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_section_id_workout_sections_id_fk" FOREIGN KEY ("workout_section_id") REFERENCES "public"."workout_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_ingredients" ADD CONSTRAINT "meal_ingredients_meal_template_id_meal_templates_id_fk" FOREIGN KEY ("meal_template_id") REFERENCES "public"."meal_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_steps" ADD CONSTRAINT "routine_steps_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sections" ADD CONSTRAINT "workout_sections_workout_plan_id_workout_plans_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;