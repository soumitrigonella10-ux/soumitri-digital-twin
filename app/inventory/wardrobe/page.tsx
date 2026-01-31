"use client";

import { useState, useMemo } from "react";
import { Shirt, Plus, Heart, Filter, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";

export default function WardrobePage() {
  const { data } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Get unique categories and occasions
  const categories = useMemo(() => {
    const cats = new Set(data.wardrobe.map((w) => w.category));
    return ["All", ...Array.from(cats)];
  }, [data.wardrobe]);

  const occasions = useMemo(() => {
    const occs = new Set(data.wardrobe.flatMap((w) => w.occasions));
    return ["All", ...Array.from(occs)];
  }, [data.wardrobe]);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = [...data.wardrobe];

    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    if (selectedOccasion !== "All") {
      items = items.filter((i) => i.occasions.includes(selectedOccasion));
    }
    if (showFavoritesOnly) {
      items = items.filter((i) => i.favorite);
    }

    return items;
  }, [data.wardrobe, selectedCategory, selectedOccasion, showFavoritesOnly]);

  // Group by category for display
  const groupedItems = useMemo(() => {
    if (selectedCategory !== "All") {
      return { [selectedCategory]: filteredItems };
    }
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, WardrobeItem[]>);
  }, [filteredItems, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-category-wardrobe flex items-center justify-center">
              <Shirt className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wardrobe</h1>
              <p className="text-gray-500">{data.wardrobe.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

        <div className="flex-1" />

        {/* Occasion Filter */}
        <select
          value={selectedOccasion}
          onChange={(e) => setSelectedOccasion(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-sm bg-gray-100 border-0 text-gray-600"
        >
          {occasions.map((occ) => (
            <option key={occ} value={occ}>
              {occ === "All" ? "All Occasions" : occ}
            </option>
          ))}
        </select>

        {/* Favorites Toggle */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
            showFavoritesOnly
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Heart className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} />
          Favorites
        </button>
      </div>

      {/* Items Grid */}
      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <section key={category} className="animate-slide-in">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              {category} ({items.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="lifeos-card-interactive overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shirt className="w-12 h-12 text-gray-300" />
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {item.favorite && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.colors.slice(0, 2).map((color) => (
                        <span
                          key={color}
                          className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shirt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No items match your filters</p>
          </div>
        )}
      </div>

      {/* Add New Item Button */}
      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Wardrobe Item</span>
      </button>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt className="w-24 h-24 text-gray-300" />
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedItem.name}
                </h2>
                {selectedItem.favorite && (
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Category
                  </p>
                  <p className="text-gray-900">{selectedItem.category}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Colors
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.colors.map((color) => (
                      <span
                        key={color}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Occasions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.occasions.map((occ) => (
                      <span
                        key={occ}
                        className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Vibe
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.vibeTags.map((vibe) => (
                      <span
                        key={vibe}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-sm"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedItem.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Notes
                    </p>
                    <p className="text-gray-600 text-sm">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
