"use client";

import Link from "next/link";
import { Shirt, Gem, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

const inventoryItems = [
  {
    title: "Wardrobe",
    description: "Manage your clothing collection, create outfits, and track what you wear",
    href: "/inventory/wardrobe",
    icon: Shirt,
    color: "bg-orange-100 text-orange-800",
    bgColor: "bg-orange-50",
  },
  {
    title: "Jewellery",
    description: "Keep track of your jewelry collection and accessories",
    href: "/inventory/jewellery",
    icon: Gem,
    color: "bg-cyan-100 text-cyan-800",
    bgColor: "bg-cyan-50",
  },
  {
    title: "Wishlist",
    description: "Save items you want to buy with photos, prices, and store links",
    href: "/inventory/wishlist",
    icon: Heart,
    color: "bg-pink-100 text-pink-800",
    bgColor: "bg-pink-50",
  },
];

export default function InventoryPage() {
  const { data } = useAppStore();

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Manage all your belongings and wishlist items
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.wardrobe.length}</div>
            <div className="text-sm text-muted-foreground">Wardrobe Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.outfits.length}</div>
            <div className="text-sm text-muted-foreground">Saved Outfits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.wishlist.length}</div>
            <div className="text-sm text-muted-foreground">Wishlist Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className={`${item.bgColor} hover:shadow-lg transition-shadow cursor-pointer`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <Link href={item.href} passHref>
                  <Button className="w-full">
                    View {item.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/inventory/wardrobe" passHref>
              <Button variant="outline" size="sm">
                Add Wardrobe Item
              </Button>
            </Link>
            <Link href="/inventory/wishlist" passHref>
              <Button variant="outline" size="sm">
                Add to Wishlist
              </Button>
            </Link>
            <Link href="/wardrobe" passHref>
              <Button variant="outline" size="sm">
                Create Outfit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}