"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WishlistItem, WishlistCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const INITIAL_FORM: Partial<WishlistItem> = {
  name: "",
  brand: "",
  category: "Tops",
  tags: [],
  imageUrl: "",
  websiteUrl: "",
  currency: "INR",
  priority: "Medium",
};

interface AddItemModalProps {
  onAdd: (item: WishlistItem) => void;
  onClose: () => void;
}

export function AddItemModal({ onAdd, onClose }: AddItemModalProps) {
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>(INITIAL_FORM);

  const handleSubmit = () => {
    if (!newItem.name || !newItem.category) return;

    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      ...(newItem.brand ? { brand: newItem.brand } : {}),
      category: newItem.category as WishlistCategory,
      tags: newItem.tags || [newItem.category as string, "Apparel"],
      ...(newItem.imageUrl ? { imageUrl: newItem.imageUrl } : {}),
      ...(newItem.websiteUrl ? { websiteUrl: newItem.websiteUrl } : {}),
      ...(newItem.price != null ? { price: newItem.price } : {}),
      currency: newItem.currency || "INR",
      priority: newItem.priority || "Medium",
      purchased: false,
    };

    onAdd(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Wishlist Item</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name *</label>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input
              value={newItem.brand}
              onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
              placeholder="e.g., Ti.Dehi, Zara"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <Select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value as WishlistCategory })
              }
            >
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Dresses">Dresses</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Shoes">Shoes</option>
              <option value="Jewellery">Jewellery</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              value={(newItem.tags || []).join(", ")}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                })
              }
              placeholder="e.g., Tops, Apparel"
            />
            <p className="text-xs text-gray-500">Default: Category + Apparel</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={newItem.imageUrl}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <Input
              value={newItem.websiteUrl}
              onChange={(e) => setNewItem({ ...newItem, websiteUrl: e.target.value })}
              placeholder="https://example.com/product"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={newItem.price || ""}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    ...(e.target.value ? { price: Number(e.target.value) } : {}),
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={newItem.priority}
                onChange={(e) =>
                  setNewItem({ ...newItem, priority: e.target.value as "Low" | "Medium" | "High" })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!newItem.name || !newItem.category}
            >
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
