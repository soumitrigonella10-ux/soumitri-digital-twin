// ─────────────────────────────────────────────────────────────
// Products API — Full CRUD
//
// GET    /api/products          → list all products
// POST   /api/products          → create or update a product (upsert)
// DELETE /api/products?id=xxx   → delete a product
//
// All endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { requireAdmin } from "@/lib/admin-auth";

// ── GET — list all products ──────────────────────────────────

export async function GET() {
  try {
    await requireAdmin();

    const rows = await db.select().from(products);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";

    if (
      message === "Authentication required" ||
      message === "Admin access required"
    ) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST — create or update a product (upsert by id) ────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const {
      id,
      name,
      category,
      brand,
      shade,
      actives,
      cautionTags,
      routineType,
      bodyAreas,
      hairPhase,
      timeOfDay,
      weekdays,
      displayOrder,
      notes,
    } = body;

    if (!id || !name || !category) {
      return NextResponse.json(
        { success: false, error: "id, name, and category are required" },
        { status: 400 }
      );
    }

    const now = new Date();

    const [upserted] = await db
      .insert(products)
      .values({
        id,
        name,
        category,
        brand: brand || null,
        shade: shade || null,
        actives: actives || [],
        cautionTags: cautionTags || [],
        routineType: routineType || null,
        bodyAreas: bodyAreas || null,
        hairPhase: hairPhase || null,
        timeOfDay: timeOfDay || null,
        weekdays: weekdays || null,
        displayOrder: displayOrder ?? null,
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name,
          category,
          brand: brand || null,
          shade: shade || null,
          actives: actives || [],
          cautionTags: cautionTags || [],
          routineType: routineType || null,
          bodyAreas: bodyAreas || null,
          hairPhase: hairPhase || null,
          timeOfDay: timeOfDay || null,
          weekdays: weekdays || null,
          displayOrder: displayOrder ?? null,
          notes: notes || null,
          updatedAt: now,
        },
      })
      .returning();

    return NextResponse.json(
      { success: true, data: upserted },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save product";

    if (
      message === "Authentication required" ||
      message === "Admin access required"
    ) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
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
        { success: false, error: "id query param is required" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product";

    if (
      message === "Authentication required" ||
      message === "Admin access required"
    ) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
