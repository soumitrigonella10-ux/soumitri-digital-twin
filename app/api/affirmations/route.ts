import { NextResponse } from "next/server";
import { db } from "@/db";
import { affirmationsTable, dayThemes } from "@/db/schema/affirmations";

// ── GET /api/affirmations — all affirmations + day themes ────
export async function GET() {
  try {
    const [affirmationRows, themeRows] = await Promise.all([
      db.select().from(affirmationsTable),
      db.select().from(dayThemes),
    ]);
    return NextResponse.json({
      success: true,
      data: { affirmations: affirmationRows, dayThemes: themeRows },
    });
  } catch (error) {
    console.error("[API] affirmations GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch affirmations" },
      { status: 500 },
    );
  }
}
