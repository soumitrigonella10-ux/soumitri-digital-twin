// ========================================
// Slice barrel exports
// ========================================
export { createDataSlice, mergeById } from "./dataSlice";
export { createFilterSlice } from "./filterSlice";
export { createCompletionSlice } from "./completionSlice";

// Re-export types from central types module
export type {
  AppData,
  AppState,
  DataSlice,
  FilterSlice,
  CompletionSlice,
  ProductCompletionMap,
  ImmerSliceCreator,
} from "../types";
