"use server";

// ─────────────────────────────────────────────────────────────
// Public Wishlist Query — read-only, no auth required
//
// The wishlist page is public. Items live in the `wishlist_items`
// table (not the CMS content_items table). The /api/seed-data
// endpoint requires admin auth, so public visitors can't access
// it.  This server action provides a direct, auth-free read path.
// ─────────────────────────────────────────────────────────────

import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
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
