// ========================================
// Makeup Products — Barrel Export
// ========================================
import type { Product } from "@/types";
import { faceProducts } from "./face";
import { eyeProducts } from "./eyes";
import { lipProducts } from "./lips";
import { bodyMakeupProducts } from "./body";

/** Combined array of all makeup products — drop-in replacement for SAMPLE_MAKEUP_PRODUCTS */
export const SAMPLE_MAKEUP_PRODUCTS: Product[] = [
  ...faceProducts,
  ...eyeProducts,
  ...lipProducts,
  ...bodyMakeupProducts,
];

// Re-export sub-category arrays for granular access
export { faceProducts } from "./face";
export { eyeProducts } from "./eyes";
export { lipProducts } from "./lips";
export { bodyMakeupProducts } from "./body";
