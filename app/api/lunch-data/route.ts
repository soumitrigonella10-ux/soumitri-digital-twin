import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lunchBowlConfig, dressings } from "@/db/schema/nutrition";
import { requireAdmin } from "@/lib/admin-auth";
import { bowlConfigSchema, dressingSchema, dressingPatchSchema, bowlConfigPatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody } from "@/lib/api-utils";

// ── GET /api/lunch-data — bowl config + dressing recipes ─────
export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const [configRows, dressingRows] = await Promise.all([
    db.select().from(lunchBowlConfig).where(eq(lunchBowlConfig.isActive, true)),
    db.select().from(dressings),
  ]);

  const config = configRows[0]?.config ?? null;

  return NextResponse.json({
    success: true,
    data: { lunchBowlConfig: config, dressings: dressingRows },
  });
}, "Failed to fetch lunch data");

// ── POST /api/lunch-data — create/update bowl config or dressing ─
// Body: { entity: "bowlConfig" | "dressing", ...fields }
export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const entity = body.entity as string;

  if (entity === "bowlConfig") {
    const parsed = bowlConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const id = data.id || "default";

    const [upserted] = await db
      .insert(lunchBowlConfig)
      .values({ id, config: data.config, isActive: data.isActive ?? true })
      .onConflictDoUpdate({
        target: lunchBowlConfig.id,
        set: { config: data.config, isActive: data.isActive ?? true, updatedAt: new Date() },
      })
      .returning();
    return NextResponse.json({ success: true, data: upserted });
  }

  // Default: dressing
  const parsed = dressingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const id = data.id || `dr-${data.name.toLowerCase().replace(/\s+/g, "-")}`;
  const ingredients = data.ingredients as { name: string; quantity: string; unit?: string }[];

  const [upserted] = await db
    .insert(dressings)
    .values({
      id,
      name: data.name,
      shelfLifeDays: data.shelfLifeDays,
      baseType: data.baseType ?? null,
      ingredients,
      instructions: data.instructions ?? null,
      tips: data.tips ?? null,
      tags: data.tags ?? null,
    })
    .onConflictDoUpdate({
      target: dressings.id,
      set: {
        name: data.name,
        shelfLifeDays: data.shelfLifeDays,
        baseType: data.baseType ?? null,
        ingredients,
        instructions: data.instructions ?? null,
        tips: data.tips ?? null,
        tags: data.tags ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();
  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save lunch data");

// ── PATCH /api/lunch-data — partial update ───────────────────
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const entity = body.entity as string;

  if (entity === "bowlConfig") {
    const id = (body.id as string) || "default";
    const parsed = bowlConfigPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const [updated] = await db
      .update(lunchBowlConfig)
      .set({ ...(parsed.data as Record<string, unknown>), updatedAt: new Date() })
      .where(eq(lunchBowlConfig.id, id))
      .returning();
    if (!updated) {
      return NextResponse.json({ success: false, error: "Bowl config not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  }

  // Default: dressing
  const result = validatePatchBody(dressingPatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(dressings)
    .set(result.fields)
    .where(eq(dressings.id, result.id as string))
    .returning();
  if (!updated) {
    return NextResponse.json({ success: false, error: "Dressing not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}, "Failed to update lunch data");

// ── DELETE /api/lunch-data?entity=dressing&id=xxx ────────────
// ── DELETE /api/lunch-data?entity=bowlConfig&id=xxx ──────────
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity") || "dressing";
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "id query parameter is required" }, { status: 400 });
  }

  if (entity === "bowlConfig") {
    const [deleted] = await db.delete(lunchBowlConfig).where(eq(lunchBowlConfig.id, id)).returning();
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Bowl config not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { id } });
  }

  const [deleted] = await db.delete(dressings).where(eq(dressings.id, id)).returning();
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Dressing not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete lunch data");
