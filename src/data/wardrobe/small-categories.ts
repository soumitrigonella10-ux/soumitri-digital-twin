import type { WardrobeItem } from "@/types";

// ========================================
// Small / Empty Wardrobe Categories
// (Shoes, Bags, Innerwear, Activewear, Others)
// ========================================

export const wardrobeShoes: WardrobeItem[] = [];

export const wardrobeBags: WardrobeItem[] = [
  { id: "bags-1", name: "Bag 1", category: "Bags", imageUrl: "https://sjqe9cuzgdublfeb.public.blob.vercel-storage.com/wardrobe-images/bags/bag1.png" },
];

export const wardrobeInnerwear: WardrobeItem[] = [];

export const wardrobeActivewear: WardrobeItem[] = [];

export const wardrobeOthers: WardrobeItem[] = [
  { id: "others-1", name: "Neck collar 1", category: "Others", imageUrl: "https://sjqe9cuzgdublfeb.public.blob.vercel-storage.com/wardrobe-images/others/warmcollar1.png" },
];
