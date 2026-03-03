import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jewelleryItems } from "@/db/schema/wardrobe";
import { requireAdmin } from "@/lib/admin-auth";
import { jewelleryItemSchema, jewelleryItemPatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody, generateId } from "@/lib/api-utils";

// ── GET /api/jewellery — all jewellery items ─────────────────
export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const items = await db.select().from(jewelleryItems);
  return NextResponse.json({ success: true, data: items });
}, "Failed to fetch jewellery");

// ── POST /api/jewellery — create or update ───────────────────
export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const parsed = jewelleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const id = data.id ?? generateId(`jewel-${data.category}`);

  const [upserted] = await db
    .insert(jewelleryItems)
    .values({
      id,
      name: data.name,
      category: data.category,
      subcategory: data.subcategory ?? null,
      imageUrl: data.imageUrl,
      favorite: data.favorite ?? false,
    })
    .onConflictDoUpdate({
      target: jewelleryItems.id,
      set: {
        name: data.name,
        category: data.category,
        subcategory: data.subcategory ?? null,
        imageUrl: data.imageUrl,
        favorite: data.favorite ?? false,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save jewellery item");

// ── PATCH /api/jewellery — partial update ────────────────────
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const result = validatePatchBody(jewelleryItemPatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(jewelleryItems)
    .set(result.fields)
    .where(eq(jewelleryItems.id, result.id as string))
    .returning();

  if (!updated) {
    return NextResponse.json({ success: false, error: "Jewellery item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}, "Failed to update jewellery item");

// ── DELETE /api/jewellery?id=xxx ─────────────────────────────
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "id query parameter is required" }, { status: 400 });
  }

  const [deleted] = await db.delete(jewelleryItems).where(eq(jewelleryItems.id, id)).returning();
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Jewellery item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete jewellery item");
