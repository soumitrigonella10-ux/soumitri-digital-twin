// ─────────────────────────────────────────────────────────────
// Seed Data API — Returns all domain data from Postgres in one call
//
// GET /api/seed-data → { products, routines, wardrobe, ... }
//
// This is the single entry-point for the client store to hydrate
// from the database. Read-only, admin-protected.
//
// Returns the same shape as AppData so the store can use it directly.
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

export const GET = withErrorHandling(async () => {
  await requireAdmin();

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
}, "Failed to fetch seed data");
