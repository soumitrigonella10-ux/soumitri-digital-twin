// ========================================
// Essays — Editorial Archive Data
// ========================================

import type { Essay, EssayBlock, EssayCategory } from "@/types/editorial";
import { ESSAY_CATEGORIES } from "@/types/editorial";
export type { Essay, EssayBlock, EssayCategory };
export { ESSAY_CATEGORIES };

// All essays are now managed via CMS
export const essays: Essay[] = [];

// Helpers
export function getEssayBySlug(slug: string): Essay | undefined {
  return essays.find((e) => e.slug === slug);
}

export function getEssaysByCategory(category: string): Essay[] {
  if (category === "All") return essays;
  return essays.filter((e) => e.category === category);
}

export function getFeaturedEssays(): Essay[] {
  return essays.filter((e) => e.isFeatured);
}
