"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Filter, RotateCcw } from "lucide-react";

interface WardrobeFiltersProps {
  filters: WardrobeFilterState;
  onChange: (filters: WardrobeFilterState) => void;
  onReset: () => void;
}

export interface WardrobeFilterState {
  color: string;
  category: string;
}

const FILTER_OPTIONS = {
  color: ["Any", "Black", "White", "Blue", "Green", "Red", "Neutral"],
  category: ["Any", "Top", "Bottom", "Dress", "Shoes", "Accessories", "Outerwear"],
};

export function WardrobeFilters({ filters, onChange, onReset }: WardrobeFiltersProps) {
  const updateFilter = <K extends keyof WardrobeFilterState>(
    key: K,
    value: WardrobeFilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
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


      </CardContent>
    </Card>
  );
}

// Default filter state
export const defaultWardrobeFilters: WardrobeFilterState = {
  color: "Any",
  category: "Any",
};
