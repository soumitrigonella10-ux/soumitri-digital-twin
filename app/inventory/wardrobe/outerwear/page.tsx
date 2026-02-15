"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const TABS = ["Good ones", "Outer Ethnic", "Outer warm"] as const;
type OuterwearTab = (typeof TABS)[number];

function OuterwearPageContent() {
  const { data } = useAppStore();
  const [activeTab, setActiveTab] = useState<OuterwearTab>("Good ones");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Filter for outerwear only
  const outerwearItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Outerwear");
  }, [data.wardrobe]);

  // Items for the active tab
  const filteredItems = useMemo(() => {
    return outerwearItems.filter((item) => item.subType === activeTab);
  }, [outerwearItems, activeTab]);

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<OuterwearTab, number> = { "Good ones": 0, "Outer Ethnic": 0, "Outer warm": 0 };
    outerwearItems.forEach((item) => {
      const tab = item.subType as OuterwearTab;
      if (tab in counts) counts[tab]++;
    });
    return counts;
  }, [outerwearItems]);

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
              <h1 className="text-2xl font-bold text-gray-900">Outerwear</h1>
              <p className="text-gray-500">{outerwearItems.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all relative",
              activeTab === tab
                ? "text-orange-700"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab}
            <span className="ml-1.5 text-xs text-gray-400">{tabCounts[tab]}</span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t" />
            )}
          </button>
        ))}
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
        </section>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shirt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No {activeTab.toLowerCase()} items found</p>
          </div>
        )}
      </div>

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
                <Image src={selectedItem.imageUrl} alt={selectedItem.name} fill sizes="(max-width: 768px) 100vw, 448px" className="object-contain" />
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

export default function OuterwearPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <OuterwearPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
