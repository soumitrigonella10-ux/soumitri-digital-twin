"use client";

import { WishlistItem } from "@/types";
import { WishlistItemCard } from "./WishlistItemCard";
import { Heart } from "lucide-react";

interface WishlistGridProps {
  filteredItems: WishlistItem[];
  groupedItems: Record<string, WishlistItem[]>;
  selectedCategory: string;
  selectedItem: WishlistItem | null;
  onSelectItem: (item: WishlistItem) => void;
  emptyMessage?: string;
}

export function WishlistGrid({
  filteredItems,
  groupedItems,
  selectedCategory,
  selectedItem,
  onSelectItem,
  emptyMessage = "No wishlist items available yet.",
}: WishlistGridProps) {
  if (filteredItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-telugu-marigold/10 flex items-center justify-center">
            <Heart className="h-8 w-8 text-telugu-kavi/60" />
          </div>
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900">No items found</h3>
          <p className="font-editorial text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  if (selectedCategory === "All") {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredItems.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-serif text-2xl font-medium text-gray-900">{category}</h2>
            <p className="font-editorial text-xs uppercase tracking-[0.15em] text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
