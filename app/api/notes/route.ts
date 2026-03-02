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
import { eq, desc, asc } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema/notes";
import { requireAdmin } from "@/lib/admin-auth";

// ── Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── GET — list notes ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "task" | "idea" | null

    const conditions = type ? eq(notes.type, type) : undefined;

    const rows = await db
      .select()
      .from(notes)
      .where(conditions)
      .orderBy(asc(notes.sortOrder), desc(notes.createdAt));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Authentication") || message.includes("Admin") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// ── POST — create note ──────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { type, content, category } = body;

    if (!type || !content) {
      return NextResponse.json(
        { success: false, error: "type and content are required" },
        { status: 400 }
      );
    }

    if (!["task", "idea"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "type must be 'task' or 'idea'" },
        { status: 400 }
      );
    }

    const id = generateId();
    const now = new Date();

    const [created] = await db
      .insert(notes)
      .values({
        id,
        type,
        content,
        category: type === "task" ? (category || "GENERAL") : null,
        completed: false,
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Authentication") || message.includes("Admin") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// ── PATCH — update note ──────────────────────────────────────

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    // Only allow updating specific fields
    const allowed: Record<string, unknown> = {};
    if ("content" in updates) allowed.content = updates.content;
    if ("category" in updates) allowed.category = updates.category;
    if ("completed" in updates) allowed.completed = updates.completed;
    if ("sortOrder" in updates) allowed.sortOrder = updates.sortOrder;

    allowed.updatedAt = new Date();

    const [updated] = await db
      .update(notes)
      .set(allowed)
      .where(eq(notes.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Authentication") || message.includes("Admin") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// ── DELETE — remove note ─────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Authentication") || message.includes("Admin") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
