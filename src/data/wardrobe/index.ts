import { WardrobeItem } from "@/types";
import { wardrobeTops } from "./tops";
import { wardrobeBottoms } from "./bottoms";
import { wardrobeDresses } from "./dresses";
import { wardrobeOuterwear } from "./outerwear";
import { wardrobeBags } from "./bags";
import { wardrobeShoes } from "./shoes";
import { wardrobeInnerwear } from "./innerwear";
import { wardrobeActivewear } from "./activewear";
import { wardrobeEthnic } from "./ethnic";
import { wardrobeOthers } from "./others";

// Re-export individual category arrays
export { wardrobeTops } from "./tops";
export { wardrobeBottoms } from "./bottoms";
export { wardrobeDresses } from "./dresses";
export { wardrobeOuterwear } from "./outerwear";
export { wardrobeBags } from "./bags";
export { wardrobeShoes } from "./shoes";
export { wardrobeInnerwear } from "./innerwear";
export { wardrobeActivewear } from "./activewear";
export { wardrobeEthnic } from "./ethnic";
export { wardrobeOthers } from "./others";

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
