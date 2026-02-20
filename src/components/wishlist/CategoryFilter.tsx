"use client";

import type { WishlistCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: WishlistCategory[] = [
  "Tops", "Bottoms", "Dresses", "Outerwear", "Suits", "Bags", "Shoes", "Jewellery", "Things",
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mb-8">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-editorial text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
          Filter by Category
        </h3>
      </div>
      
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-2.5 rounded-full border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              selectedCategory === category
                ? "bg-telugu-kavi text-white border-telugu-kavi shadow-md shadow-telugu-kavi/25"
                : "bg-white text-gray-700 border-telugu-marigold/40 hover:border-telugu-kavi hover:text-telugu-kavi hover:bg-telugu-kavi/5 hover:shadow-sm"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
