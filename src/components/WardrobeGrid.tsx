"use client";

import type { WardrobeItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface WardrobeGridProps {
  items: WardrobeItem[];
}

export function WardrobeGrid({ items }: WardrobeGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No items match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                onError={() => {
                  // Handle with a fallback component or state
                }}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                {item.occasion && (
                  <Badge variant="secondary" className="text-xs">
                    {item.occasion}
                  </Badge>
                )}
              </div>
              {item.subcategory && (
                <p className="text-xs text-muted-foreground">{item.subcategory}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
