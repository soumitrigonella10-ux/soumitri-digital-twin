import { NextResponse } from "next/server";
import { db } from "@/db";
import { jewelleryItems } from "@/db/schema/wardrobe";

// ── GET /api/jewellery — all jewellery items ─────────────────
export async function GET() {
  try {
    const items = await db.select().from(jewelleryItems);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[API] jewellery GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jewellery" },
      { status: 500 },
    );
  }
}
