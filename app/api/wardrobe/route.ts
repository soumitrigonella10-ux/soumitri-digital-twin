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
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { wardrobeItems } from "@/db/schema/wardrobe";
import { requireAdmin } from "@/lib/admin-auth";
import { del } from "@vercel/blob";

// ── Helpers ──────────────────────────────────────────────────

function generateId(category: string): string {
  const prefix = category.toLowerCase().replace(/\s+/g, "-");
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── GET — list all wardrobe items ────────────────────────────

export async function GET() {
  try {
    await requireAdmin();

    const rows = await db.select().from(wardrobeItems);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch wardrobe items";

    if (message === "Authentication required" || message === "Admin access required") {
      return NextResponse.json({ success: false, error: message }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ── POST — create a new wardrobe item ────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { name, category, subcategory, occasion, imageUrl, subType } = body;

    if (!name || !category || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "name, category, and imageUrl are required" },
        { status: 400 }
      );
    }

    const id = generateId(category);

    const [inserted] = await db
      .insert(wardrobeItems)
      .values({
        id,
        name,
        category,
        subcategory: subcategory || null,
        occasion: occasion || null,
        imageUrl,
        subType: subType || null,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create wardrobe item";

    if (message === "Authentication required" || message === "Admin access required") {
      return NextResponse.json({ success: false, error: message }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ── DELETE — remove a wardrobe item ──────────────────────────

export async function DELETE(req: NextRequest) {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete wardrobe item";

    if (message === "Authentication required" || message === "Admin access required") {
      return NextResponse.json({ success: false, error: message }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
