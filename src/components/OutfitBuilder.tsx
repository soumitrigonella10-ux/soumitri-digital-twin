"use client";

import { useState } from "react";
import { X, Save, Shirt, Footprints, Watch, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Outfit, WardrobeItem, WardrobeCategory } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "./ToastProvider";
import { formatISO } from "date-fns";

interface OutfitBuilderProps {
  filteredItems: WardrobeItem[];
}

const CATEGORIES: WardrobeCategory[] = [
  "Top",
  "Bottom",
  "Dress",
  "Shoes",
  "Accessories",
  "Outerwear",
];

const OCCASIONS = ["Casual", "Office", "Party", "Date", "Gym", "Travel"];

export function OutfitBuilder({ filteredItems }: OutfitBuilderProps) {
  const { data, addOutfit, removeOutfit } = useAppStore();
  const { toast } = useToast();

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});
  const [outfitName, setOutfitName] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("Casual");

  // Group items by category
  const itemsByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = filteredItems.filter((item) => item.category === cat);
      return acc;
    },
    {} as Record<WardrobeCategory, WardrobeItem[]>
  );

  const handleSelectItem = (category: string, itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: itemId,
    }));
  };

  const handleRemoveItem = (category: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const handleSaveOutfit = () => {
    const itemIds = Object.values(selectedItems).filter(Boolean);

    if (!outfitName.trim()) {
      toast({ title: "Error", description: "Please enter an outfit name", variant: "error" });
      return;
    }

    if (itemIds.length === 0) {
      toast({ title: "Error", description: "Please select at least one item", variant: "error" });
      return;
    }

    const outfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name: outfitName.trim(),
      itemIds,
      occasions: [selectedOccasion],
      createdAt: formatISO(new Date()),
    };

    addOutfit(outfit);
    toast({ title: "Outfit saved!", description: outfitName, variant: "success" });

    // Reset
    setSelectedItems({});
    setOutfitName("");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Top":
      case "Bottom":
      case "Dress":
      case "Outerwear":
        return <Shirt className="h-4 w-4" />;
      case "Shoes":
        return <Footprints className="h-4 w-4" />;
      case "Accessories":
        return <Watch className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Outfit Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selectors */}
        <div className="space-y-3">
          {CATEGORIES.map((category) => {
            const items = itemsByCategory[category];
            const selectedId = selectedItems[category];
            const selectedItem = items.find((i) => i.id === selectedId);

            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>

                {selectedItem ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="flex-1 text-sm truncate">
                      {selectedItem.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveItem(category)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value=""
                    onChange={(e) => handleSelectItem(category, e.target.value)}
                    className="text-sm"
                    disabled={items.length === 0}
                  >
                    <option value="">
                      {items.length === 0
                        ? "No items available"
                        : `Select ${category.toLowerCase()}`}
                    </option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            );
          })}
        </div>

        {/* Outfit Name & Occasion */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <Input
            placeholder="Outfit name"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
          />
          <Select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
          >
            {OCCASIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </Select>
          <Button onClick={handleSaveOutfit} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Outfit
          </Button>
        </div>

        {/* Saved Outfits */}
        {data.outfits.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Saved Outfits ({data.outfits.length})
            </h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {data.outfits.map((outfit) => (
                <li
                  key={outfit.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                >
                  <div>
                    <span className="text-sm font-medium">{outfit.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {outfit.occasions.map((occ) => (
                        <Badge key={occ} variant="secondary" className="text-xs">
                          {occ}
                        </Badge>
                      ))}
                      <span className="text-xs text-gray-400">
                        • {outfit.itemIds.length} items
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600"
                    onClick={() => removeOutfit(outfit.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
