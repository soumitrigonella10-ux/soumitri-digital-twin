"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  Sun,
  Sparkles,
  Droplets,
  Target,
  Wind,
  Shirt,
  Gem,
  Coffee,
  UtensilsCrossed,
  Moon,
  ShoppingCart,
  Pill,
  Dumbbell,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ========================================
// Category Configuration
// ========================================
export const categories = [
  // Daily Logic
  {
    id: "today",
    name: "Today",
    icon: Sun,
    href: "/",
    color: "lifeos-today",
    bgClass: "bg-category-today",
    borderClass: "border-category-today",
    group: "Daily Logic",
  },
  // Routines
  {
    id: "skin",
    name: "Skin",
    icon: Sparkles,
    href: "/routines/skin",
    color: "lifeos-skin",
    bgClass: "bg-category-skin",
    borderClass: "border-category-skin",
    group: "Routines",
  },
  {
    id: "body",
    name: "Body",
    icon: Droplets,
    href: "/routines/body",
    color: "lifeos-body",
    bgClass: "bg-category-body",
    borderClass: "border-category-body",
    group: "Routines",
  },
  {
    id: "bodySpecific",
    name: "Body Specifics",
    icon: Target,
    href: "/routines/body-specifics",
    color: "lifeos-bodySpecific",
    bgClass: "bg-category-bodySpecific",
    borderClass: "border-category-bodySpecific",
    group: "Routines",
  },
  {
    id: "hair",
    name: "Hair",
    icon: Wind,
    href: "/routines/hair",
    color: "lifeos-hair",
    bgClass: "bg-category-hair",
    borderClass: "border-category-hair",
    group: "Routines",
  },
  // Inventory
  {
    id: "wardrobe",
    name: "Wardrobe",
    icon: Shirt,
    href: "/inventory/wardrobe",
    color: "lifeos-wardrobe",
    bgClass: "bg-category-wardrobe",
    borderClass: "border-category-wardrobe",
    group: "Inventory",
    subCategories: [
      { id: "tops", name: "Tops", href: "/inventory/wardrobe/tops" },
      { id: "bottoms", name: "Bottoms", href: "/inventory/wardrobe/bottoms" },
      { id: "dresses", name: "Dresses", href: "/inventory/wardrobe/dresses" },
      { id: "outerwear", name: "Outerwear", href: "/inventory/wardrobe/outerwear" },
      { id: "shoes", name: "Shoes", href: "/inventory/wardrobe/shoes" },
      { id: "innerwear", name: "Innerwear", href: "/inventory/wardrobe/innerwear" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    icon: Gem,
    href: "/inventory/jewellery",
    color: "lifeos-jewellery",
    bgClass: "bg-category-jewellery",
    borderClass: "border-category-jewellery",
    group: "Inventory",
  },
  // Nutrition
  {
    id: "breakfast",
    name: "Breakfast",
    icon: Coffee,
    href: "/nutrition/breakfast",
    color: "lifeos-breakfast",
    bgClass: "bg-category-breakfast",
    borderClass: "border-category-breakfast",
    group: "Nutrition",
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: UtensilsCrossed,
    href: "/nutrition/lunch",
    color: "lifeos-lunch",
    bgClass: "bg-category-lunch",
    borderClass: "border-category-lunch",
    group: "Nutrition",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: Moon,
    href: "/nutrition/dinner",
    color: "lifeos-dinner",
    bgClass: "bg-category-dinner",
    borderClass: "border-category-dinner",
    group: "Nutrition",
  },
  {
    id: "grocery",
    name: "Grocery List",
    icon: ShoppingCart,
    href: "/nutrition/grocery",
    color: "lifeos-grocery",
    bgClass: "bg-category-grocery",
    borderClass: "border-category-grocery",
    group: "Nutrition",
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: Pill,
    href: "/nutrition/wellness",
    color: "lifeos-wellness",
    bgClass: "bg-category-wellness",
    borderClass: "border-category-wellness",
    group: "Nutrition",
  },
  // Physicality
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    href: "/fitness",
    color: "lifeos-fitness",
    bgClass: "bg-category-fitness",
    borderClass: "border-category-fitness",
    group: "Physicality",
  },
];

// Group categories by their group
const groupedCategories = categories.reduce((acc, cat) => {
  if (!acc[cat.group]) {
    acc[cat.group] = [];
  }
  acc[cat.group].push(cat);
  return acc;
}, {} as Record<string, typeof categories>);

const groupOrder = ["Daily Logic", "Routines", "Inventory", "Nutrition", "Physicality"];

// ========================================
// Sidebar Component
// ========================================
export function Sidebar() {
  const pathname = usePathname();
  const today = new Date();
  const [expandedItems, setExpandedItems] = useState<string[]>(["wardrobe"]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSubCategoryActive = (cat: typeof categories[0]) => {
    if (!cat.subCategories) return false;
    return cat.subCategories.some((sub) => pathname === sub.href);
  };

  return (
    <aside className="sidebar hidden lg:flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Soumitri Digital Twin</h1>
        <p className="text-sm text-gray-500 mt-1">
          {format(today, "EEE, MMMM d")}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupOrder.map((group) => (
          <div key={group}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
              {group}
            </p>
            <ul className="space-y-1">
              {groupedCategories[group]?.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname === cat.href;
                const hasSubCategories = cat.subCategories && cat.subCategories.length > 0;
                const isExpanded = expandedItems.includes(cat.id);
                const isSubActive = isSubCategoryActive(cat);

                return (
                  <li key={cat.id}>
                    <div className="flex items-center">
                      <Link
                        href={cat.href}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                          isActive || isSubActive
                            ? `${cat.bgClass} ${cat.borderClass} border-2`
                            : "hover:bg-gray-50 border-2 border-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isActive || isSubActive ? cat.bgClass : "bg-gray-100"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              isActive || isSubActive ? `text-${cat.color}` : "text-gray-500"
                            )}
                            style={isActive || isSubActive ? { color: `var(--tw-colors-${cat.color})` } : {}}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive || isSubActive ? "text-gray-900" : "text-gray-600"
                          )}
                        >
                          {cat.name}
                        </span>
                        {hasSubCategories ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleExpand(cat.id);
                            }}
                            className="ml-auto p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        ) : isActive ? (
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        ) : null}
                      </Link>
                    </div>
                    
                    {/* Subcategories */}
                    {hasSubCategories && isExpanded && (
                      <ul className="ml-6 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                        {cat.subCategories!.map((sub) => {
                          const isSubItemActive = pathname === sub.href;
                          return (
                            <li key={sub.id}>
                              <Link
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                  isSubItemActive
                                    ? "bg-orange-50 text-orange-700 font-medium"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                <CircleDot className={cn(
                                  "w-3 h-3",
                                  isSubItemActive ? "text-orange-500" : "text-gray-300"
                                )} />
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Your Digital Concierge
        </p>
      </div>
    </aside>
  );
}

// ========================================
// Mobile Floating Action Menu
// ========================================
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["wardrobe"]);
  const pathname = usePathname();

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed bottom-20 right-6 z-50 transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 max-h-[70vh] overflow-y-auto">
          {groupOrder.map((group) => (
            <div key={group} className="py-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-1">
                {group}
              </p>
              {groupedCategories[group]?.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname === cat.href;
                const hasSubCategories = cat.subCategories && cat.subCategories.length > 0;
                const isExpanded = expandedItems.includes(cat.id);
                const isSubActive = cat.subCategories?.some((sub) => pathname === sub.href);

                return (
                  <div key={cat.id}>
                    <div className="flex items-center">
                      <Link
                        href={cat.href}
                        onClick={() => !hasSubCategories && setIsOpen(false)}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                          isActive || isSubActive ? cat.bgClass : "hover:bg-gray-50"
                        )}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive || isSubActive ? undefined : "#6b7280" }} />
                        <span className={cn("text-sm", isActive || isSubActive ? "font-medium" : "text-gray-600")}>
                          {cat.name}
                        </span>
                      </Link>
                      {hasSubCategories && (
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {hasSubCategories && isExpanded && (
                      <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                        {cat.subCategories!.map((sub) => {
                          const isSubItemActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                                isSubItemActive
                                  ? "bg-orange-50 text-orange-700 font-medium"
                                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <CircleDot className={cn(
                                "w-3 h-3",
                                isSubItemActive ? "text-orange-500" : "text-gray-300"
                              )} />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fab-button"
        aria-label="Open navigation menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
