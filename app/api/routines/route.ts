// ─────────────────────────────────────────────────────────────
// Routines API — Full CRUD (with nested steps)
//
// GET    /api/routines          → list all routines (with steps)
// POST   /api/routines          → create or update a routine (upsert)
// DELETE /api/routines?id=xxx   → delete a routine (steps cascade)
//
// All endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { routines, routineSteps } from "@/db/schema/routines";
import { requireAdmin } from "@/lib/admin-auth";
import { routineSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/api-utils";

// ── GET — list all routines with steps ───────────────────────

export const GET = withErrorHandling(async () => {
  await requireAdmin();

  const data = await db.query.routines.findMany({
    with: { steps: { orderBy: (s, { asc }) => [asc(s.order)] } },
  });

  return NextResponse.json({ success: true, data });
}, "Failed to fetch routines");

// ── POST — upsert a routine (with steps) ────────────────────

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const parsed = routineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  // Cast Zod optional outputs to match DB JSONB column types (exactOptionalPropertyTypes)
  const schedule = data.schedule as { weekday?: number[]; cycleDay?: number[]; frequencyPerWeek?: number };
  const tags = data.tags as { office?: boolean; wfh?: boolean; travel?: boolean; goingOut?: boolean };

  // Upsert the routine parent
  const [upserted] = await db
    .insert(routines)
    .values({
      id: data.id,
      type: data.type,
      name: data.name,
      timeOfDay: data.timeOfDay,
      schedule,
      tags,
      occasion: data.occasion ?? null,
      productIds: data.productIds ?? null,
      notes: data.notes ?? null,
    })
    .onConflictDoUpdate({
      target: routines.id,
      set: {
        type: data.type,
        name: data.name,
        timeOfDay: data.timeOfDay,
        schedule,
        tags,
        occasion: data.occasion ?? null,
        productIds: data.productIds ?? null,
        notes: data.notes ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Replace steps (delete + re-insert)
  await db.delete(routineSteps).where(eq(routineSteps.routineId, data.id));

  if (data.steps.length) {
    await db.insert(routineSteps).values(
      data.steps.map((step, idx) => ({
        id: `${data.id}-step-${idx + 1}`,
        routineId: data.id,
        order: step.order ?? idx + 1,
        title: step.title,
        description: step.description ?? null,
        durationMin: step.durationMin ?? null,
        productIds: step.productIds ?? null,
        bodyAreas: step.bodyAreas ?? null,
        weekdaysOnly: step.weekdaysOnly ?? null,
        essential: step.essential ?? null,
      })),
    );
  }

  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save routine");

// ── DELETE — remove a routine (steps cascade via FK) ─────────

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
    .delete(routines)
    .where(eq(routines.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Routine not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete routine");
