import type { WardrobeItem } from "@/types";

// ========================================
// ETHNIC - TOPS
// ========================================
const ethnicTops: WardrobeItem[] = [
  {
    id: "w-ethnic-top-1",
    name: "Ethnic Top 1",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/top1.png",
  },
  {
    id: "w-ethnic-top-2",
    name: "Ethnic Top 2",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/top2.png",
  },
  {
    id: "w-ethnic-lehenga-top-1",
    name: "Lehenga Top 1",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/lehenga-top1.png",
  },
];

// ========================================
// ETHNIC - BOTTOMS
// ========================================
const ethnicBottoms: WardrobeItem[] = [
  {
    id: "w-ethnic-bottom-1",
    name: "Ethnic Bottom 1",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottom1.png",
  },
  {
    id: "w-ethnic-bottom-2",
    name: "Ethnic Bottom 2",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottom2.png",
  },
  {
    id: "w-ethnic-bottom-3",
    name: "Ethnic Bottom 3",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottom3.png",
  },
  {
    id: "w-ethnic-skirt-1",
    name: "Ethnic Skirt 1",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/skirt1.png",
  },
  {
    id: "w-ethnic-skirt-2",
    name: "Ethnic Skirt 2",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/skirt2.png",
  },
];

// ========================================
// ETHNIC - SETS
// ========================================
const ethnicSets: WardrobeItem[] = [
  {
    id: "w-ethnic-set-1",
    name: "Ethnic Set 1",
    category: "Ethnic",
    subcategory: "Sets",
    imageUrl: "/images/products/ethnic/set1.png",
  },
];

// ========================================
// ETHNIC - DUPPATTAS
// ========================================
const duppattas: WardrobeItem[] = [
  {
    id: "w-ethnic-duppatta-1",
    name: "Duppatta 1",
    category: "Ethnic",
    subcategory: "Duppattas",
    imageUrl: "/images/products/ethnic/duppatta1.png",
  },
];

// ========================================
// ALL ETHNIC - Combined export
// ========================================
export const wardrobeEthnic: WardrobeItem[] = [
  ...ethnicTops,
  ...ethnicBottoms,
  ...ethnicSets,
  ...duppattas,
];
