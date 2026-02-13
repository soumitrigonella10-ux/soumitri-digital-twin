"use client";

import { useState } from "react";
import Image from "next/image";
import { Tag, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";

interface WardrobeGridProps {
  items: WardrobeItem[];
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  selectable?: boolean;
}

export function WardrobeGrid({
  items,
  selectedIds = [],
  onSelect,
  selectable = false,
}: WardrobeGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No items match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <WardrobeCard
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          {...(onSelect ? { onSelect } : {})}
          selectable={selectable}
        />
      ))}
    </div>
  );
}

// ========================================
// Individual Wardrobe Card
// ========================================
interface WardrobeCardProps {
  item: WardrobeItem;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  selectable: boolean;
}

function WardrobeCard({ item, isSelected, onSelect, selectable }: WardrobeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all cursor-pointer group",
        selectable && "hover:ring-2 hover:ring-gray-300",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={() => selectable && onSelect?.(item.id)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        {!imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Tag className="h-8 w-8" />
          </div>
        )}

        {/* Selection indicator */}
        {selectable && isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full p-2">
              <Star className="h-5 w-5 fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {item.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="text-xs text-gray-500"
            >
              {color}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
