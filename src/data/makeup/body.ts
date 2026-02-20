import type { Product } from "@/types";

// ========================================
// BODY PRODUCTS — Body Shimmer, Perfume
// ========================================
export const bodyMakeupProducts: Product[] = [
  // -------- Body Shimmer --------
  {
    id: "bodyshimmer-mcaffeine",
    name: "mCaffeine",
    category: "Body Shimmer",
    shade: "Gold",
    displayOrder: 38,
    notes: "Shimmering illuminating body oil",
  },
  {
    id: "bodyshimmer-lakme",
    name: "Lakme",
    category: "Body Shimmer",
    shade: "Bronze",
    displayOrder: 39,
    notes: "Illuminating body lotion",
  },

  // -------- Perfume --------
  {
    id: "perfume-layer",
    name: "Layer'r",
    category: "Perfume",
    shade: "Vanilla",
    displayOrder: 40,
    notes: "Light everyday body mist",
  },
  {
    id: "perfume-victoriasecret",
    name: "Victoria's Secret",
    category: "Perfume",
    shade: "Floral Fruity",
    displayOrder: 41,
    notes: "Limited edition fragrance mist",
  },
  {
    id: "perfume-bathandbodyworks",
    name: "Bath & Body Works",
    category: "Perfume",
    shade: "Floral",
    displayOrder: 42,
    notes: "Fine fragrance mist",
  },
  {
    id: "perfume-oud",
    name: "Traditional Attar",
    category: "Perfume",
    shade: "Oud",
    displayOrder: 43,
    notes: "Concentrated oil-based perfume",
  },
];
