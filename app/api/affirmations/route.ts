import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { affirmationsTable, dayThemes } from "@/db/schema/affirmations";
import { requireAdmin } from "@/lib/admin-auth";
import { affirmationSchema, dayThemeSchema, affirmationPatchSchema, dayThemePatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody } from "@/lib/api-utils";

// ── GET /api/affirmations — all affirmations + day themes ────
export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const [affirmationRows, themeRows] = await Promise.all([
    db.select().from(affirmationsTable),
    db.select().from(dayThemes),
  ]);
  return NextResponse.json({
    success: true,
    data: { affirmations: affirmationRows, dayThemes: themeRows },
  });
}, "Failed to fetch affirmations");

// ── POST /api/affirmations — create or update ────────────────
// Body: { entity: "affirmation" | "dayTheme", ...fields }
export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const entity = body.entity as string;

  if (entity === "dayTheme") {
    const parsed = dayThemeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const [upserted] = await db
      .insert(dayThemes)
      .values({ weekday: data.weekday, emoji: data.emoji, title: data.title, subtitle: data.subtitle })
      .onConflictDoUpdate({
        target: dayThemes.weekday,
        set: { emoji: data.emoji, title: data.title, subtitle: data.subtitle, updatedAt: new Date() },
      })
      .returning();
    return NextResponse.json({ success: true, data: upserted });
  }

  // Default: affirmation
  const parsed = affirmationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const [upserted] = await db
    .insert(affirmationsTable)
    .values({
      id: data.id,
      text: data.text,
      type: data.type,
      timeOfDay: data.timeOfDay,
      weekday: data.weekday,
      displayOrder: data.displayOrder ?? null,
    })
    .onConflictDoUpdate({
      target: affirmationsTable.id,
      set: {
        text: data.text,
        type: data.type,
        timeOfDay: data.timeOfDay,
        weekday: data.weekday,
        displayOrder: data.displayOrder ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();
  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save affirmation");

// ── PATCH /api/affirmations — partial update ─────────────────
// Body: { entity?: "affirmation" | "dayTheme", id/weekday, ...fields }
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const entity = body.entity as string;

  if (entity === "dayTheme") {
    const result = validatePatchBody(dayThemePatchSchema, body, "weekday");
    if (!result.success) return result.response;

    const [updated] = await db
      .update(dayThemes)
      .set(result.fields)
      .where(eq(dayThemes.weekday, result.id as number))
      .returning();
    if (!updated) {
      return NextResponse.json({ success: false, error: "Day theme not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  }

  // Default: affirmation
  const result = validatePatchBody(affirmationPatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(affirmationsTable)
    .set(result.fields)
    .where(eq(affirmationsTable.id, result.id as string))
    .returning();
  if (!updated) {
    return NextResponse.json({ success: false, error: "Affirmation not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}, "Failed to update affirmation");

// ── DELETE /api/affirmations?id=xxx&entity=affirmation|dayTheme ─
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity") || "affirmation";

  if (entity === "dayTheme") {
    const weekday = Number(searchParams.get("weekday"));
    if (isNaN(weekday)) {
      return NextResponse.json({ success: false, error: "weekday query parameter is required" }, { status: 400 });
    }
    const [deleted] = await db.delete(dayThemes).where(eq(dayThemes.weekday, weekday)).returning();
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Day theme not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { weekday } });
  }

  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "id query parameter is required" }, { status: 400 });
  }
  const [deleted] = await db.delete(affirmationsTable).where(eq(affirmationsTable.id, id)).returning();
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Affirmation not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete affirmation");
