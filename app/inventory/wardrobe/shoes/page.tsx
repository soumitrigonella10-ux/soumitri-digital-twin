"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Footprints } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function ShoesPageContent() {
  const { data } = useAppStore();
  // Filter for shoes only
  const shoesItems = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === "Shoes");
  }, [data.wardrobe]);

  // No additional filtering needed since properties don't exist
  const filteredItems = shoesItems;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-category-wardrobe flex items-center justify-center">
              <Footprints className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shoes</h1>
              <p className="text-gray-500">{shoesItems.length} items</p>
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
                className="lifeos-card-interactive overflow-hidden group"
              >
                <div className="aspect-square bg-[#FDF5E6] relative">
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
                      <Footprints className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Footprints className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No shoes match your filters</p>
          </div>
        )}
      </div>


    </div>
  );
}

export default function ShoesPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <ShoesPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
