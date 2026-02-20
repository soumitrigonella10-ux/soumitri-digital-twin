import type { WardrobeItem } from "@/types";
import { wardrobeTops } from "./tops";
import { wardrobeBottoms } from "./bottoms";
import { wardrobeDresses } from "./dresses";
import { wardrobeOuterwear } from "./outerwear";
import { wardrobeEthnic } from "./ethnic";
import { wardrobeBags, wardrobeShoes, wardrobeInnerwear, wardrobeActivewear, wardrobeOthers } from "./small-categories";

// Re-export individual category arrays
export { wardrobeTops } from "./tops";
export { wardrobeBottoms } from "./bottoms";
export { wardrobeDresses } from "./dresses";
export { wardrobeOuterwear } from "./outerwear";
export { wardrobeEthnic } from "./ethnic";
export { wardrobeBags, wardrobeShoes, wardrobeInnerwear, wardrobeActivewear, wardrobeOthers } from "./small-categories";

// Combined wardrobe array (backwards-compatible)
export const wardrobe: WardrobeItem[] = [
  ...wardrobeTops,
  ...wardrobeBottoms,
  ...wardrobeDresses,
  ...wardrobeOuterwear,
  ...wardrobeBags,
  ...wardrobeShoes,
  ...wardrobeInnerwear,
  ...wardrobeActivewear,
  ...wardrobeEthnic,
  ...wardrobeOthers,
];
