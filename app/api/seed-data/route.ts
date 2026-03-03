// ─────────────────────────────────────────────────────────────
// Seed Data API — Returns all domain data from Postgres in one call
//
// GET /api/seed-data → { products, routines, wardrobe, ... }
//
// This is the single entry-point for the client store to hydrate
// from the database. Requires admin auth.
//
// Returns the same shape as AppData so the store can use it directly.
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  products,
  routines, routineSteps,
  wardrobeItems, wishlistItems,
  mealTemplates, mealIngredients, dressings,
  workoutPlans, workoutSections, exercises,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await requireAdmin();

    // Fetch all domain tables in parallel
    const [
      productRows,
      routineRows,
      stepRows,
      wardrobeRows,
      wishlistRows,
      mealRows,
      ingredientRows,
      dressingRows,
      workoutRows,
      sectionRows,
      exerciseRows,
    ] = await Promise.all([
      db.select().from(products),
      db.select().from(routines),
      db.select().from(routineSteps),
      db.select().from(wardrobeItems),
      db.select().from(wishlistItems),
      db.select().from(mealTemplates),
      db.select().from(mealIngredients),
      db.select().from(dressings),
      db.select().from(workoutPlans),
      db.select().from(workoutSections),
      db.select().from(exercises),
    ]);

    // ── Assemble routines with nested steps ──────────────────
    const routinesWithSteps = routineRows.map((r) => ({
      ...r,
      steps: stepRows
        .filter((s) => s.routineId === r.id)
        .sort((a, b) => a.order - b.order),
    }));

    // ── Assemble meals with nested ingredients ───────────────
    const mealsWithIngredients = mealRows.map((m) => ({
      ...m,
      ingredients: ingredientRows
        .filter((i) => i.mealTemplateId === m.id),
    }));

    // ── Assemble workouts with nested sections + exercises ───
    const workoutsWithSections = workoutRows.map((w) => ({
      ...w,
      sections: sectionRows
        .filter((s) => s.workoutPlanId === w.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          ...s,
          exercises: exerciseRows
            .filter((e) => e.workoutSectionId === s.id)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        })),
    }));

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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch seed data";

    if (message === "Authentication required" || message === "Admin access required") {
      return NextResponse.json({ success: false, error: message }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
