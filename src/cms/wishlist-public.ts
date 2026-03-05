"use server";

// ─────────────────────────────────────────────────────────────
// Wishlist DB Actions — CRUD on the `wishlist_items` table
//
// The wishlist page is public. Items live in the `wishlist_items`
// table (not the CMS content_items table). The /api/seed-data
// endpoint requires admin auth, so public visitors can't access
// it.  This server action provides a direct, auth-free read path.
//
// Update & Delete actions are also provided for admin use.
// ─────────────────────────────────────────────────────────────

import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { WishlistItem } from "@/types";

export async function getPublicWishlistItems(): Promise<WishlistItem[]> {
  const rows = await db.select().from(wishlistItems);

  return rows.map((row) => {
    const item: WishlistItem = {
      id: row.id,
      name: row.name,
      category: row.category as WishlistItem["category"],
    };

    if (row.brand) item.brand = row.brand;
    if (row.tags?.length) item.tags = row.tags;
    if (row.imageUrl) item.imageUrl = row.imageUrl;
    if (row.websiteUrl) item.websiteUrl = row.websiteUrl;
    if (row.price != null) item.price = row.price;
    if (row.currency) item.currency = row.currency;
    if (row.priority) item.priority = row.priority as "Medium" | "Low" | "High";
    if (row.purchased) item.purchased = true;

    return item;
  });
}

/** Update a DB wishlist item by id */
export async function updateDbWishlistItem(
  item: WishlistItem
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(wishlistItems)
      .set({
        name: item.name,
        brand: item.brand || null,
        category: item.category,
        tags: item.tags || [],
        imageUrl: item.imageUrl || null,
        websiteUrl: item.websiteUrl || null,
        price: item.price ?? null,
        currency: item.currency || null,
        priority: item.priority || null,
        purchased: item.purchased || false,
        updatedAt: new Date(),
      })
      .where(eq(wishlistItems.id, item.id));
    return { success: true };
  } catch (err) {
    console.error("Failed to update DB wishlist item:", err);
    return { success: false, error: "Failed to update wishlist item" };
  }
}

/** Delete a DB wishlist item by id */
export async function deleteDbWishlistItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return { success: true };
  } catch (err) {
    console.error("Failed to delete DB wishlist item:", err);
    return { success: false, error: "Failed to delete wishlist item" };
  }
}
