"use client";

import { useState, useMemo } from "react";
import { Palette, Sun, Moon, Calendar, Edit2, Check, X, Sparkles, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Product, TimeOfDay } from "@/types";
import { ProductCard, PRODUCT_CARD_THEMES } from "@/components/ProductCard";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



// Week View Component
function WeekView({ products, completionState, onToggleComplete }: {
  products: Product[];
  completionState: Record<string, boolean>;
  onToggleComplete: (productId: string) => void;
}) {
  const currentDay = new Date().getDay();
  
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

// Main Makeup Page Component
// Makeup Page Content Component
function MakeupPageContent() {
  const { data } = useAppStore();
  const [view, setView] = useState<"routine" | "week">("routine");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("AM");
  const [completionState, setCompletionState] = useState<Record<string, boolean>>({});
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // Filter makeup products (for now, we'll create some sample data since makeup isn't in the current products)
  const makeupProducts = useMemo(() => {
    // Sample makeup products - in the future these should come from the data store
    const sampleMakeupProducts: Product[] = [
      {
        id: "makeup-primer",
        name: "Makeup Primer",
        category: "Base",
        actives: ["Silicones"],
        cautionTags: [],
        routineType: "skin", // Using skin as closest match until makeup is added to types
        timeOfDay: "AM",
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        displayOrder: 1,
        notes: "Create smooth base for makeup application"
      },
      {
        id: "foundation",
        name: "Liquid Foundation",
        category: "Foundation",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [1, 2, 3, 4, 5], // Weekdays only
        displayOrder: 2,
        notes: "Even skin tone and coverage"
      },
      {
        id: "concealer",
        name: "Under Eye Concealer",
        category: "Concealer",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        displayOrder: 3,
        notes: "Hide dark circles and blemishes"
      },
      {
        id: "powder",
        name: "Setting Powder",
        category: "Powder",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [1, 2, 3, 4, 5],
        displayOrder: 4,
        notes: "Set foundation and prevent shine"
      },
      {
        id: "eyebrow-gel",
        name: "Eyebrow Gel",
        category: "Eyebrow",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        displayOrder: 5,
        notes: "Shape and define eyebrows"
      },
      {
        id: "mascara",
        name: "Waterproof Mascara",
        category: "Mascara",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        displayOrder: 6,
        notes: "Define and volumize lashes"
      },
      {
        id: "lip-tint",
        name: "Natural Lip Tint",
        category: "Lips",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        displayOrder: 7,
        notes: "Natural lip color and moisture"
      },
      {
        id: "blush",
        name: "Cream Blush",
        category: "Blush",
        actives: [],
        cautionTags: [],
        routineType: "skin",
        timeOfDay: "AM",
        weekdays: [0, 2, 4, 6], // Every other day
        displayOrder: 8,
        notes: "Add natural flush to cheeks"
      }
    ];

    return sampleMakeupProducts.filter(product => 
      product.timeOfDay === timeOfDay || product.timeOfDay === "ANY"
    ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [timeOfDay]);

  const handleToggleComplete = (productId: string) => {
    setCompletionState(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    // TODO: Implement edit modal
  };

  const completedCount = Object.values(completionState).filter(Boolean).length;
  const progressPercentage = makeupProducts.length > 0 
    ? Math.round((completedCount / makeupProducts.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Makeup Routine</h1>
            <p className="text-gray-600">Your daily beauty ritual</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex bg-white rounded-lg p-1 border">
            <button
              onClick={() => setView("routine")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                view === "routine"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Routine
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                view === "week"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Week
            </button>
          </div>

          {/* Time of Day Filter */}
          {view === "routine" && (
            <div className="flex bg-white rounded-lg p-1 border">
              {(["AM", "PM"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeOfDay(time)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                    timeOfDay === time
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:text-gray-800"
                  )}
                >
                  {time === "AM" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {time}
                </button>
              ))}
            </div>
          )}

          {/* Progress */}
          {view === "routine" && makeupProducts.length > 0 && (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {completedCount}/{makeupProducts.length} completed ({progressPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {view === "routine" ? (
          <div className="space-y-3">
            {makeupProducts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No makeup products for {timeOfDay}
                </h3>
                <p className="text-gray-500">
                  Add products to start building your makeup routine
                </p>
              </div>
            ) : (
              makeupProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompleted={completionState[product.id] || false}
                  onToggleComplete={() => handleToggleComplete(product.id)}
                  onEdit={() => handleEdit(product.id)}
                  index={index}
                  theme={PRODUCT_CARD_THEMES.makeup}
                  variant="makeup"
                />
              ))
            )}
          </div>
        ) : (
          <WeekView
            products={makeupProducts}
            completionState={completionState}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>
    </div>
  );
}

export default function MakeupPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <MakeupPageContent />
      </div>
    </AuthenticatedLayout>
  );
}