import { NextResponse } from "next/server";
import { db } from "@/db";
import { groceryCategories } from "@/db/schema/nutrition";

// ── GET /api/grocery — grocery categories (master + weekly) ──
export async function GET() {
  try {
    const rows = await db.select().from(groceryCategories);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("[API] grocery GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch grocery categories" },
      { status: 500 },
    );
  }
}
