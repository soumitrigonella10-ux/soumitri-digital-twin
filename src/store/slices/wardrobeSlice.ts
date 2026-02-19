import type { StateCreator } from "zustand";
import { wardrobe as seedWardrobe } from "@/data/index";
import { WardrobeItem } from "@/types";
import { mergeById } from "./dataSlice";

export interface WardrobeSlice {
  data: {
    wardrobe: WardrobeItem[];
  };
  upsertWardrobe: (w: WardrobeItem) => void;
}

export const createWardrobeSlice: StateCreator<WardrobeSlice & Record<string, unknown>, [], [], WardrobeSlice> = (set) => ({
  data: {
    wardrobe: seedWardrobe,
  },
  upsertWardrobe: (w) =>
    set((state) => ({
      data: { ...state.data, wardrobe: mergeById(state.data.wardrobe, [w]) },
    })),
});
