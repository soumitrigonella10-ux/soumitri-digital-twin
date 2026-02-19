import { Product } from "@/types";

// ========================================
// FACE PRODUCTS — Primer, CC Cream, Foundation, Concealer, Highlight, Blush, Compact
// ========================================
export const faceProducts: Product[] = [
  // -------------------- PRIMER --------------------
  {
    id: "primer-elf",
    name: "e.l.f",
    category: "Primer",
    shade: "Clear",
    displayOrder: 1,
    notes: "Hydrating gel-based gripping primer",
  },
  {
    id: "primer-lakme",
    name: "Lakme",
    category: "Primer",
    shade: "Universal",
    displayOrder: 2,
    notes: "Blurring silicone primer",
  },

  // -------------------- CC CREAM --------------------
  {
    id: "cccream-lakme",
    name: "Lakme",
    category: "CC Cream",
    shade: "Beige",
    displayOrder: 3,
    notes: "SPF 30 PA++ skin stylist CC cream",
  },

  // -------------------- FOUNDATION --------------------
  {
    id: "foundation-nykaa",
    name: "Nykaa",
    category: "Foundation",
    shade: "Warm Beige",
    displayOrder: 4,
    notes: "Oil-control matte finish foundation",
  },

  // -------------------- CONCEALER --------------------
  {
    id: "concealer-sugar",
    name: "SUGAR",
    category: "Concealer",
    shade: "Medium",
    displayOrder: 5,
    notes: "Full coverage liquid concealer",
  },
  {
    id: "concealer-lakme",
    name: "Lakme",
    category: "Concealer",
    shade: "Light/Medium",
    displayOrder: 6,
    notes: "Stick concealer for spot correction",
  },

  // -------------------- HIGHLIGHT --------------------
  {
    id: "highlighter-insight",
    name: "Insight Cosmetics",
    category: "Highlight",
    shade: "Golden Glow",
    displayOrder: 7,
    notes: "Pressed powder highlighter",
  },
  {
    id: "highlighter-sugar",
    name: "SUGAR",
    category: "Highlight",
    shade: "Gold",
    displayOrder: 8,
    notes: "Powder highlighter",
  },
  {
    id: "highlighter-swissbeauty",
    name: "Swiss Beauty",
    category: "Highlight",
    shade: "Rose Gold",
    displayOrder: 9,
    notes: "Liquid shimmer highlighter",
  },

  // -------------------- BLUSH --------------------
  {
    id: "blush-benefit",
    name: "Benefit Cosmetics",
    category: "Blush",
    shade: "Rose",
    displayOrder: 10,
    notes: "Liquid cheek and lip tint",
  },
  {
    id: "blush-swissbeauty",
    name: "Swiss Beauty",
    category: "Blush",
    shade: "Pink",
    displayOrder: 11,
    notes: "Creamy blendable blush",
  },
  {
    id: "blush-lakme",
    name: "Lakme",
    category: "Blush",
    shade: "Soft Pink",
    displayOrder: 12,
    notes: "Lightweight mousse blush",
  },

  // -------------------- COMPACT --------------------
  {
    id: "compact-elf",
    name: "e.l.f",
    category: "Compact",
    shade: "Translucent",
    displayOrder: 13,
    notes: "Pressed finishing powder",
  },
];
