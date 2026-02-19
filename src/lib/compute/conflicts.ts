import type { Filters, Product, Routine } from "@/types";

// ========================================
// Conflict Detection
// ========================================

/** Check for product conflicts (e.g., Tret + AHA/BHA) */
export function checkConflicts(
  selectedRoutines: Routine[],
  products: Product[],
  flags: Filters["flags"]
): string[] {
  const warnings: string[] = [];

  // Collect all PM routines
  const pmRoutines = selectedRoutines.filter(
    (r) => r.timeOfDay === "PM" || r.timeOfDay === "ANY"
  );

  // Get all active ingredients used in PM
  const pmActives = new Set<string>();
  const pmProductIds = new Set<string>();

  pmRoutines.forEach((routine) => {
    routine.steps?.forEach((step) => {
      (step.productIds || []).forEach((pid) => {
        pmProductIds.add(pid);
        const product = products.find((p) => p.id === pid);
        if (product) {
          product.actives?.forEach((a) => pmActives.add(a));
        }
      });
    });
  });

  // Rule 1: Tretinoin + AHA/BHA Peel same PM
  const hasTret = pmProductIds.has("p-tret") || pmActives.has("Tretinoin");
  const hasPeel =
    pmProductIds.has("p-peel-aha-bha") ||
    pmActives.has("AHA") ||
    pmActives.has("BHA");

  if (hasTret && hasPeel) {
    warnings.push(
      "⚠️ Conflict: Tretinoin and AHA/BHA peel should not be used the same night. Risk of irritation and compromised skin barrier."
    );
  }

  // Rule 2: Going Out + Strong Actives in PM
  if (flags.goingOut) {
    const hasStrongActive = Array.from(pmProductIds).some((pid) => {
      const product = products.find((p) => p.id === pid);
      return product?.cautionTags?.includes("strong-active");
    });

    if (hasStrongActive) {
      warnings.push(
        "💡 Suggestion: You're going out tonight. Consider using mild products (peptides) instead of strong actives (tretinoin, peels) for a fresh look."
      );
    }
  }

  // Rule 3: Travel mode notice
  if (flags.travel) {
    warnings.push(
      "✈️ Travel mode: Showing first 2 steps only. Additional steps are hidden to simplify your routine."
    );
  }

  return warnings;
}
