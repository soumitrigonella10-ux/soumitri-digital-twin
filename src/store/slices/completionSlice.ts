import { subDays, parse, isValid } from "date-fns";
import type { CompletionSlice, ImmerSliceCreator } from "../types";

// Re-export for backward compatibility
export type { ProductCompletionMap } from "../types";

// ========================================
// Completion slice — step & product tracking + auto-cleanup
// Uses immer for clean deeply-nested mutations
// ========================================
export const createCompletionSlice: ImmerSliceCreator<CompletionSlice> = (set, get) => ({
  completions: {},

  toggleStepCompletion: (dateKey, sectionKey, routineId, stepOrder, value) =>
    set((state) => {
      if (!state.completions[dateKey]) state.completions[dateKey] = {};
      if (!state.completions[dateKey][sectionKey])
        state.completions[dateKey][sectionKey] = {};
      if (!state.completions[dateKey][sectionKey][routineId])
        state.completions[dateKey][sectionKey][routineId] = {};
      state.completions[dateKey][sectionKey][routineId][stepOrder] = value;
    }),

  getSectionCompletion: (dateKey, sectionKey, totalSteps) => {
    const completions = get().completions[dateKey]?.[sectionKey];
    if (!completions || totalSteps === 0) return 0;
    let doneCount = 0;
    Object.values(completions).forEach((routineSteps) => {
      Object.values(routineSteps).forEach((done) => {
        if (done) doneCount++;
      });
    });
    return Math.round((doneCount / totalSteps) * 100);
  },

  getStepCompletion: (dateKey, sectionKey, routineId, stepOrder) => {
    return get().completions[dateKey]?.[sectionKey]?.[routineId]?.[stepOrder] ?? false;
  },

  productCompletions: {},

  toggleProductCompletion: (dateKey, productId) =>
    set((state) => {
      if (!state.productCompletions[dateKey]) state.productCompletions[dateKey] = {};
      state.productCompletions[dateKey][productId] =
        !state.productCompletions[dateKey][productId];
    }),

  getProductCompletion: (dateKey, productId) => {
    return get().productCompletions[dateKey]?.[productId] ?? false;
  },

  // Prune completion entries older than N days to prevent localStorage bloat
  cleanupStaleCompletions: (daysToKeep = 30) =>
    set((state) => {
      const cutoff = subDays(new Date(), daysToKeep);
      const pruneKeys = (map: Record<string, unknown>) => {
        for (const dateKey of Object.keys(map)) {
          const date = parse(dateKey, "yyyy-MM-dd", new Date());
          if (isValid(date) && date < cutoff) {
            delete map[dateKey];
          }
        }
      };
      pruneKeys(state.completions);
      pruneKeys(state.productCompletions);
    }),
});
