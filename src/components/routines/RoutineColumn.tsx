"use client";

import { type LucideIcon } from "lucide-react";
import { Product } from "@/types";
import { ProductCard, ProductCardTheme } from "@/components/ProductCard";
import { ProgressRing, ProgressBar } from "./ProgressRing";

export interface ColumnProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface RoutineColumnProps {
  title: string;
  icon: LucideIcon;
  iconColorClass: string;
  progressRingColorClass: string;
  progressBarColorClass: string;
  progress: ColumnProgress;
  products: Product[];
  completedProducts: Set<string>;
  onToggleComplete: (productId: string) => void;
  onEdit?: (product: Product) => void;
  theme: ProductCardTheme;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  /** Extra props to pass to ProductCard (highlighted, additionalMetadata, etc.) */
  renderProductExtras?: (product: Product) => {
    highlighted?: boolean | undefined;
    highlightRingColor?: string | undefined;
    additionalMetadata?: React.ReactNode | undefined;
  };
  variant?: "default" | "compact" | "makeup";
}

export function RoutineColumn({
  title,
  icon: Icon,
  iconColorClass,
  progressRingColorClass,
  progressBarColorClass,
  progress,
  products,
  completedProducts,
  onToggleComplete,
  onEdit,
  theme,
  emptyIcon: EmptyIcon,
  emptyMessage,
  renderProductExtras,
  variant = "default",
}: RoutineColumnProps) {
  return (
    <div className="space-y-3">
      {/* Column Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconColorClass}`} />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="text-xs text-gray-500">
            {progress.completed}/{progress.total}
          </div>
        </div>

        {/* Progress Ring + Bar */}
        <div className="flex items-center gap-2">
          <ProgressRing percentage={progress.percentage} colorClass={progressRingColorClass} />
          <ProgressBar percentage={progress.percentage} colorClass={progressBarColorClass} />
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-2">
        {products.map((product, index) => {
          const extras = renderProductExtras ? renderProductExtras(product) : {};
          return (
            <ProductCard
              key={product.id}
              product={product}
              isCompleted={completedProducts.has(product.id)}
              onToggleComplete={() => onToggleComplete(product.id)}
              {...(onEdit ? { onEdit: () => onEdit(product) } : {})}
              index={index}
              theme={theme}
              variant={variant}
              {...extras}
            />
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <EmptyIcon className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
