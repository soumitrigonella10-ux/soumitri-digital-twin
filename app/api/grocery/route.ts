import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groceryCategories } from "@/db/schema/nutrition";
import { requireAdmin } from "@/lib/admin-auth";
import { groceryCategorySchema, groceryCategoryPatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody } from "@/lib/api-utils";

// ── GET /api/grocery — grocery categories (master + weekly) ──
export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const rows = await db.select().from(groceryCategories);
  return NextResponse.json({ success: true, data: rows });
}, "Failed to fetch grocery categories");

// ── POST /api/grocery — create or update a grocery category ──
export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const parsed = groceryCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const id = data.id || `gc-${data.name.toLowerCase().replace(/\s+/g, "-")}`;
  const items = data.items as { name: string; quantity?: string }[];

  const [upserted] = await db
    .insert(groceryCategories)
    .values({ id, name: data.name, emoji: data.emoji, listType: data.listType, items })
    .onConflictDoUpdate({
      target: groceryCategories.id,
      set: { name: data.name, emoji: data.emoji, listType: data.listType, items, updatedAt: new Date() },
    })
    .returning();

  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save grocery category");

// ── PATCH /api/grocery — partial update ──────────────────────
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const result = validatePatchBody(groceryCategoryPatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(groceryCategories)
    .set(result.fields)
    .where(eq(groceryCategories.id, result.id as string))
    .returning();

  if (!updated) {
    return NextResponse.json({ success: false, error: "Grocery category not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}, "Failed to update grocery category");

// ── DELETE /api/grocery?id=xxx ───────────────────────────────
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "id query parameter is required" }, { status: 400 });
  }

  const [deleted] = await db.delete(groceryCategories).where(eq(groceryCategories.id, id)).returning();
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Grocery category not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete grocery category");
