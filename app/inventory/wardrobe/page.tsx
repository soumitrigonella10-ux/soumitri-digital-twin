"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt, Plus, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";

function WardrobePageContent() {
  const { data } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSeasonalType, setSelectedSeasonalType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(data.wardrobe.map((w) => w.category));
    return ["All", ...Array.from(cats)];
  }, [data.wardrobe]);

  // Get subcategories for the selected category
  const subcategories = useMemo(() => {
    if (selectedCategory !== "Top") return [];
    
    // Get unique subcategories for tops
    const subcats = new Set(data.wardrobe
      .filter(item => item.category === "Top")
      .map(item => item.subcategory)
      .filter((s): s is string => Boolean(s))
    );
    
    return Array.from(subcats);
  }, [data.wardrobe, selectedCategory]);

  // Get seasonal types (Summer/Winter) when Seasonals is selected
  const seasonalTypes = useMemo(() => {
    if (selectedSubcategory !== "Seasonals") return [];
    
    const types = new Set(data.wardrobe
      .filter(item => item.subcategory === "Seasonals")
      .map(item => item.subType)
      .filter(Boolean)
    );
    
    return Array.from(types);
  }, [data.wardrobe, selectedSubcategory]);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = [...data.wardrobe];

    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
      
      if (selectedSubcategory) {
        items = items.filter((i) => i.subcategory === selectedSubcategory);
        
        if (selectedSeasonalType) {
          items = items.filter((i) => i.subType === selectedSeasonalType);
        }
      }
    }

    return items;
  }, [data.wardrobe, selectedCategory, selectedSubcategory, selectedSeasonalType]);

  // Group by category for display
  const groupedItems = useMemo(() => {
    if (selectedSeasonalType) {
      // Show only the selected seasonal type
      return { [selectedSeasonalType]: filteredItems };
    } else if (selectedSubcategory && selectedSubcategory !== "Seasonals") {
      return { [selectedSubcategory]: filteredItems };
    } else if (selectedCategory !== "All" && !selectedSubcategory) {
      return { [selectedCategory]: filteredItems };
    }
    
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category]!.push(item);
      return acc;
    }, {} as Record<string, WardrobeItem[]>);
  }, [filteredItems, selectedCategory, selectedSubcategory, selectedSeasonalType]);

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
      <div className="flex flex-col gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory(null); // Clear subcategory when selecting category
                setSelectedSeasonalType(null); // Clear seasonal type
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                selectedCategory === cat && !selectedSubcategory
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Subcategory Pills for Tops*/}
        {selectedCategory === "Top" && subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-orange-200">
            <span className="text-sm font-medium text-gray-500 self-center px-2">Sections:</span>
            {subcategories.map((subcat) => {
              const itemCount = data.wardrobe.filter(item => 
                item.category === "Top" && item.subcategory === subcat
              ).length;
              
              return (
                <button
                  key={subcat}
                  onClick={() => {
                    setSelectedSubcategory(subcat);
                    setSelectedSeasonalType(null); // Clear seasonal type when selecting new subcategory
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                    selectedSubcategory === subcat
                      ? subcat === "Seasonals"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                      : subcat === "Seasonals"
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {subcat} ({itemCount})
                </button>
              );
            })}
          </div>
        )}

        {/* Seasonal Type Pills (Summer/Winter) when Seasonals is selected */}
        {selectedSubcategory === "Seasonals" && seasonalTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-8 border-l-2 border-green-200">
            <span className="text-sm font-medium text-gray-500 self-center px-2">Season:</span>
            {seasonalTypes.map((seasonType) => {
              const itemCount = data.wardrobe.filter(item => 
                item.subcategory === "Seasonals" && item.subType === seasonType
              ).length;
              
              return (
                <button
                  key={seasonType}
                  onClick={() => setSelectedSeasonalType(seasonType)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                    selectedSeasonalType === seasonType
                      ? seasonType === "Summer"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                      : seasonType === "Summer"
                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                >
                  {seasonType} ({itemCount})
                </button>
              );
            })}
          </div>
        )}

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
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shirt className="w-12 h-12 text-gray-300" />
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
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover"
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
              </div>
            </div>
          </div>
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
