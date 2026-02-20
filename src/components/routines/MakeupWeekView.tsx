"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MakeupWeekViewProps {
  products: Product[];
  completionState: Record<string, boolean>;
  onToggleComplete: (productId: string) => void;
}

export function MakeupWeekView({ products, completionState, onToggleComplete }: MakeupWeekViewProps) {
  const [currentDay, setCurrentDay] = useState<number>(-1);

  useEffect(() => {
    setCurrentDay(new Date().getDay());
  }, []);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      {DAYS_OF_WEEK.map((day, dayIndex) => {
        const dayProducts = products.filter(product => 
          product.weekdays?.includes(dayIndex)
        );
        
        const isToday = dayIndex === currentDay;
        const completedCount = dayProducts.filter(p => completionState[p.id]).length;
        
        return (
          <div key={day} className={cn(
            "p-3 rounded-lg border",
            isToday ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn(
                "font-medium text-sm",
                isToday ? "text-blue-900" : "text-gray-700"
              )}>
                {day}
              </h3>
              {dayProducts.length > 0 && (
                <div className={cn(
                  "w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
                  completedCount === dayProducts.length
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                )}>
                  {completedCount}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              {dayProducts.map(product => (
                <div key={product.id} className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleComplete(product.id)}
                    className={cn(
                      "w-3 h-3 rounded border flex items-center justify-center flex-shrink-0",
                      completionState[product.id]
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300"
                    )}
                  >
                    {completionState[product.id] && <Check className="w-2 h-2" />}
                  </button>
                  <span className={cn(
                    "text-xs truncate",
                    completionState[product.id] ? "text-gray-500 line-through" : "text-gray-700"
                  )}>
                    {product.name}
                  </span>
                </div>
              ))}
            </div>
            
            {dayProducts.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">No makeup</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
