// ─────────────────────────────────────────────────────────────
// Products API — Full CRUD
//
// GET    /api/products               → list all products (public-read)
// GET    /api/products?routineType=x → filter by routineType
// POST   /api/products               → create or update a product (admin)
// DELETE /api/products?id=xxx        → delete a product (admin)
//
// All endpoints require admin authentication.
// After each mutation the store should call initFromDb() to sync.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { requireAdmin } from "@/lib/admin-auth";

// ── Helpers ──────────────────────────────────────────────────

function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const isAuth = message === "Authentication required" || message === "Admin access required";
  return NextResponse.json(
    { success: false, error: message },
    { status: isAuth ? 401 : 500 },
  );
}

// ── GET — list all products (public read, no admin required) ─

export async function GET(request: NextRequest) {
  try {
    const routineType = request.nextUrl.searchParams.get("routineType");
    let rows;
    if (routineType) {
      rows = await db.select().from(products).where(eq(products.routineType, routineType));
    } else {
      rows = await db.select().from(products);
    }
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return errorResponse(error, "Failed to fetch products");
  }
}

// ── POST — upsert a product ─────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, name, category } = body;

    if (!id || !name || !category) {
      return NextResponse.json(
        { success: false, error: "id, name, and category are required" },
        { status: 400 },
      );
    }

    // Check if product already exists → update; otherwise insert
    const [existing] = await db.select().from(products).where(eq(products.id, id));

    if (existing) {
      const [updated] = await db
        .update(products)
        .set({
          name,
          category,
          brand: body.brand ?? null,
          shade: body.shade ?? null,
          actives: body.actives ?? null,
          cautionTags: body.cautionTags ?? null,
          routineType: body.routineType ?? null,
          bodyAreas: body.bodyAreas ?? null,
          hairPhase: body.hairPhase ?? null,
          timeOfDay: body.timeOfDay ?? null,
          weekdays: body.weekdays ?? null,
          displayOrder: body.displayOrder ?? null,
          notes: body.notes ?? null,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      return NextResponse.json({ success: true, data: updated });
    }

    const [inserted] = await db
      .insert(products)
      .values({
        id,
        name,
        category,
        brand: body.brand ?? null,
        shade: body.shade ?? null,
        actives: body.actives ?? null,
        cautionTags: body.cautionTags ?? null,
        routineType: body.routineType ?? null,
        bodyAreas: body.bodyAreas ?? null,
        hairPhase: body.hairPhase ?? null,
        timeOfDay: body.timeOfDay ?? null,
        weekdays: body.weekdays ?? null,
        displayOrder: body.displayOrder ?? null,
        notes: body.notes ?? null,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Failed to save product");
  }
}

// ── DELETE — remove a product ────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
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
  } catch (error) {
    return errorResponse(error, "Failed to delete product");
  }
}
