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

// ── Helpers ──────────────────────────────────────────────────

function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const isAuth = message === "Authentication required" || message === "Admin access required";
  return NextResponse.json(
    { success: false, error: message },
    { status: isAuth ? 401 : 500 },
  );
}

// ── GET — list all routines with steps ───────────────────────

export async function GET() {
  try {
    await requireAdmin();

    const [routineRows, stepRows] = await Promise.all([
      db.select().from(routines),
      db.select().from(routineSteps),
    ]);

    const data = routineRows.map((r) => ({
      ...r,
      steps: stepRows
        .filter((s) => s.routineId === r.id)
        .sort((a, b) => a.order - b.order),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error, "Failed to fetch routines");
  }
}

// ── POST — upsert a routine (with steps) ────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, type, name, timeOfDay, schedule, tags } = body;

    if (!id || !type || !name || !timeOfDay || !schedule || !tags) {
      return NextResponse.json(
        { success: false, error: "id, type, name, timeOfDay, schedule, and tags are required" },
        { status: 400 },
      );
    }

    // Check if routine already exists → update; otherwise insert
    const [existing] = await db.select().from(routines).where(eq(routines.id, id));

    if (existing) {
      const [updated] = await db
        .update(routines)
        .set({
          type,
          name,
          timeOfDay,
          schedule,
          tags,
          occasion: body.occasion ?? null,
          productIds: body.productIds ?? null,
          notes: body.notes ?? null,
          updatedAt: new Date(),
        })
        .where(eq(routines.id, id))
        .returning();

      // Replace steps: delete old ones, insert new ones
      await db.delete(routineSteps).where(eq(routineSteps.routineId, id));

      if (body.steps?.length) {
        await db.insert(routineSteps).values(
          body.steps.map((step: Record<string, unknown>, idx: number) => ({
            id: `${id}-step-${idx + 1}`,
            routineId: id,
            order: (step.order as number) ?? idx + 1,
            title: step.title as string,
            description: (step.description as string) ?? null,
            durationMin: (step.durationMin as number) ?? null,
            productIds: (step.productIds as string[]) ?? null,
            bodyAreas: (step.bodyAreas as string[]) ?? null,
            weekdaysOnly: (step.weekdaysOnly as number[]) ?? null,
            essential: (step.essential as boolean) ?? null,
          })),
        );
      }

      return NextResponse.json({ success: true, data: updated });
    }

    // Insert new routine
    const [inserted] = await db
      .insert(routines)
      .values({
        id,
        type,
        name,
        timeOfDay,
        schedule,
        tags,
        occasion: body.occasion ?? null,
        productIds: body.productIds ?? null,
        notes: body.notes ?? null,
      })
      .returning();

    // Insert steps
    if (body.steps?.length) {
      await db.insert(routineSteps).values(
        body.steps.map((step: Record<string, unknown>, idx: number) => ({
          id: `${id}-step-${idx + 1}`,
          routineId: id,
          order: (step.order as number) ?? idx + 1,
          title: step.title as string,
          description: (step.description as string) ?? null,
          durationMin: (step.durationMin as number) ?? null,
          productIds: (step.productIds as string[]) ?? null,
          bodyAreas: (step.bodyAreas as string[]) ?? null,
          weekdaysOnly: (step.weekdaysOnly as number[]) ?? null,
          essential: (step.essential as boolean) ?? null,
        })),
      );
    }

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Failed to save routine");
  }
}

// ── DELETE — remove a routine (steps cascade via FK) ─────────

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
  } catch (error) {
    return errorResponse(error, "Failed to delete routine");
  }
}
