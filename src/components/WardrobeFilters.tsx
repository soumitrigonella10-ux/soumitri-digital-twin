"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Filter, Heart, RotateCcw } from "lucide-react";

interface WardrobeFiltersProps {
  filters: WardrobeFilterState;
  onChange: (filters: WardrobeFilterState) => void;
  onReset: () => void;
}

export interface WardrobeFilterState {
  occasion: string;
  color: string;
  weather: string;
  category: string;
  vibe: string;
  modesty: string;
  comfort: string;
  favoritesOnly: boolean;
  leastRecentlyWorn: boolean;
}

const FILTER_OPTIONS = {
  occasion: ["Any", "Casual", "Office", "Party", "Date", "Gym", "Travel"],
  color: ["Any", "Black", "White", "Blue", "Green", "Red", "Neutral"],
  weather: ["Any", "Hot", "Humid", "Cold", "Rainy"],
  category: ["Any", "Top", "Bottom", "Dress", "Shoes", "Accessories", "Outerwear"],
  vibe: ["Any", "Minimal", "Bold", "Cozy", "Sporty", "Elegant"],
  modesty: ["Any", "Low", "Medium", "High"],
  comfort: ["Any", "Low", "Medium", "High"],
};

export function WardrobeFilters({ filters, onChange, onReset }: WardrobeFiltersProps) {
  const updateFilter = <K extends keyof WardrobeFilterState>(
    key: K,
    value: WardrobeFilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "favoritesOnly" || key === "leastRecentlyWorn") return value;
    return value !== "Any";
  }).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Select Filters */}
        {(Object.keys(FILTER_OPTIONS) as (keyof typeof FILTER_OPTIONS)[]).map(
          (filterKey) => (
            <div key={filterKey} className="space-y-1">
              <label className="text-xs text-gray-500 capitalize">
                {filterKey}
              </label>
              <Select
                value={filters[filterKey]}
                onChange={(e) => updateFilter(filterKey, e.target.value)}
                className="text-sm"
              >
                {FILTER_OPTIONS[filterKey].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          )
        )}

        {/* Toggle Filters */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.favoritesOnly}
              onChange={(e) => updateFilter("favoritesOnly", e.target.checked)}
              className="rounded"
            />
            <Heart
              className={`h-4 w-4 ${
                filters.favoritesOnly ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
            <span className="text-sm">Favorites only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.leastRecentlyWorn}
              onChange={(e) => updateFilter("leastRecentlyWorn", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Sort: Least recently worn</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

// Default filter state
export const defaultWardrobeFilters: WardrobeFilterState = {
  occasion: "Any",
  color: "Any",
  weather: "Any",
  category: "Any",
  vibe: "Any",
  modesty: "Any",
  comfort: "Any",
  favoritesOnly: false,
  leastRecentlyWorn: false,
};
