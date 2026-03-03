// ─────────────────────────────────────────────────────────────
// Routine Products — shared CRUD factory for skin/hair/body/bodySpecific
//
// Each routine-scoped API route calls createRoutineProductHandlers()
// with the routineType slug, getting back GET/POST/PATCH/DELETE handlers
// that are pre-scoped to that routineType.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { requireAdmin } from "@/lib/admin-auth";
import { productSchema, productPatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody } from "@/lib/api-utils";

export function createRoutineProductHandlers(routineType: string) {
  const label = routineType; // e.g. "skin", "hair", "body", "bodySpecific"

  const GET = withErrorHandling(async () => {
    await requireAdmin();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.routineType, routineType));
    return NextResponse.json({ success: true, data: rows });
  }, `Failed to fetch ${label} products`);

  const POST = withErrorHandling(async (req: NextRequest) => {
    await requireAdmin();
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const [upserted] = await db
      .insert(products)
      .values({
        id: data.id,
        name: data.name,
        category: data.category,
        brand: data.brand ?? null,
        shade: data.shade ?? null,
        actives: data.actives,
        cautionTags: data.cautionTags,
        routineType, // enforce scope
        bodyAreas: data.bodyAreas ?? null,
        hairPhase: data.hairPhase ?? null,
        timeOfDay: data.timeOfDay ?? null,
        weekdays: data.weekdays ?? null,
        displayOrder: data.displayOrder ?? null,
        notes: data.notes ?? null,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: data.name,
          category: data.category,
          brand: data.brand ?? null,
          shade: data.shade ?? null,
          actives: data.actives,
          cautionTags: data.cautionTags,
          routineType, // enforce scope
          bodyAreas: data.bodyAreas ?? null,
          hairPhase: data.hairPhase ?? null,
          timeOfDay: data.timeOfDay ?? null,
          weekdays: data.weekdays ?? null,
          displayOrder: data.displayOrder ?? null,
          notes: data.notes ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return NextResponse.json({ success: true, data: upserted });
  }, `Failed to save ${label} product`);

  const PATCH = withErrorHandling(async (req: NextRequest) => {
    await requireAdmin();
    const body = await req.json();
    const result = validatePatchBody(productPatchSchema, body);
    if (!result.success) return result.response;

    // Only update if the product actually belongs to this routineType
    const [updated] = await db
      .update(products)
      .set(result.fields)
      .where(and(eq(products.id, result.id as string), eq(products.routineType, routineType)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `${label} product not found` },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  }, `Failed to update ${label} product`);

  const DELETE = withErrorHandling(async (req: NextRequest) => {
    await requireAdmin();
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id query parameter is required" },
        { status: 400 },
      );
    }

    const [deleted] = await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.routineType, routineType)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `${label} product not found` },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: { id } });
  }, `Failed to delete ${label} product`);

  return { GET, POST, PATCH, DELETE };
}
