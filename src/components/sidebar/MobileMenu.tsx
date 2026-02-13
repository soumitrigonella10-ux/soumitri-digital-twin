"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { groupedCategories, groupOrder } from "./sidebarConfig";

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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 max-h-[70vh] overflow-y-auto w-64 sm:w-72">
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
                            <ChevronRight className="w-4 h-4 text-gray-400" />
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
                              <Sun className={cn(
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
        className="fab-button fixed bottom-6 right-6 z-50"
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
