import { WardrobeItem } from "@/types";

// ========================================
// ETHNIC - TOPS
// ========================================
const ethnicTops: WardrobeItem[] = [
  {
    id: "w-ethnic-top-kurti-1",
    name: "Ethnic Kurti 1",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/tops/kurti1.png",
  },
  {
    id: "w-ethnic-top-kurti-2",
    name: "Ethnic Kurti 2",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/tops/kurti2.png",
  },
  {
    id: "w-ethnic-top-blouse-1",
    name: "Ethnic Blouse 1",
    category: "Ethnic",
    subcategory: "Tops",
    imageUrl: "/images/products/ethnic/tops/blouse1.png",
  },
];

// ========================================
// ETHNIC - BOTTOMS
// ========================================
const ethnicBottoms: WardrobeItem[] = [
  {
    id: "w-ethnic-bottom-leggings-1",
    name: "Ethnic Leggings 1",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottoms/leggings1.png",
  },
  {
    id: "w-ethnic-bottom-palazzo-1",
    name: "Palazzo Pants 1",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottoms/palazzo1.png",
  },
  {
    id: "w-ethnic-bottom-churidar-1",
    name: "Churidar 1",
    category: "Ethnic",
    subcategory: "Bottoms",
    imageUrl: "/images/products/ethnic/bottoms/churidar1.png",
  },
];

// ========================================
// ETHNIC - SETS
// ========================================
const ethnicSets: WardrobeItem[] = [
  {
    id: "w-ethnic-set-anarkali-1",
    name: "Anarkali Set 1",
    category: "Ethnic",
    subcategory: "Sets",
    imageUrl: "/images/products/ethnic/sets/anarkali1.png",
  },
  {
    id: "w-ethnic-set-sharara-1",
    name: "Sharara Set 1",
    category: "Ethnic",
    subcategory: "Sets",
    imageUrl: "/images/products/ethnic/sets/sharara1.png",
  },
  {
    id: "w-ethnic-set-lehenga-1",
    name: "Lehenga Set 1",
    category: "Ethnic",
    subcategory: "Sets",
    imageUrl: "/images/products/ethnic/sets/lehenga1.png",
  },
];

// ========================================
// ETHNIC - SAREES + BLOUSES
// ========================================
const sareesAndBlouses: WardrobeItem[] = [
  {
    id: "w-ethnic-saree-silk-1",
    name: "Silk Saree 1",
    category: "Ethnic",
    subcategory: "Sarees+Blouses",
    imageUrl: "/images/products/ethnic/sarees/silk1.png",
  },
  {
    id: "w-ethnic-saree-cotton-1",
    name: "Cotton Saree 1",
    category: "Ethnic",
    subcategory: "Sarees+Blouses",
    imageUrl: "/images/products/ethnic/sarees/cotton1.png",
  },
  {
    id: "w-ethnic-blouse-silk-1",
    name: "Silk Blouse 1",
    category: "Ethnic",
    subcategory: "Sarees+Blouses",
    imageUrl: "/images/products/ethnic/blouses/silk1.png",
  },
];

// ========================================
// ETHNIC - DUPPATTAS
// ========================================
const duppattas: WardrobeItem[] = [
  {
    id: "w-ethnic-dupatta-chiffon-1",
    name: "Chiffon Dupatta 1",
    category: "Ethnic",
    subcategory: "Duppattas",
    imageUrl: "/images/products/ethnic/duppattas/chiffon1.png",
  },
  {
    id: "w-ethnic-dupatta-silk-1",
    name: "Silk Dupatta 1",
    category: "Ethnic",
    subcategory: "Duppattas",
    imageUrl: "/images/products/ethnic/duppattas/silk1.png",
  },
  {
    id: "w-ethnic-dupatta-cotton-1",
    name: "Cotton Dupatta 1",
    category: "Ethnic",
    subcategory: "Duppattas",
    imageUrl: "/images/products/ethnic/duppattas/cotton1.png",
  },
];

// ========================================
// ALL ETHNIC - Combined export
// ========================================
export const wardrobeEthnic: WardrobeItem[] = [
  ...ethnicTops,
  ...ethnicBottoms,
  ...ethnicSets,
  ...sareesAndBlouses,
  ...duppattas,
];
