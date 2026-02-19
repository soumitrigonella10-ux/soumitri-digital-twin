import type { EnrichedStep, Product, RoutineStep } from "@/types";

// ========================================
// Step Enrichment
// ========================================

/** Enrich steps with product details */
export function enrichSteps(
  steps: RoutineStep[],
  products: Product[]
): EnrichedStep[] {
  return steps.map((step) => ({
    ...step,
    products: (step.productIds || [])
      .map((pid) => products.find((p) => p.id === pid))
      .filter((p): p is Product => p !== undefined),
  }));
}
