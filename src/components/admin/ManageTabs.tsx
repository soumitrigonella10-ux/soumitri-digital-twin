"use client";

import { useState } from "react";
import { Package, Shirt, Utensils, Salad, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductsTab } from "./ProductsTab";
import { WardrobeTab } from "./WardrobeTab";
import { MealsTab } from "./MealsTab";
import { DressingsTab } from "./DressingsTab";
import { WorkoutsTab } from "./WorkoutsTab";

type TabKey = "products" | "wardrobe" | "meals" | "dressings" | "workouts";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { key: "wardrobe", label: "Wardrobe", icon: <Shirt className="h-4 w-4" /> },
  { key: "meals", label: "Meals", icon: <Utensils className="h-4 w-4" /> },
  { key: "dressings", label: "Dressings", icon: <Salad className="h-4 w-4" /> },
  { key: "workouts", label: "Workouts", icon: <Dumbbell className="h-4 w-4" /> },
];

const TAB_COMPONENTS: Record<TabKey, React.ComponentType> = {
  products: ProductsTab,
  wardrobe: WardrobeTab,
  meals: MealsTab,
  dressings: DressingsTab,
  workouts: WorkoutsTab,
};

export function ManageTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="p-4">
          <ActiveComponent />
        </CardContent>
      </Card>
    </div>
  );
}
