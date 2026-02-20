import type { WardrobeItem } from "@/types";

// ========================================
// OUTERWEAR - Good ones
// ========================================
const goodOnes: WardrobeItem[] = [
  {
    id: "w-outerwear-good-1",
    name: "Outerwear 1",
    category: "Outerwear",
    subType: "Good ones",
    imageUrl: "/images/products/outerwear/ow-out1.png",
  },
];

// ========================================
// OUTERWEAR - Outer Ethnic
// ========================================
const outerEthnic: WardrobeItem[] = [
  {
    id: "w-outerwear-ethnic-1",
    name: "Ethnic Outer 1",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic1.png",
  },
  {
    id: "w-outerwear-ethnic-2",
    name: "Ethnic Outer 2",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic2.png",
  },
  {
    id: "w-outerwear-ethnic-3",
    name: "Ethnic Outer 3",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic3.png",
  },
  {
    id: "w-outerwear-ethnic-4",
    name: "Ethnic Outer 4",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic4.png",
  },
  {
    id: "w-outerwear-ethnic-5",
    name: "Ethnic Outer 5",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic5.png",
  },
  {
    id: "w-outerwear-ethnic-6",
    name: "Ethnic Outer 6",
    category: "Outerwear",
    subType: "Outer Ethnic",
    imageUrl: "/images/products/outerwear/ow-ethnic6.png",
  },
];

// ========================================
// OUTERWEAR - Outer Warm
// ========================================
const outerWarm: WardrobeItem[] = [
  {
    id: "w-outerwear-warm-1",
    name: "Warm Outer 1",
    category: "Outerwear",
    subType: "Outer warm",
    imageUrl: "/images/products/outerwear/ow-warm1.png",
  },
  {
    id: "w-outerwear-warm-2",
    name: "Warm Outer 2",
    category: "Outerwear",
    subType: "Outer warm",
    imageUrl: "/images/products/outerwear/ow-warm2.png",
  },
  {
    id: "w-outerwear-warm-3",
    name: "Warm Outer 3",
    category: "Outerwear",
    subType: "Outer warm",
    imageUrl: "/images/products/outerwear/ow-warm3.png",
  },
  {
    id: "w-outerwear-warm-4",
    name: "Warm Outer 4",
    category: "Outerwear",
    subType: "Outer warm",
    imageUrl: "/images/products/outerwear/ow-warm4.png",
  },
];

// ========================================
// ALL OUTERWEAR - Combined export
// ========================================
export const wardrobeOuterwear: WardrobeItem[] = [
  ...goodOnes,
  ...outerEthnic,
  ...outerWarm,
];
