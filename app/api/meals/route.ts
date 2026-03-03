// ─────────────────────────────────────────────────────────────
// Meals API — Full CRUD for meal templates (with nested ingredients)
//
// GET    /api/meals              → list all meal templates (with ingredients)
// GET    /api/meals?mealType=x   → filter by mealType
// POST   /api/meals              → create or update a meal template (upsert)
// DELETE /api/meals?id=xxx       → delete a meal template (ingredients cascade via FK)
//
// All mutation endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mealTemplates, mealIngredients } from "@/db/schema/nutrition";
import { requireAdmin } from "@/lib/admin-auth";
import { mealTemplateSchema, mealTemplatePatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody } from "@/lib/api-utils";

// ── GET — list all meal templates with ingredients ───────────

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const mealType = new URL(req.url).searchParams.get("mealType");

  const data = await db.query.mealTemplates.findMany({
    where: mealType ? eq(mealTemplates.mealType, mealType) : undefined,
    with: { ingredients: true },
  });

  return NextResponse.json({ success: true, data });
}, "Failed to fetch meal templates");

// ── POST — upsert a meal template (with ingredients) ─────────

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const parsed = mealTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const upserted = await db.transaction(async (tx) => {
    // Atomic upsert of the meal template parent
    const [row] = await tx
      .insert(mealTemplates)
      .values({
        id: data.id,
        name: data.name,
        timeOfDay: data.timeOfDay,
        mealType: data.mealType,
        items: data.items,
        instructions: data.instructions ?? null,
        weekdays: data.weekdays ?? null,
        prepTimeMin: data.prepTimeMin ?? null,
        cookTimeMin: data.cookTimeMin ?? null,
        servings: data.servings ?? null,
        tags: data.tags ?? null,
      })
      .onConflictDoUpdate({
        target: mealTemplates.id,
        set: {
          name: data.name,
          timeOfDay: data.timeOfDay,
          mealType: data.mealType,
          items: data.items,
          instructions: data.instructions ?? null,
          weekdays: data.weekdays ?? null,
          prepTimeMin: data.prepTimeMin ?? null,
          cookTimeMin: data.cookTimeMin ?? null,
          servings: data.servings ?? null,
          tags: data.tags ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Replace ingredients atomically within the same transaction
    await tx.delete(mealIngredients).where(eq(mealIngredients.mealTemplateId, data.id));

    if (data.ingredients?.length) {
      await tx.insert(mealIngredients).values(
        data.ingredients.map((ing, idx) => ({
          id: `${data.id}-ing-${idx + 1}`,
          mealTemplateId: data.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit ?? null,
          category: ing.category ?? null,
        })),
      );
    }

    return row;
  });

  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save meal template");

// ── PATCH — partial update (template fields only, no nested replace) ─

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const result = validatePatchBody(mealTemplatePatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(mealTemplates)
    .set(result.fields)
    .where(eq(mealTemplates.id, result.id as string))
    .returning();

  if (!updated) {
    return NextResponse.json({ success: false, error: "Meal template not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}, "Failed to update meal template");

// ── DELETE — remove a meal template (ingredients cascade) ────

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id query parameter is required" },
      { status: 400 },
    );
  }

  const [deleted] = await db
    .delete(mealTemplates)
    .where(eq(mealTemplates.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Meal template not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete meal template");
