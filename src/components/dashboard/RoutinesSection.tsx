"use client";

import { Sparkles, Droplets, Target } from "lucide-react";
import { Product, TimeOfDay } from "@/types";
import { getTodayProducts } from "./constants";
import { DashboardRoutineColumn } from "./DashboardRoutineColumn";

interface RoutinesSectionProps {
  products: Product[];
  dayOfWeek: number;
  timeOfDay: TimeOfDay;
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
}

export function RoutinesSection({
  products,
  dayOfWeek,
  timeOfDay,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
}: RoutinesSectionProps) {
  const skinProducts = getTodayProducts(products, "skin", dayOfWeek, timeOfDay);
  const bodyProducts = getTodayProducts(products, "body", dayOfWeek, timeOfDay);
  const bodySpecificProducts = getTodayProducts(products, "bodySpecific", dayOfWeek, timeOfDay);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <DashboardRoutineColumn
          title="Skin Care"
          icon={<Sparkles className="w-4 h-4 text-pink-500" />}
          iconColor="pink"
          borderColor="border-pink-200 hover:border-pink-300"
          badgeClass="bg-pink-100 text-pink-700"
          numberBgClass="bg-pink-100"
          numberTextClass="text-pink-600"
          products={skinProducts}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
          animationDelayOffset={0}
        />
        <DashboardRoutineColumn
          title="Body Care"
          icon={<Droplets className="w-4 h-4 text-blue-500" />}
          iconColor="blue"
          borderColor="border-blue-200 hover:border-blue-300"
          badgeClass="bg-blue-100 text-blue-700"
          numberBgClass="bg-blue-100"
          numberTextClass="text-blue-600"
          products={bodyProducts}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
          animationDelayOffset={25}
        />
        <DashboardRoutineColumn
          title="Body Specifics"
          icon={<Target className="w-4 h-4 text-purple-500" />}
          iconColor="purple"
          borderColor="border-purple-200 hover:border-purple-300"
          badgeClass="bg-purple-100 text-purple-700"
          numberBgClass="bg-purple-100"
          numberTextClass="text-purple-600"
          products={bodySpecificProducts}
          dateKey={dateKey}
          getProductCompletion={getProductCompletion}
          toggleProductCompletion={toggleProductCompletion}
          animationDelayOffset={50}
          showBodyAreas
          showPriorityBanner
        />
      </div>
    </div>
  );
}
