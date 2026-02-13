"use client";

import { Calendar, CheckCircle2, Edit2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface ProductCardTheme {
  /** Primary color for number badges and completion buttons */
  primary: string;
  /** Default color when category mapping is not found */
  defaultBadge: string;
  /** Category-specific color mappings */
  categoryColors: Record<string, string>;
  /** Completion button colors */
  completionButton: {
    completed: string;
    hover: string;
  };
  /** Caution tag colors (optional, defaults to yellow) */
  cautionTags?: string;
}

export interface ProductCardProps {
  product: Product;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit?: () => void;
  index: number;
  theme: ProductCardTheme;
  /** Optional highlight effect for special cases */
  highlighted?: boolean | undefined;
  /** Custom highlight ring color for specific features (body-specifics) */
  highlightRingColor?: string | undefined;
  /** Custom layout variant */
  variant?: 'default' | 'compact' | 'makeup' | undefined;
  /** Additional metadata to display */
  additionalMetadata?: React.ReactNode | undefined;
}

export function ProductCard({ 
  product, 
  isCompleted, 
  onToggleComplete, 
  onEdit,
  index, 
  theme,
  highlighted = false,
  highlightRingColor,
  variant = 'default',
  additionalMetadata
}: ProductCardProps) {
  const categoryColor = theme.categoryColors[product.category as keyof typeof theme.categoryColors] || theme.defaultBadge;
  const cautionColor = theme.cautionTags || "bg-yellow-100 text-yellow-700";

  // Makeup variant has different layout
  if (variant === 'makeup') {
    return (
      <div
        className={cn(
          "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
          isCompleted
            ? "bg-gray-50 border-gray-200 opacity-70"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
        )}
        style={{ animationDelay: `${index * 75}ms` }}
      >
        <div className="flex items-center gap-3">
          {/* Number Badge */}
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm",
            categoryColor
          )}>
            {index + 1}
          </div>

          {/* Completion Toggle */}
          <button
            onClick={onToggleComplete}
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400"
            )}
          >
            {isCompleted && <Check className="w-3 h-3" />}
          </button>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={cn(
                "font-medium text-sm truncate",
                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
              )}>
                {product.name}
              </h4>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0",
                categoryColor
              )}>
                {product.category}
              </span>
            </div>
            
            {product.notes && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {product.notes}
              </p>
            )}
          </div>

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default and compact variants
  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-all duration-300 animate-slide-in relative",
        isCompleted
          ? "bg-gray-50 border-gray-200 opacity-70"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
        highlighted && !isCompleted && "ring-2 ring-offset-2",
        highlighted && !isCompleted && (highlightRingColor || "ring-blue-300")
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-center gap-3">
        {/* Number Badge */}
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm",
          categoryColor
        )}>
          {index + 1}
        </div>

        {/* Product Image Viewport */}
        {product.imageUrl && (
          <div className={cn(
            "w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden",
            isCompleted && "grayscale opacity-60"
          )}>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                isCompleted && "grayscale opacity-60"
              )}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <div className="flex items-center justify-between mb-1.5">
            <h4 className={cn(
              "font-medium text-sm text-gray-900 transition-all",
              isCompleted && "line-through text-gray-500"
            )}>
              {product.name}
            </h4>
            <button
              onClick={onToggleComplete}
              className={cn(
                "p-1 rounded-lg transition-all flex-shrink-0 ml-2",
                isCompleted
                  ? theme.completionButton.completed
                  : `bg-gray-100 text-gray-400 ${theme.completionButton.hover}`
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Pills and Tags */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {/* Category Pill */}
            <span className={cn(
              "px-2 py-0.5 rounded-md text-xs font-medium transition-all",
              isCompleted ? "grayscale opacity-60" : "",
              categoryColor
            )}>
              {product.category}
            </span>

            {/* Active Ingredients */}
            {product.actives && product.actives.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.actives.slice(0, 1).map((active, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded transition-all",
                      isCompleted && "opacity-50"
                    )}
                  >
                    {active}
                  </span>
                ))}
                {product.actives.length > 1 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    +{product.actives.length - 1}
                  </span>
                )}
              </div>
            )}

            {/* Dosage or serving info for wellness products */}
            {variant === 'compact' && product.notes && (
              <span className={cn(
                "px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded transition-all",
                isCompleted && "opacity-50"
              )}>
                {product.notes}
              </span>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {/* Schedule Info */}
              <div className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />
                <span>
                  {!product.weekdays || product.weekdays.length === 7
                    ? "Daily"
                    : product.weekdays.map((d) => (DAYS_OF_WEEK[d] ?? "").charAt(0)).join("")}
                </span>
              </div>

              {/* Caution Tags */}
              {product.cautionTags && product.cautionTags.length > 0 && (
                <div className="flex gap-0.5">
                  {product.cautionTags.slice(0, 1).map((tag, idx) => (
                    <span
                      key={idx}
                      className={cn("px-1 py-0.5 text-xs rounded", cautionColor)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Additional metadata for specific pages */}
              {additionalMetadata}
            </div>

            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export themes from dedicated module for backward compatibility
export { PRODUCT_CARD_THEMES } from "./productCardThemes";