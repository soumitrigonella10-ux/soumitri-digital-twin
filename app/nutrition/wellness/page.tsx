"use client";

import { Pill, Sun, Moon, Sunrise } from "lucide-react";
import { useRoutineProducts } from "@/hooks/useRoutineProducts";
import { PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter, RoutineColumn } from "@/components/routines";

function WellnessPageContent() {
  const routine = useRoutineProducts({ routineType: "wellness" });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-wellness flex items-center justify-center">
            <Pill className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wellness Products</h1>
            <p className="text-gray-500">Track your supplements and wellness routine</p>
          </div>
        </div>
      </header>

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={routine.activeDayFilter}
        onFilterChange={routine.setActiveDayFilter}
        activeColorClass="bg-green-100 text-green-700"
      />

      {/* Triple-Column Routine Board */}
      <div className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RoutineColumn
            title="Morning"
            icon={Sun}
            iconColorClass="text-amber-500"
            progressRingColorClass="text-amber-500"
            progressBarColorClass="bg-amber-500"
            progress={routine.morningProgress}
            products={routine.morningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No morning products"
          />
          <RoutineColumn
            title="Midday"
            icon={Sunrise}
            iconColorClass="text-orange-500"
            progressRingColorClass="text-orange-500"
            progressBarColorClass="bg-orange-500"
            progress={routine.middayProgress}
            products={routine.middayProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No midday products"
          />
          <RoutineColumn
            title="Evening"
            icon={Moon}
            iconColorClass="text-indigo-500"
            progressRingColorClass="text-indigo-500"
            progressBarColorClass="bg-indigo-500"
            progress={routine.eveningProgress}
            products={routine.eveningProducts}
            completedProducts={routine.completedProducts}
            onToggleComplete={routine.toggleProductCompletion}
            theme={PRODUCT_CARD_THEMES.wellness}
            variant="compact"
            emptyIcon={Pill}
            emptyMessage="No evening products"
          />
        </div>
      </div>
    </div>
  );
}

export default function WellnessPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <WellnessPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
