"use client";

import { useState, useMemo } from "react";
import { Shirt, Plus, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function InnerwearPageContent() {
  const { data } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Filter for innerwear only - checking if such category exists, otherwise empty
  const innerwearItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Accessories");
  }, [data.wardrobe]);

  // No additional filtering needed since properties don't exist
  const filteredItems = innerwearItems;

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
              <h1 className="text-2xl font-bold text-gray-900">Innerwear</h1>
              <p className="text-gray-500">{innerwearItems.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* No filters needed - simplified wardrobe items */}

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
            <p>No innerwear matches your filters</p>
          </div>
        )}
      </div>

      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Innerwear</span>
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
                <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
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
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.colors.map((color) => (
                      <span key={color} className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">{color}</span>
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

export default function InnerwearPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <InnerwearPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
