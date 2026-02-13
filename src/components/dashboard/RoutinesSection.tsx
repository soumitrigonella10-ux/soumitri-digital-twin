"use client";

import { ReactNode } from "react";
import { Sparkles, Droplets, Target, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";
import { BODY_AREAS, getTodayProducts } from "./constants";

// ─── Reusable column for a single routine category ───

interface RoutineColumnProps {
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

function RoutineColumn({
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
}: RoutineColumnProps) {
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

// ─── Main Routines Section ───

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
        <RoutineColumn
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
        <RoutineColumn
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
        <RoutineColumn
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
