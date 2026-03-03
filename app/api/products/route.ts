// ─────────────────────────────────────────────────────────────
// Products API — Full CRUD
//
// GET    /api/products               → list all products
// GET    /api/products?routineType=x → filter by routineType
// POST   /api/products               → create or update a product (upsert)
// DELETE /api/products?id=xxx        → delete a product
//
// All endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { requireAdmin } from "@/lib/admin-auth";
import { productSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/api-utils";

// ── GET — list all products ──────────────────────────────────

export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();
  const routineType = request.nextUrl.searchParams.get("routineType");
  let rows;
  if (routineType) {
    rows = await db.select().from(products).where(eq(products.routineType, routineType));
  } else {
    rows = await db.select().from(products);
  }
  return NextResponse.json({ success: true, data: rows });
}, "Failed to fetch products");

// ── POST — upsert a product ─────────────────────────────────

export const POST = withErrorHandling(async (req: NextRequest) => {
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
        routineType: data.routineType ?? null,
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
          routineType: data.routineType ?? null,
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
}, "Failed to save product");

// ── DELETE — remove a product ────────────────────────────────

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id query parameter is required" },
      { status: 400 },
    );
  }

  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete product");
