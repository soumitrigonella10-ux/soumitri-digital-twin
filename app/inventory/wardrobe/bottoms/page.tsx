"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeItem } from "@/types";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const TABS = ["Jeans", "Trousers", "Skirts Casual", "Skirts Formal"] as const;
type BottomTab = (typeof TABS)[number];

function classifyItem(item: WardrobeItem): BottomTab {
  const sub = item.subType?.toLowerCase() ?? "";
  if (sub === "jeans") return "Jeans";
  if (sub === "skirt casual") return "Skirts Casual";
  if (sub === "skirt formal") return "Skirts Formal";
  return "Trousers";
}

function BottomsPageContent() {
  const { data } = useAppStore();
  const [activeTab, setActiveTab] = useState<BottomTab>("Jeans");

  // All bottom items
  const bottomsItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Bottom");
  }, [data.wardrobe]);

  // Items for the active tab
  const filteredItems = useMemo(() => {
    return bottomsItems.filter((item) => classifyItem(item) === activeTab);
  }, [bottomsItems, activeTab]);

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<BottomTab, number> = { Jeans: 0, Trousers: 0, "Skirts Casual": 0, "Skirts Formal": 0 };
    bottomsItems.forEach((item) => { counts[classifyItem(item)]++; });
    return counts;
  }, [bottomsItems]);

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
                className="lifeos-card-interactive overflow-hidden group"
              >
                <div className="aspect-square bg-[#FDF5E6] relative">
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
