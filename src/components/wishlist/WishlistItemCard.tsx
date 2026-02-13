"use client";

import Image from "next/image";
import { Heart, Check, ExternalLink, Tag } from "lucide-react";
import { WishlistItem } from "@/types";
import { cn } from "@/lib/utils";

interface WishlistItemCardProps {
  item: WishlistItem;
  isSelected: boolean;
  onSelect: (item: WishlistItem) => void;
}

export function WishlistItemCard({ item, isSelected, onSelect }: WishlistItemCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer transition-all hover:shadow-xl rounded-2xl overflow-hidden bg-white shadow-md",
        item.purchased && "opacity-75",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={() => onSelect(item)}
    >
      {/* Image area with priority badge */}
      <div className="relative bg-gray-200">
        {item.priority && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-sm border",
                item.priority === "High" && "bg-rose-50/90 text-rose-700 border-rose-200",
                item.priority === "Medium" && "bg-amber-50/90 text-amber-700 border-amber-200",
                item.priority === "Low" && "bg-slate-50/90 text-slate-600 border-slate-200"
              )}
            >
              {item.priority} Priority
            </span>
          </div>
        )}

        {item.imageUrl ? (
          <div className="aspect-[4/5] relative">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
              quality={90}
            />
          </div>
        ) : (
          <div className="aspect-[4/5] flex items-center justify-center">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {item.purchased && (
          <div className="absolute top-4 right-4 z-10">
            <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-0.5 shadow" />
          </div>
        )}
      </div>

      {/* Details area */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div>
          {item.brand && (
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
              {item.brand}
            </p>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold text-base text-gray-900 leading-tight">{item.name}</h3>
            {item.price != null && (
              <span className="text-base font-bold text-gray-900 whitespace-nowrap">
                ₹{item.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {item.tags?.[0] && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                {item.tags[0]}
              </span>
            )}
            {item.tags?.[1] && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 inline-flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {item.tags[1]}
              </span>
            )}
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
