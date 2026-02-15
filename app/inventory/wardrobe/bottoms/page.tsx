"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt, Plus, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function BottomsPageContent() {
  const { data } = useAppStore();
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedSubType, setSelectedSubType] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Type filter options
  const typeOptions = ["All", "Basics", "Elevated", "Seasonals"];
  
  // Sub-type options for each category
  const basicsSubTypes = ["All", "Tanks", "Tees", "Full fitted", "Sheer"];
  const elevatedSubTypes = ["All", "Core Formals", "Semi-fancy", "Fancy", "Casuals", "Ethnic Casuals"];
  const seasonalsSubTypes = ["All", "Summer", "Winter"];

  // Filter for bottoms only
  const bottomsItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Bottom");
  }, [data.wardrobe]);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = [...bottomsItems];

    if (selectedType !== "All") {
      items = items.filter((i) => i.styleType === selectedType || i.vibeTags?.includes(selectedType));
    }
    if (selectedSubType !== "All") {
      items = items.filter((i) => i.subType === selectedSubType);
    }

    return items;
  }, [bottomsItems, selectedType, selectedSubType]);

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
              <h1 className="text-2xl font-bold text-gray-900">Bottoms</h1>
              <p className="text-gray-500">{bottomsItems.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedSubType("All");
            }}
            className="px-3 py-1.5 rounded-xl text-sm bg-gray-100 border-0 text-gray-600"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {selectedType === "Basics" && (
          <div className="flex flex-wrap gap-2">
            {basicsSubTypes.map((subType) => (
              <button
                key={subType}
                onClick={() => setSelectedSubType(subType)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  selectedSubType === subType
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {subType}
              </button>
            ))}
          </div>
        )}

        {selectedType === "Elevated" && (
          <div className="flex flex-wrap gap-2">
            {elevatedSubTypes.map((subType) => (
              <button
                key={subType}
                onClick={() => setSelectedSubType(subType)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  selectedSubType === subType
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {subType}
              </button>
            ))}
          </div>
        )}

        {selectedType === "Seasonals" && (
          <div className="flex flex-wrap gap-2">
            {seasonalsSubTypes.map((subType) => (
              <button
                key={subType}
                onClick={() => setSelectedSubType(subType)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  selectedSubType === subType
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {subType}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="space-y-8">
        <section className="animate-slide-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="lifeos-card-interactive overflow-hidden group"
              >
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
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.colors.slice(0, 2).map((color) => (
                      <span key={color} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shirt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No bottoms match your filters</p>
          </div>
        )}
      </div>

      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Bottom</span>
      </button>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square bg-gray-100 relative">
              {selectedItem.imageUrl ? (
                <Image src={selectedItem.imageUrl} alt={selectedItem.name} fill sizes="(max-width: 768px) 100vw, 448px" className="object-cover" />
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
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{selectedItem.name}</h2>
              <div className="space-y-4">
                {selectedItem.styleType && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Type</p>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {selectedItem.styleType}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.colors.map((color) => (
                      <span key={color} className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">{color}</span>
                    ))}
                  </div>
                </div>
                {selectedItem.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Notes</p>
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

export default function BottomsPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <BottomsPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
