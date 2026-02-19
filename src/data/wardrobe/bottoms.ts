import { WardrobeItem } from "@/types";

// ========================================
// BOTTOMS - BASICS
// ========================================
const basicBottoms: WardrobeItem[] = [
  {
    id: "w-basics-bottom-straight",
    name: "Straight Bottom",
    category: "Bottom",
    subType: "Straight",
    imageUrl: "/images/products/bottonwear/bottom-straight.png",
  },
  {
    id: "w-basics-bottom-straight1",
    name: "Straight Bottom 1",
    category: "Bottom",
    subType: "Straight",
    imageUrl: "/images/products/bottonwear/bottom-straight1.png",
  },
  {
    id: "w-basics-bottom-straight-gray",
    name: "Straight Bottom Gray",
    category: "Bottom",
    subType: "Straight",
    imageUrl: "/images/products/bottonwear/bottom-straight-gray.png",
  },
  {
    id: "w-basics-bottom-skinny",
    name: "Skinny Bottom",
    category: "Bottom",
    subType: "Skinny",
    imageUrl: "/images/products/bottonwear/bottom-skinny.png",
  },
  {
    id: "w-basics-bottom-skinny1",
    name: "Skinny Bottom 1",
    category: "Bottom",
    subType: "Skinny",
    imageUrl: "/images/products/bottonwear/bottom-skinny1.png",
  },
  {
    id: "w-basics-bottom-bootcut",
    name: "Bootcut Bottom",
    category: "Bottom",
    subType: "Bootcut",
    imageUrl: "/images/products/bottonwear/bottom-bootcut.png",
  },
  {
    id: "w-basics-bottom-bootcut2",
    name: "Bootcut Bottom 2",
    category: "Bottom",
    subType: "Bootcut",
    imageUrl: "/images/products/bottonwear/bottom-bootcut2.png",
  },
  {
    id: "w-basics-bottom-baggy",
    name: "Baggy Bottom",
    category: "Bottom",
    subType: "Baggy",
    imageUrl: "/images/products/bottonwear/bottom-baggy.png",
  },
  {
    id: "w-basics-jeans-blue-straight",
    name: "Jeans Blue Straight",
    category: "Bottom",
    subType: "Jeans",
    imageUrl: "/images/products/bottonwear/jeans-blue-straight.png",
  },
  {
    id: "w-basics-jeans-blue-skinny",
    name: "Jeans Blue Skinny",
    category: "Bottom",
    subType: "Jeans",
    imageUrl: "/images/products/bottonwear/jeans-blue-skinny.png",
  },
  {
    id: "w-basics-jeans-blue-baggy",
    name: "Jeans Blue Baggy",
    category: "Bottom",
    subType: "Jeans",
    imageUrl: "/images/products/bottonwear/jeans-blue-baggy.png",
  },
  {
    id: "w-basics-bottom-green-straight",
    name: "Green Straight Bottom",
    category: "Bottom",
    subType: "Home",
    imageUrl: "/images/products/bottonwear/bottom-green-straight.png",
  },
  {
    id: "w-basics-bottom-green-home",
    name: "Green Home Bottom",
    category: "Bottom",
    subType: "Home",
    imageUrl: "/images/products/bottonwear/bottom-green-home.png",
  },
  {
    id: "w-basics-bottom-green-bootcut",
    name: "Green Bootcut Bottom",
    category: "Bottom",
    subType: "Home",
    imageUrl: "/images/products/bottonwear/bottom-green-bootcut.png",
  },
];

// ========================================
// BOTTOMS - ELEVATED
// ========================================
const elevatedBottoms: WardrobeItem[] = [
  {
    id: "w-elevated-bottom-textured",
    name: "Textured Bottom",
    category: "Bottom",
    subType: "Semi-fancy",
    imageUrl: "/images/products/bottonwear/bottom-textured.png",
  },
  {
    id: "w-elevated-bottom-unique",
    name: "Unique Bottom",
    category: "Bottom",
    subType: "Fancy",
    imageUrl: "/images/products/bottonwear/bottom-unique.png",
  },
  {
    id: "w-elevated-bottom-woolen-straight",
    name: "Woolen Straight Bottom",
    category: "Bottom",
    subType: "Casuals",
    imageUrl: "/images/products/bottonwear/bottom-woolen-straight.png",
  },
  {
    id: "w-elevated-bottom-woolen-gray",
    name: "Woolen Gray Bottom",
    category: "Bottom",
    subType: "Casuals",
    imageUrl: "/images/products/bottonwear/bottom-woolen-gray.png",
  },
];

// ========================================
// BOTTOMS - SKIRTS CASUAL
// ========================================
const skirtsCasual: WardrobeItem[] = [
  {
    id: "w-seasonal-skirt-1",
    name: "Skirt 1",
    category: "Bottom",
    subType: "Skirt Casual",
    imageUrl: "/images/products/bottonwear/skirt1.png",
  },
  {
    id: "w-seasonal-skirt-2",
    name: "Skirt 2",
    category: "Bottom",
    subType: "Skirt Casual",
    imageUrl: "/images/products/bottonwear/skirt2.png",
  },
  {
    id: "w-seasonal-skirt-3",
    name: "Skirt 3",
    category: "Bottom",
    subType: "Skirt Casual",
    imageUrl: "/images/products/bottonwear/skirt3.png",
  },
];

// ========================================
// BOTTOMS - SKIRTS FORMAL
// ========================================
const skirtsFormal: WardrobeItem[] = [
  {
    id: "w-seasonal-skirt-4",
    name: "Skirt 4",
    category: "Bottom",
    subType: "Skirt Formal",
    imageUrl: "/images/products/bottonwear/skirt4.png",
  },
  {
    id: "w-seasonal-skirt-5",
    name: "Skirt 5",
    category: "Bottom",
    subType: "Skirt Formal",
    imageUrl: "/images/products/bottonwear/skirt5.png",
  },
];

// ========================================
// ALL BOTTOMS - Combined export
// ========================================
export const wardrobeBottoms: WardrobeItem[] = [
  ...basicBottoms,
  ...elevatedBottoms,
  ...skirtsCasual,
  ...skirtsFormal,
];
