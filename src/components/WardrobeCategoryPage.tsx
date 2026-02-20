"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import type { LucideIcon } from "lucide-react";

// ========================================
// Shared wardrobe category page component
// Used by simple category pages that only filter + display a grid
// ========================================

interface WardrobeCategoryPageProps {
  /** The category string to filter wardrobe items by */
  category: string;
  /** Display title */
  title: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Optional empty-state message override */
  emptyMessage?: string;
  /** Image object-fit mode (default: "contain") */
  objectFit?: "contain" | "cover";
}

export function WardrobeCategoryPage({
  category,
  title,
  icon: Icon,
  emptyMessage,
  objectFit = "contain",
}: WardrobeCategoryPageProps) {
  const { data } = useAppStore();

  const items = useMemo(() => {
    return data.wardrobe.filter((item) => item.category === category);
  }, [data.wardrobe, category]);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {/* Header */}
            <header className="animate-fade-scale">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-category-wardrobe flex items-center justify-center">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500">{items.length} items</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Items Grid */}
            <div className="space-y-8">
              <section className="animate-slide-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((item) => (
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
                            className={objectFit === "cover" ? "object-cover" : "object-contain"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{emptyMessage ?? `No ${title.toLowerCase()} items yet`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
