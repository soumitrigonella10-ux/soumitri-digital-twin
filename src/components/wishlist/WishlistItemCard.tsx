"use client";

import Image from "next/image";
import { Heart, Check, ExternalLink } from "lucide-react";
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
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-xl overflow-hidden bg-white shadow-md border border-gray-100",
        item.purchased && "opacity-60 grayscale",
        isSelected && "ring-2 ring-telugu-kavi shadow-lg scale-[1.01]"
      )}
      onClick={() => onSelect(item)}
    >
      {/* Image area with priority badge */}
      <div className="relative bg-gradient-to-br from-[#FDF5E6] to-[#FAF0E0]">
        {item.priority && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg backdrop-blur-sm",
                item.priority === "High" && "bg-red-500/90 text-white border border-red-400",
                item.priority === "Medium" && "bg-amber-500/90 text-white border border-amber-400", 
                item.priority === "Low" && "bg-gray-500/90 text-white border border-gray-400"
              )}
            >
              {item.priority}
            </span>
          </div>
        )}

        {item.imageUrl ? (
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              quality={90}
            />
          </div>
        ) : (
          <div className="aspect-[4/5] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-telugu-kavi/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-telugu-kavi/60" />
            </div>
          </div>
        )}

        {item.purchased && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Details area */}
      <div className="px-4 py-4 space-y-3">
        <div>
          {item.brand && (
            <p className="font-editorial text-[10px] font-bold uppercase tracking-[0.15em] text-telugu-kavi/70 mb-1">
              {item.brand}
            </p>
          )}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-sm font-medium text-gray-900 leading-tight line-clamp-2 flex-1">
              {item.name}
            </h3>
            {item.price != null && (
              <span className="font-editorial text-sm font-bold text-telugu-kavi whitespace-nowrap">
                ₹{item.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.tags?.slice(0, 2).map((tag, index) => (
              <span 
                key={tag}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors",
                  index === 0 
                    ? "bg-telugu-kavi/10 text-telugu-kavi border border-telugu-kavi/20" 
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  );
}
