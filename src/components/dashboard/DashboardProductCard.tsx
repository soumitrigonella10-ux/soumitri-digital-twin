"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { BODY_AREAS } from "./constants";

interface DashboardProductCardProps {
  product: Product;
  isCompleted: boolean;
  onToggle: () => void;
  colorClass: string;
}

export function DashboardProductCard({
  product,
  isCompleted,
  onToggle,
  colorClass,
}: DashboardProductCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
        isCompleted ? "bg-gray-50 opacity-60" : "bg-white hover:bg-gray-50",
        "border",
        isCompleted ? "border-gray-200" : "border-gray-100"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className={cn("w-5 h-5 flex-shrink-0", colorClass)} />
      ) : (
        <Circle className="w-5 h-5 flex-shrink-0 text-gray-300" />
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm", isCompleted && "line-through text-gray-400")}>
          {product.name}
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          <p className="text-xs text-gray-400">{product.category}</p>
          {product.bodyAreas?.map((area, idx) => {
            const areaData = BODY_AREAS[area as keyof typeof BODY_AREAS];
            if (!areaData) return null;
            return (
              <span
                key={`area-${idx}`}
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  isCompleted && "opacity-50 grayscale",
                  areaData.color
                )}
                title={areaData.fullName}
              >
                {areaData.name}
              </span>
            );
          })}
          {product.category === "Lip Care" && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                isCompleted && "opacity-50 grayscale",
                BODY_AREAS.LIPS.color
              )}
              title={BODY_AREAS.LIPS.fullName}
            >
              {BODY_AREAS.LIPS.name}
            </span>
          )}
        </div>
      </div>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          product.timeOfDay === "AM"
            ? "bg-amber-100 text-amber-700"
            : product.timeOfDay === "PM"
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-600"
        )}
      >
        {product.timeOfDay || "Any"}
      </span>
    </button>
  );
}
