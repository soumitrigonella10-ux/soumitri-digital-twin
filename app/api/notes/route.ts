// ─────────────────────────────────────────────────────────────
// Notes API — CRUD for admin tasks & ideation scrapbook
//
// GET    /api/notes          → list all notes (optional ?type=task|idea)
// POST   /api/notes          → create a note
// PATCH  /api/notes          → update a note (body: { id, ...fields })
// DELETE /api/notes?id=xxx   → delete a note
//
// All endpoints require admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq, desc, asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { requireAdmin } from "@/lib/admin-auth";
import { noteSchema, notePatchSchema } from "@/lib/validation";
import { withErrorHandling, validatePatchBody, parsePagination, generateId } from "@/lib/api-utils";

// ── GET — list notes ─────────────────────────────────────────

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "task" | "idea" | null
  const { limit, offset } = parsePagination(searchParams);

  const conditions = type ? eq(notes.type, type) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(conditions)
      .orderBy(asc(notes.sortOrder), desc(notes.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(notes)
      .where(conditions),
  ]);

  const total = countResult[0]?.total ?? 0;

  return NextResponse.json({
    success: true,
    data: rows,
    pagination: { limit, offset, total, hasMore: offset + rows.length < total },
  });
}, "Failed to fetch notes");

// ── POST — create note ──────────────────────────────────────

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const id = generateId("note");
  const now = new Date();

  const [created] = await db
    .insert(notes)
    .values({
      id,
      type: data.type,
      content: data.content,
      category: data.type === "task" ? (data.category || "GENERAL") : null,
      completed: false,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}, "Failed to create note");

// ── PATCH — update note ──────────────────────────────────────

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const result = validatePatchBody(notePatchSchema, body);
  if (!result.success) return result.response;

  const [updated] = await db
    .update(notes)
    .set(result.fields)
    .where(eq(notes.id, result.id as string))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Note not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}, "Failed to update note");

// ── DELETE — remove note ─────────────────────────────────────

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id query parameter is required" },
      { status: 400 }
    );
  }

  const [deleted] = await db
    .delete(notes)
    .where(eq(notes.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Note not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}, "Failed to delete note");
