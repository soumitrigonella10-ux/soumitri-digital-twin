import type { Product } from "@/types";

// ========================================
// LIP PRODUCTS — Lip Glow, Lip Tint, Lip Stick, Lip Gloss
// ========================================
export const lipProducts: Product[] = [
  // -------- Lip Glow --------
  {
    id: "lipglow-dior",
    name: "Dior",
    category: "Lip Glow",
    shade: "Pink",
    displayOrder: 33,
    notes: "Color reviving lip balm",
  },

  // -------- Lip Tint --------
  {
    id: "liptint-benefit",
    name: "Benefit Cosmetics",
    category: "Lip Tint",
    shade: "Rose",
    displayOrder: 34,
    notes: "Liquid lip and cheek tint",
  },

  // -------- Lip Stick --------
  {
    id: "lipstick-mac",
    name: "MAC",
    category: "Lip Stick",
    shade: "Red",
    displayOrder: 35,
    notes: "Classic matte bullet lipstick",
  },
  {
    id: "lipstick-dior",
    name: "Dior",
    category: "Lip Stick",
    shade: "Nude Pink",
    displayOrder: 36,
    notes: "Satin finish couture lipstick",
  },

  // -------- Lip Gloss --------
  {
    id: "lipgloss-dior",
    name: "Dior",
    category: "Lip Gloss",
    shade: "Pink Gloss",
    displayOrder: 37,
    notes: "Plumping high-shine gloss",
  },
];
