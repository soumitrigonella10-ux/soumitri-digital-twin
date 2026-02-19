"use client";

import { useMemo, useState, useEffect } from "react";
import { Shirt } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WardrobeGrid } from "@/components/WardrobeGrid";
import {
  WardrobeFilters,
  WardrobeFilterState,
  defaultWardrobeFilters,
} from "@/components/WardrobeFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

// Wardrobe Page Content
function WardrobePageContent() {
  const { data } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<WardrobeFilterState>(defaultWardrobeFilters);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter wardrobe items based on current filters
  const filteredItems = useMemo(() => {
    let items = [...data.wardrobe];

    // Apply filters
    if (filters.category !== "Any") {
      items = items.filter((item) => item.category === filters.category);
    }

    return items;
  }, [data.wardrobe, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    data.wardrobe.forEach((item) => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    });
    return {
      total: data.wardrobe.length,
      byCategory,
    };
  }, [data.wardrobe]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid md:grid-cols-4 gap-4">
          <Skeleton className="h-96" />
          <div className="md:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wardrobe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage your collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{stats.total} items</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(stats.byCategory).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{category}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Left: Filters */}
        <div className="md:col-span-1">
          <WardrobeFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(defaultWardrobeFilters)}
          />
        </div>

        {/* Center: Wardrobe Grid */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Items
                </div>
                <Badge variant="outline">
                  {filteredItems.length} of {stats.total}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WardrobeGrid items={filteredItems} />
            </CardContent>
          </Card>
        </div>
      </div>
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
