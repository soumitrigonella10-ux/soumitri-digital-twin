// ─────────────────────────────────────────────────────────────
// Seed Data API — Returns all domain data from Postgres in one call
//
// GET /api/seed-data → { products, routines, wardrobe, ... }
//
// This is the single entry-point for the client store to hydrate
// from the database. Read-only, admin-protected.
//
// Returns the same shape as AppData so the store can use it directly.
//
// FALLBACK: When the database is unreachable (e.g. Neon endpoint
// suspended, DNS failure, network outage) the route automatically
// serves the static TypeScript seed data from @/data/* so the UI
// isn't blank. A `source: "fallback"` flag is included so callers
// can tell the difference.
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  products,
  wardrobeItems, wishlistItems,
  dressings,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { withErrorHandling } from "@/lib/api-utils";

// ── Static fallback data (loaded only when needed) ───────────
import { products as fallbackProducts } from "@/data/products";
import { routines as fallbackRoutines } from "@/data/routines";
import { wardrobe as fallbackWardrobe } from "@/data/wardrobe";
import { wishlist as fallbackWishlist } from "@/data/wishlist";
import { meals as fallbackMeals } from "@/data/meals";
import { dressings as fallbackDressings } from "@/data/meals/dressings";
import { workouts as fallbackWorkouts } from "@/data/workouts";

function buildFallbackResponse() {
  console.warn("[seed-data] ⚠️ Database unreachable — serving static fallback data");
  return NextResponse.json({
    success: true,
    source: "fallback",
    data: {
      products: fallbackProducts,
      routines: fallbackRoutines,
      wardrobe: fallbackWardrobe,
      wishlist: fallbackWishlist,
      mealTemplates: fallbackMeals,
      dressings: fallbackDressings,
      workoutPlans: fallbackWorkouts,
    },
  }, {
    headers: {
      // Short cache — retry DB on next request
      'Cache-Control': 'private, max-age=10',
    },
  });
}

export const GET = withErrorHandling(async () => {
  await requireAdmin();

  try {
    // Flat tables + relational queries for nested data, all in parallel
    const [
      productRows,
      routinesWithSteps,
      wardrobeRows,
      wishlistRows,
      mealsWithIngredients,
      dressingRows,
      workoutsWithSections,
    ] = await Promise.all([
      db.select().from(products),
      db.query.routines.findMany({
        with: { steps: { orderBy: (s, { asc }) => [asc(s.order)] } },
      }),
      db.select().from(wardrobeItems),
      db.select().from(wishlistItems),
      db.query.mealTemplates.findMany({
        with: { ingredients: true },
      }),
      db.select().from(dressings),
      db.query.workoutPlans.findMany({
        with: {
          sections: {
            orderBy: (s, { asc }) => [asc(s.sortOrder)],
            with: {
              exercises: {
                orderBy: (e, { asc }) => [asc(e.sortOrder)],
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      source: "database",
      data: {
        products: productRows,
        routines: routinesWithSteps,
        wardrobe: wardrobeRows,
        wishlist: wishlistRows,
        mealTemplates: mealsWithIngredients,
        dressings: dressingRows,
        workoutPlans: workoutsWithSections,
      },
    }, {
      headers: {
        // Cache for 60s, serve stale up to 5 min while revalidating
        'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (dbError) {
    // Database unreachable — serve static fallback so the UI isn't blank
    console.error("[seed-data] Database query failed:", dbError);
    return buildFallbackResponse();
  }
}, "Failed to fetch seed data");
