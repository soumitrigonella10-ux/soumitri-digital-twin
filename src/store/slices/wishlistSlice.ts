import type { StateCreator } from "zustand";
import { wishlist as seedWishlist } from "@/data/index";
import { WishlistItem } from "@/types";
import { mergeById } from "./productSlice";

export interface WishlistSlice {
  data: {
    wishlist: WishlistItem[];
  };
  addWishlistItem: (item: WishlistItem) => void;
  updateWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (id: string) => void;
  markWishlistItemPurchased: (id: string) => void;
}

export const createWishlistSlice: StateCreator<WishlistSlice & Record<string, unknown>, [], [], WishlistSlice> = (set) => ({
  data: {
    wishlist: seedWishlist,
  },
  addWishlistItem: (item) =>
    set((state: any) => ({
      data: { ...state.data, wishlist: [...state.data.wishlist, item] },
    })),
  updateWishlistItem: (item) =>
    set((state: any) => ({
      data: { ...state.data, wishlist: mergeById(state.data.wishlist, [item]) },
    })),
  removeWishlistItem: (id) =>
    set((state: any) => ({
      data: { ...state.data, wishlist: state.data.wishlist.filter((i: WishlistItem) => i.id !== id) },
    })),
  markWishlistItemPurchased: (id) =>
    set((state: any) => ({
      data: {
        ...state.data,
        wishlist: state.data.wishlist.map((item: WishlistItem) =>
          item.id === id
            ? { ...item, purchased: true, purchaseDate: new Date().toISOString() }
            : item
        ),
      },
    })),
});
