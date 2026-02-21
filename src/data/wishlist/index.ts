// ========================================
// Wishlist — Barrel Export
// ========================================
import type { WishlistItem } from "@/types";
import { wishlistBasicTops } from "./tops";
import { wishlistElevatedTops } from "./elevated";
import { wishlistBottoms } from "./bottoms";
import { wishlistSeasonals } from "./seasonals";
import { wishlistBags } from "./bags";
import { wishlistShoes } from "./shoes";
import { wishlistSuits } from "./suits";

/** Combined wishlist (drop-in replacement) */
export const wishlist: WishlistItem[] = [
  ...wishlistBasicTops,
  ...wishlistElevatedTops,
  ...wishlistBottoms,
  ...wishlistSeasonals,
  ...wishlistBags,
  ...wishlistShoes,
  ...wishlistSuits,
];

// Re-export sub-category arrays
export { wishlistBasicTops } from "./tops";
export { wishlistElevatedTops } from "./elevated";
export { wishlistBottoms } from "./bottoms";
export { wishlistSeasonals } from "./seasonals";
export { wishlistBags } from "./bags";
export { wishlistShoes } from "./shoes";
export { wishlistSuits } from "./suits";
