// ─────────────────────────────────────────────────────────────
// Wardrobe, Wishlist, Jewellery tables
// Maps to: src/types/wardrobe.ts → WardrobeItem, WishlistItem, JewelleryItem
// ─────────────────────────────────────────────────────────────
import { pgTable, text, boolean, real, timestamp } from 'drizzle-orm/pg-core'

// ── Wardrobe Items ───────────────────────────────────────────
export const wardrobeItems = pgTable('wardrobe_items', {
  id:          text('id').primaryKey(),
  name:        text('name').notNull(),
  category:    text('category').notNull(),                 // "Top" | "Bottom" | "Dress" | etc.
  subcategory: text('subcategory'),                        // "Basics", "Elevated tops"
  occasion:    text('occasion'),                           // "Business Casual", "Date Night"
  imageUrl:    text('image_url').notNull(),
  subType:     text('sub_type'),

  /** Audit timestamps */
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Wishlist Items ───────────────────────────────────────────
export const wishlistItems = pgTable('wishlist_items', {
  id:         text('id').primaryKey(),
  name:       text('name').notNull(),
  brand:      text('brand'),
  category:   text('category').notNull(),                  // "Tops" | "Bottoms" | "Bags" | etc.
  tags:       text('tags').array(),                        // Postgres TEXT[] — ["Tops", "Apparel"]
  imageUrl:   text('image_url'),
  websiteUrl: text('website_url'),
  price:      real('price'),                               // 690.0
  currency:   text('currency'),                            // "INR"
  priority:   text('priority'),                            // "Low" | "Medium" | "High"
  purchased:  boolean('purchased').default(false),

  /** Audit timestamps */
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Jewellery Items ──────────────────────────────────────────
export const jewelleryItems = pgTable('jewellery_items', {
  id:          text('id').primaryKey(),
  name:        text('name').notNull(),
  category:    text('category').notNull(),                 // "Ring" | "Necklace" | "Earrings" | etc.
  subcategory: text('subcategory'),                        // "Casual", "Classy", "Ethnic"
  imageUrl:    text('image_url').notNull(),
  favorite:    boolean('favorite').default(false),

  /** Audit timestamps */
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
