"use client";

import type { WardrobeCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

export interface WardrobeFilterState {
  category: WardrobeCategory | "Any";
}

export const defaultWardrobeFilters: WardrobeFilterState = {
  category: "Any",
};

interface WardrobeFiltersProps {
  filters: WardrobeFilterState;
  onChange: (filters: WardrobeFilterState) => void;
  onReset: () => void;
}

const wardrobeCategories: (WardrobeCategory | "Any")[] = [
  "Any",
  "Top",
  "Bottom", 
  "Dress",
  "Shoes",
  "Bags",
  "Innerwear",
  "Activewear",
  "Ethnic",
  "Outerwear",
  "Others"
];

export function WardrobeFilters({ filters, onChange, onReset }: WardrobeFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onChange({
      ...filters,
      category: category as WardrobeCategory | "Any",
    });
  };

  const isDefaultFilters = filters.category === "Any";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isDefaultFilters}
            className="h-8 px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={filters.category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {wardrobeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        {/* Active Filters */}
        {!isDefaultFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {filters.category !== "Any" && (
                <Badge variant="secondary" className="text-xs">
                  Category: {filters.category}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
