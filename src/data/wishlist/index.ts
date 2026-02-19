// ========================================
// Wishlist — Barrel Export
// ========================================
import { WishlistItem } from "@/types";
import { wishlistBasicTops } from "./tops";
import { wishlistElevatedTops } from "./elevated";
import { wishlistBottoms } from "./bottoms";
import { wishlistSeasonals } from "./seasonals";

/** Combined wishlist (drop-in replacement) */
export const wishlist: WishlistItem[] = [
  ...wishlistBasicTops,
  ...wishlistElevatedTops,
  ...wishlistBottoms,
  ...wishlistSeasonals,
];

// Re-export sub-category arrays
export { wishlistBasicTops } from "./tops";
export { wishlistElevatedTops } from "./elevated";
export { wishlistBottoms } from "./bottoms";
export { wishlistSeasonals } from "./seasonals";
