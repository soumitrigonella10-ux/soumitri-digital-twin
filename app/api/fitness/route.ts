// ─────────────────────────────────────────────────────────────
// Fitness API — Full CRUD for workout plans (with nested sections & exercises)
//
// GET    /api/fitness          → list all plans (with sections & exercises)
// POST   /api/fitness          → create or update a plan (upsert, with nested data)
// DELETE /api/fitness?id=xxx   → delete a plan (sections/exercises cascade via FK)
//
// All mutation endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { workoutPlans, workoutSections, exercises } from "@/db/schema/fitness";
import { requireAdmin } from "@/lib/admin-auth";
import { workoutPlanSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/api-utils";

// ── GET — list all workout plans with sections & exercises ───

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const data = await db.query.workoutPlans.findMany({
    with: {
      sections: {
        orderBy: (s, { asc }) => [asc(s.sortOrder)],
        with: {
          exercises: {
            orderBy: (e, { asc }) => [asc(e.sortOrder)],
          },
        },
      },
    },
  });

  return NextResponse.json({ success: true, data });
}, "Failed to fetch workout plans");

// ── POST — upsert a workout plan (with sections & exercises) ─

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const parsed = workoutPlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const upserted = await db.transaction(async (tx) => {
    // Atomic upsert of the workout plan parent
    const [row] = await tx
      .insert(workoutPlans)
      .values({
        id: data.id,
        name: data.name,
        weekday: data.weekday,
        durationMin: data.durationMin,
        goal: data.goal ?? null,
      })
      .onConflictDoUpdate({
        target: workoutPlans.id,
        set: {
          name: data.name,
          weekday: data.weekday,
          durationMin: data.durationMin,
          goal: data.goal ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Replace sections + exercises atomically
    await tx.delete(workoutSections).where(eq(workoutSections.workoutPlanId, data.id));

    if (data.sections.length) {
      // Batch insert all sections
      await tx.insert(workoutSections).values(
        data.sections.map((sec, si) => ({
          id: `${data.id}-sec-${si + 1}`,
          workoutPlanId: data.id,
          title: sec.title,
          description: sec.description ?? null,
          sortOrder: si + 1,
        })),
      );

      // Batch insert all exercises across all sections
      const allExercises = data.sections.flatMap((sec, si) =>
        sec.exercises.map((ex, ei) => ({
          id: `${data.id}-sec-${si + 1}-ex-${ei + 1}`,
          workoutSectionId: `${data.id}-sec-${si + 1}`,
          name: ex.name,
          sets: ex.sets ?? null,
          reps: ex.reps ?? null,
          notes: ex.notes ?? null,
          benefit: null as string | null,
          isNew: ex.isNew ?? false,
          isEssential: ex.isEssential ?? false,
          sortOrder: ei + 1,
        })),
      );
      if (allExercises.length) {
        await tx.insert(exercises).values(allExercises);
      }
    }

    return row;
  });

  return NextResponse.json({ success: true, data: upserted });
}, "Failed to save workout plan");

// ── DELETE — remove a workout plan (sections/exercises cascade) ─

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id query parameter is required" },
      { status: 400 },
    );
  }

  const [deleted] = await db
    .delete(workoutPlans)
    .where(eq(workoutPlans.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Workout plan not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete workout plan");
