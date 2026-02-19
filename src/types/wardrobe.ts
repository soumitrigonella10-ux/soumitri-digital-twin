// ========================================
// Wardrobe & Wishlist Domain Types
// ========================================

export type WardrobeCategory =
  | "Top"
  | "Bottom"
  | "Dress"
  | "Shoes"
  | "Bags"
  | "Innerwear"
  | "Activewear"
  | "Ethnic"
  | "Outerwear"
  | "Others";

export type WishlistCategory =
  | "Tops"
  | "Bottoms"
  | "Dresses"
  | "Outerwear"
  | "Suits"
  | "Bags"
  | "Shoes"
  | "Jewellery"
  | "Things";

// ========================================
// Wardrobe Item
// ========================================
export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  subcategory?: string;
  occasion?: string;
  imageUrl: string;
  subType?: string;
}

// ========================================
// Wishlist Item
// ========================================
export interface WishlistItem {
  id: string;
  name: string;
  brand?: string;
  category: WishlistCategory;
  tags?: string[];
  imageUrl?: string;
  websiteUrl?: string;
  price?: number;
  currency?: string;
  priority?: "Low" | "Medium" | "High";
  purchased?: boolean;
}

// ========================================
// Jewellery Item
// ========================================
export interface JewelleryItem {
  id: string;
  name: string;
  category: "Ring" | "Necklace" | "Bracelet" | "Earrings" | "Watch" | "Other";
  subcategory?: string;
  imageUrl: string;
  favorite?: boolean;
}
