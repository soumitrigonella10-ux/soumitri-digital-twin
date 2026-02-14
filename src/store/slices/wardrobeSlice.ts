import type { StateCreator } from "zustand";
import { wardrobe as seedWardrobe } from "@/data/index";
import { Outfit, WardrobeItem } from "@/types";
import { mergeById } from "./productSlice";

export interface WardrobeSlice {
  data: {
    wardrobe: WardrobeItem[];
    outfits: Outfit[];
  };
  upsertWardrobe: (w: WardrobeItem) => void;
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: string) => void;
}

export const createWardrobeSlice: StateCreator<WardrobeSlice & Record<string, unknown>, [], [], WardrobeSlice> = (set) => ({
  data: {
    wardrobe: seedWardrobe,
    outfits: [],
  },
  upsertWardrobe: (w) =>
    set((state) => ({
      data: { ...state.data, wardrobe: mergeById(state.data.wardrobe, [w]) },
    })),
  addOutfit: (outfit) =>
    set((state) => ({
      data: { ...state.data, outfits: [...state.data.outfits, outfit] },
    })),
  removeOutfit: (id) =>
    set((state) => ({
      data: { ...state.data, outfits: state.data.outfits.filter((o) => o.id !== id) },
    })),
});
