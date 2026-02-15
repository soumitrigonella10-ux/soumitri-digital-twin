"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt, Plus, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function TopsPageContent() {
  const { data } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Basics");

  // Filter for tops only
  const topsItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Top");
  }, [data.wardrobe]);

  // Get unique subcategories
  const tabs = useMemo(() => {
    const subcategories = new Set(
      topsItems.map((item) => item.subcategory || "Other")
    );
    return Array.from(subcategories).sort();
  }, [topsItems]);

  // Filter items by active tab
  const filteredItems = useMemo(() => {
    return topsItems.filter(
      (item) => (item.subcategory || "Other") === activeTab
    );
  }, [topsItems, activeTab]);

  // Group filtered items by occasion
  const groupedByOccasion = useMemo(() => {
    const groups: { [key: string]: WardrobeItem[] } = {};
    filteredItems.forEach((item) => {
      const occasion = item.occasion || "Uncategorized";
      if (!groups[occasion]) {
        groups[occasion] = [];
      }
      groups[occasion].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Get sorted occasion keys
  const occasions = useMemo(() => {
    return Object.keys(groupedByOccasion).sort();
  }, [groupedByOccasion]);

  // Set active tab to first available tab on load
  useMemo(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      const firstTab = tabs[0];
      if (firstTab) setActiveTab(firstTab);
    }
  }, [tabs, activeTab]);

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
              <h1 className="text-2xl font-bold text-gray-900">Tops</h1>
              <p className="text-gray-500">{topsItems.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid with Section Headings */}
      <div className="space-y-8">
        {occasions.length > 0 ? (
          occasions.map((occasion) => (
            <section key={occasion} className="animate-slide-in space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {occasion}
              </h2>
              {groupedByOccasion[occasion]!.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedByOccasion[occasion]!.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="lifeos-card-interactive overflow-hidden group cursor-pointer"
                    >
                      {/* Image - Full Height */}
                      <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shirt className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in this category</p>
                </div>
              )}
            </section>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Shirt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tops in this category</p>
          </div>
        )}
      </div>

      {/* Add New Item Button */}
      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add Top</span>
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

export default function TopsPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <TopsPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
