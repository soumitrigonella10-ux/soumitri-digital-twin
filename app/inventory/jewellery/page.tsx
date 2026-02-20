"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Gem, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { jewelleryInventory, getSubcategories } from "@/data/jewellery";
import type { JewelleryItem } from "@/types";

// Jewellery Page Content
function JewelleryPageContent() {
  const [items] = useState<JewelleryItem[]>(jewelleryInventory);
  const [selectedCategory, setSelectedCategory] = useState<string>("Earrings");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);


  const categories = ["Earrings", "Necklace", "Other"];

  // Get subcategories dynamically based on selected category
  const subcategories = useMemo(() => {
    return getSubcategories(selectedCategory);
  }, [selectedCategory]);

  // Auto-select first subcategory when subcategories change
  const activeSubcategory = selectedSubcategory && subcategories.includes(selectedSubcategory)
    ? selectedSubcategory
    : subcategories[0] ?? null;

  // Filter items by category and subcategory
  const filteredItems = useMemo(() => {
    let result = items.filter((i) => i.category === selectedCategory);
    if (activeSubcategory) {
      result = result.filter((i) => i.subcategory === activeSubcategory);
    }
    return result;
  }, [items, selectedCategory, activeSubcategory]);

  // Reset subcategory when main category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-jewellery flex items-center justify-center">
            <Gem className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jewellery</h1>
            <p className="text-gray-500">{items.length} pieces</p>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              selectedCategory === cat
                ? "bg-cyan-100 text-cyan-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory Filter — appears when a main category is selected */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activeSubcategory === sub
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="lifeos-card-interactive overflow-hidden animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image */}
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
                <Gem className="w-8 h-8 text-cyan-300" />
              )}

              {/* Favorite Badge */}
              {item.favorite && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-red-500 fill-current" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Gem className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No jewellery in this category</p>
        </div>
      )}


    </div>
  );
}

export default function JewelleryPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <JewelleryPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
