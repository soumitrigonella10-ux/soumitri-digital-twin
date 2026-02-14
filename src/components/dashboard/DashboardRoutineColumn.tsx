"use client";

import { ReactNode } from "react";
import { Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { BODY_AREAS } from "./constants";

export interface DashboardRoutineColumnProps {
  title: string;
  icon: ReactNode;
  iconColor: string;
  borderColor: string;
  badgeClass: string;
  numberBgClass: string;
  numberTextClass: string;
  products: Product[];
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
  animationDelayOffset?: number;
  showBodyAreas?: boolean;
  showPriorityBanner?: boolean;
}

export function DashboardRoutineColumn({
  title,
  icon,
  products,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
  borderColor,
  badgeClass,
  numberBgClass,
  numberTextClass,
  animationDelayOffset = 0,
  showBodyAreas = false,
  showPriorityBanner = false,
}: DashboardRoutineColumnProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <span className="text-xs text-gray-500">({products.length})</span>
      </div>

      {showPriorityBanner && products.length > 0 && (
        <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100 mb-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Info className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Priority Care Zone</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {products.length > 0 ? (
          products.map((product, index) => {
            const completed = getProductCompletion(dateKey, product.id);
            return (
              <div
                key={product.id}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
                  completed
                    ? "bg-gray-50 border-gray-200 opacity-70"
                    : `bg-white ${borderColor} hover:shadow-sm`
                )}
                style={{ animationDelay: `${index * 75 + animationDelayOffset}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      numberBgClass,
                      numberTextClass
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-medium text-sm text-gray-900 transition-all",
                        completed && "line-through text-gray-500"
                      )}
                    >
                      {product.name}
                    </h4>
                    <div className={cn("flex items-center mt-1", showBodyAreas ? "gap-2 flex-wrap" : "justify-between")}>
                      <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", badgeClass)}>
                        {product.category}
                      </span>
                      {showBodyAreas &&
                        product.bodyAreas?.map((area, idx) => {
                          const areaData = BODY_AREAS[area as keyof typeof BODY_AREAS];
                          if (!areaData) return null;
                          return (
                            <span
                              key={`area-${idx}`}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                completed && "opacity-50 grayscale",
                                areaData.color
                              )}
                              title={areaData.fullName}
                            >
                              {areaData.name}
                            </span>
                          );
                        })}
                    </div>
                    <div className={cn("flex items-center", showBodyAreas ? "justify-end mt-2" : "justify-end mt-0")}>
                      {!showBodyAreas && <div className="flex-1" />}
                      <button
                        onClick={() => toggleProductCompletion(dateKey, product.id)}
                        className={cn(
                          "p-1 rounded-lg transition-all flex-shrink-0",
                          completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">No products</p>
        )}
      </div>
    </div>
  );
}
