"use client";

import { WardrobeItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-clothing.png';
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
