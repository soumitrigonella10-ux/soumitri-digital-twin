// ─────────────────────────────────────────────────────────────
// Wardrobe Items API — CRUD
//
// GET    /api/wardrobe          → list all wardrobe items
// POST   /api/wardrobe          → create a wardrobe item
// DELETE /api/wardrobe?id=xxx   → delete a wardrobe item
//
// All endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { wardrobeItems } from "@/db/schema/wardrobe";
import { requireAdmin } from "@/lib/admin-auth";
import { wardrobeItemSchema } from "@/lib/validation";
import { del } from "@vercel/blob";
import { withErrorHandling, parsePagination, generateId } from "@/lib/api-utils";

// ── GET — list wardrobe items (paginated) ────────────────────

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const { limit, offset } = parsePagination(searchParams);

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(wardrobeItems)
      .orderBy(desc(wardrobeItems.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(wardrobeItems),
  ]);

  const total = countResult[0]?.total ?? 0;

  return NextResponse.json({
    success: true,
    data: rows,
    pagination: { limit, offset, total, hasMore: offset + rows.length < total },
  });
}, "Failed to fetch wardrobe items");

// ── POST — create a new wardrobe item ────────────────────────

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const parsed = wardrobeItemSchema.omit({ id: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const id = generateId(data.category);

    const [inserted] = await db
      .insert(wardrobeItems)
      .values({
        id,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory || null,
        occasion: data.occasion || null,
        imageUrl: data.imageUrl,
        subType: data.subType || null,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
}, "Failed to create wardrobe item");

// ── PUT — update an existing wardrobe item ───────────────────

export const PUT = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const { id, ...rest } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, error: "id is required" },
      { status: 400 },
    );
  }

  const parsed = wardrobeItemSchema.omit({ id: true }).partial().safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Check item exists
  const [existing] = await db
    .select()
    .from(wardrobeItems)
    .where(eq(wardrobeItems.id, id));

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Item not found" },
      { status: 404 },
    );
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined)        updates.name        = parsed.data.name;
  if (parsed.data.category !== undefined)    updates.category    = parsed.data.category;
  if (parsed.data.subcategory !== undefined) updates.subcategory = parsed.data.subcategory || null;
  if (parsed.data.occasion !== undefined)    updates.occasion    = parsed.data.occasion || null;
  if (parsed.data.imageUrl !== undefined)    updates.imageUrl    = parsed.data.imageUrl;
  if (parsed.data.subType !== undefined)     updates.subType     = parsed.data.subType || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields to update" },
      { status: 400 },
    );
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(wardrobeItems)
    .set(updates)
    .where(eq(wardrobeItems.id, id))
    .returning();

  return NextResponse.json({ success: true, data: updated });
}, "Failed to update wardrobe item");

// ── DELETE — remove a wardrobe item ──────────────────────────

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id is required" },
      { status: 400 }
    );
  }

  // Fetch item first to get imageUrl for blob cleanup
  const [item] = await db
    .select()
    .from(wardrobeItems)
    .where(eq(wardrobeItems.id, id));

  if (!item) {
    return NextResponse.json(
      { success: false, error: "Item not found" },
      { status: 404 }
    );
  }

  // Delete from DB
  await db.delete(wardrobeItems).where(eq(wardrobeItems.id, id));

  // Try to delete blob image (only for blob URLs, not local /images/ paths)
  if (item.imageUrl && item.imageUrl.startsWith("https://")) {
    try {
      await del(item.imageUrl);
    } catch {
      // Non-critical — blob may already be gone or it's an external URL
    }
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete wardrobe item");
