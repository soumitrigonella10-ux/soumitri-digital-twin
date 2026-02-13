"use client";

import { WishlistItem } from "@/types";
import { WishlistItemCard } from "./WishlistItemCard";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedCategory === "All") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
}
