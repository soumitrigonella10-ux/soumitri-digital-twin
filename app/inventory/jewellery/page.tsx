"use client";

import { useState } from "react";
import { Gem, Plus, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

// Jewellery type (to be added to types.ts later)
interface JewelleryItem {
  id: string;
  name: string;
  category: "Ring" | "Necklace" | "Bracelet" | "Earrings" | "Watch" | "Other";
  imageUrl: string;
  material: string;
  occasions: string[];
  favorite?: boolean;
  notes?: string;
}

// Sample jewellery data
const sampleJewellery: JewelleryItem[] = [
  {
    id: "j-1",
    name: "Gold Hoop Earrings",
    category: "Earrings",
    imageUrl: "",
    material: "14k Gold",
    occasions: ["Daily", "Work", "Casual"],
    favorite: true,
  },
  {
    id: "j-2",
    name: "Pearl Necklace",
    category: "Necklace",
    imageUrl: "",
    material: "Freshwater Pearls",
    occasions: ["Formal", "Date"],
    favorite: true,
  },
  {
    id: "j-3",
    name: "Silver Ring Stack",
    category: "Ring",
    imageUrl: "",
    material: "Sterling Silver",
    occasions: ["Daily", "Casual"],
    favorite: false,
  },
  {
    id: "j-4",
    name: "Tennis Bracelet",
    category: "Bracelet",
    imageUrl: "",
    material: "White Gold & Diamonds",
    occasions: ["Formal", "Special"],
    favorite: true,
  },
];

// Jewellery Page Content
function JewelleryPageContent() {
  const [items] = useState<JewelleryItem[]>(sampleJewellery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<JewelleryItem | null>(null);

  const categories = ["All", "Ring", "Necklace", "Bracelet", "Earrings", "Watch", "Other"];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((i) => i.category === selectedCategory);

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
            onClick={() => setSelectedCategory(cat)}
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

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="lifeos-card-interactive overflow-hidden animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-cyan-50 to-gray-100 relative flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gem className="w-12 h-12 text-cyan-300" />
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
              <p className="text-xs text-gray-500 mt-0.5">{item.material}</p>
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

      {/* Add New Item Button */}
      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Jewellery Piece</span>
      </button>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-cyan-50 to-gray-100 rounded-t-2xl relative flex items-center justify-center">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <Gem className="w-24 h-24 text-cyan-300" />
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
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedItem.category}</p>
                </div>
                {selectedItem.favorite && (
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Material
                  </p>
                  <p className="text-gray-900">{selectedItem.material}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Occasions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.occasions.map((occ) => (
                      <span
                        key={occ}
                        className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-sm"
                      >
                        {occ}
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

export default function JewelleryPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <JewelleryPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
