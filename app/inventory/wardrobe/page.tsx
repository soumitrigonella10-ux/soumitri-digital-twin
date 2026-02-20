"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import type { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";

const categories = ["Top", "Bottom", "Dress", "Outerwear", "Ethnic", "Shoes", "Bags", "Others", "Innerwear", "Activewear"];

// Bottom chip → subType mapping
const bottomChipMap: Record<string, string[]> = {
  "Jeans": ["Jeans"],
  "Trousers": ["Straight", "Skinny", "Bootcut", "Baggy", "Home", "Semi-fancy", "Fancy", "Casuals"],
  "Skirts": ["Skirt Casual", "Skirt Formal"],
};

function WardrobePageContent() {
  const { data } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Top");
  const [selectedSubchip, setSelectedSubchip] = useState<string | null>(null);

  // Get level-1 sub-chips for the selected category
  const subchips = useMemo(() => {
    const items = data.wardrobe.filter((i) => i.category === selectedCategory);

    if (selectedCategory === "Top" || selectedCategory === "Shoes" || selectedCategory === "Ethnic") {
      const set = new Set(items.map((i) => i.subcategory).filter((s): s is string => Boolean(s)));
      return Array.from(set);
    }
    if (selectedCategory === "Bottom") {
      return ["Jeans", "Trousers", "Skirts"];
    }
    if (selectedCategory === "Dress" || selectedCategory === "Outerwear") {
      const set = new Set(items.map((i) => i.subType).filter((s): s is string => Boolean(s)));
      return Array.from(set);
    }
    return [];
  }, [data.wardrobe, selectedCategory]);

  // Auto-select first sub-chip
  const activeSubchip =
    selectedSubchip && subchips.includes(selectedSubchip)
      ? selectedSubchip
      : subchips[0] ?? null;

  // Filter items
  const filteredItems = useMemo(() => {
    let items = data.wardrobe.filter((i) => i.category === selectedCategory);

    if (activeSubchip) {
      if (selectedCategory === "Top" || selectedCategory === "Shoes" || selectedCategory === "Ethnic") {
        items = items.filter((i) => i.subcategory === activeSubchip);
      } else if (selectedCategory === "Bottom") {
        const allowedSubTypes = bottomChipMap[activeSubchip] || [];
        items = items.filter((i) => i.subType && allowedSubTypes.includes(i.subType));
      } else {
        items = items.filter((i) => i.subType === activeSubchip);
      }
    }

    return items;
  }, [data.wardrobe, selectedCategory, activeSubchip]);

  // Group items by sub-heading when applicable
  const groupedItems = useMemo(() => {
    if (activeSubchip === "Elevated tops") {
      const groups: Record<string, WardrobeItem[]> = {};
      for (const item of filteredItems) {
        const key = item.occasion || "Other";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      }
      return groups;
    }
    if (activeSubchip === "Seasonals") {
      const groups: Record<string, WardrobeItem[]> = {};
      for (const item of filteredItems) {
        const key = item.subType || "Other";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      }
      return groups;
    }
    // Group Trousers and Skirts by subType sub-headings
    if (selectedCategory === "Bottom" && activeSubchip && (activeSubchip === "Trousers" || activeSubchip === "Skirts")) {
      const groups: Record<string, WardrobeItem[]> = {};
      for (const item of filteredItems) {
        const key = item.subType || "Other";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      }
      return groups;
    }
    return null;
  }, [filteredItems, activeSubchip, selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubchip(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-wardrobe flex items-center justify-center">
            <Shirt className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wardrobe</h1>
            <p className="text-gray-500">{data.wardrobe.length} items</p>
          </div>
        </div>
      </header>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              selectedCategory === cat
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-chips (level 1) */}
      {subchips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subchips.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubchip(sub);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activeSubchip === sub
                  ? "bg-orange-500 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      {groupedItems ? (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([group, items]) => (
            <section key={group}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group} ({items.length})
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="lifeos-card-interactive overflow-hidden animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="aspect-square bg-[#FDF5E6] relative flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                          className="object-contain"
                        />
                      ) : (
                        <Shirt className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="lifeos-card-interactive overflow-hidden animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square bg-[#FDF5E6] relative flex items-center justify-center">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    className="object-contain"
                  />
                ) : (
                  <Shirt className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Shirt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No items in this category</p>
        </div>
      )}


    </div>
  );
}

export default function WardrobePage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <WardrobePageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
