import type { BodyArea, TimeOfDay } from "@/types";
import type { FilterSlice, ImmerSliceCreator } from "../types";
import { format } from "date-fns";

// ========================================
// Default filter state
// ========================================
const defaultFilters = {
  date: new Date(),
  timeOfDay: "ANY" as TimeOfDay,
  flags: { office: false, wfh: true, travel: false, goingOut: false },
  occasion: "Casual",
  bodyAreas: ["UA", "IT", "BL", "IA", "B"] as BodyArea[],
} as const;

// ========================================
// Filter slice — filters + preset save/load
// Uses immer for Object.assign-style updates
// ========================================
export const createFilterSlice: ImmerSliceCreator<FilterSlice> = (set, get) => ({
  filters: { ...defaultFilters },

  setFilters: (update) =>
    set((state) => {
      Object.assign(state.filters, update);
    }),

  resetFilters: () =>
    set((state) => {
      state.filters = { ...defaultFilters, date: new Date() };
    }),

  savePreset: (name) => {
    try {
      const key = `rw-preset:${name}`;
      const filters = get().filters;
      const serialized = { ...filters, date: format(filters.date, "yyyy-MM-dd") };
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(serialized));
      }
    } catch (e) {
      console.error("[Preset] Failed to save preset:", e);
    }
  },

  loadPresetNames: () => {
    try {
      if (typeof window === "undefined") return [];
      return Object.keys(localStorage)
        .filter((k) => k.startsWith("rw-preset:"))
        .map((k) => k.replace("rw-preset:", ""));
    } catch (e) {
      console.error("[Preset] Failed to load preset names:", e);
      return [];
    }
  },

  loadPreset: (name) => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(`rw-preset:${name}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set((state) => {
        Object.assign(state.filters, parsed, { date: new Date(parsed.date) });
      });
    } catch (e) {
      console.error("[Preset] Failed to load preset:", e);
    }
  },

  deletePreset: (name) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`rw-preset:${name}`);
      }
    } catch (e) {
      console.error("[Preset] Failed to delete preset:", e);
    }
  },
});
