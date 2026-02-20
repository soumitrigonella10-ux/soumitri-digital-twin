import type { Product } from "@/types";
import { skinProducts } from "./skin";
import { bodyProducts } from "./body";
import { bodySpecificProducts } from "./body-specifics";
import { hairProducts } from "./hair";
import { wellnessProducts } from "./wellness";

// Combined products array for backwards compatibility
export const products: Product[] = [
  ...skinProducts,
  ...bodyProducts,
  ...bodySpecificProducts,
  ...hairProducts,
  ...wellnessProducts,
];

// Re-export individual category arrays
export {
  skinProducts,
  bodyProducts,
  bodySpecificProducts,
  hairProducts,
  wellnessProducts,
};
