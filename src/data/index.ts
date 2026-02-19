// ========================================
// Data Layer Barrel Export
//
// Store-managed data (mutable, persisted via Zustand):
//   products, routines, wardrobe, meals, dressings, workouts, wishlist
// ========================================

// Store-managed seed data
export {
  products,
  skinProducts,
  bodyProducts,
  bodySpecificProducts,
  hairProducts,
  wellnessProducts,
} from "./products/index";
export { routines } from "./routines/index";
export { dressings } from "./meals";
export { meals } from "./meals";
export { workouts } from "./workouts";
export { wardrobe, wardrobeTops, wardrobeBottoms, wardrobeDresses, wardrobeOuterwear } from "./wardrobe/index";
export { wishlist } from "./wishlist";
