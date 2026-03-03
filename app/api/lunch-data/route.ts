import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lunchBowlConfig, dressings } from "@/db/schema/nutrition";

// ── GET /api/lunch-data — bowl config + dressing recipes ─────
export async function GET() {
  try {
    const [configRows, dressingRows] = await Promise.all([
      db.select().from(lunchBowlConfig).where(eq(lunchBowlConfig.isActive, true)),
      db.select().from(dressings),
    ]);

    const config = configRows[0]?.config ?? null;

    return NextResponse.json({
      success: true,
      data: { lunchBowlConfig: config, dressings: dressingRows },
    });
  } catch (error) {
    console.error("[API] lunch-data GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lunch data" },
      { status: 500 },
    );
  }
}
