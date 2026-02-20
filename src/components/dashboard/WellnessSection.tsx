"use client";

import type { Product, TimeOfDay } from "@/types";
import { DashboardProductCard } from "./DashboardProductCard";

interface WellnessSectionProps {
  products: Product[];
  dayOfWeek: number;
  timeOfDay: TimeOfDay;
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
}

export function WellnessSection({
  products,
  dayOfWeek,
  timeOfDay,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
}: WellnessSectionProps) {
  const wellnessProducts = products.filter(
    (p) =>
      p.routineType === "wellness" &&
      (p.weekdays === undefined || p.weekdays.includes(dayOfWeek)) &&
      (p.timeOfDay === timeOfDay || p.timeOfDay === "ANY")
  );

  if (wellnessProducts.length === 0) {
    return <p className="text-center text-gray-400 py-8">No wellness products scheduled</p>;
  }

  return (
    <div className="space-y-2">
      {wellnessProducts.map((product) => (
        <DashboardProductCard
          key={product.id}
          product={product}
          isCompleted={getProductCompletion(dateKey, product.id)}
          onToggle={() => toggleProductCompletion(dateKey, product.id)}
          colorClass="text-green-500"
        />
      ))}
    </div>
  );
}
