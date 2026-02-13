"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { Sun, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type SidebarCategory,
  groupedCategories,
  groupOrder,
  _sidebarScrollTop,
  setSidebarScrollTop,
} from "./sidebarConfig";

export function Sidebar() {
  const pathname = usePathname();
  const today = new Date();
  const [expandedItems, setExpandedItems] = useState<string[]>(["wardrobe"]);
  const navRef = useRef<HTMLElement>(null);

  // Save scroll position before navigation causes re-render
  const saveScrollPosition = useCallback(() => {
    if (navRef.current) {
      setSidebarScrollTop(navRef.current.scrollTop);
    }
  }, []);

  // Restore scroll position after mount / route change
  useEffect(() => {
    const nav = navRef.current;
    if (nav && _sidebarScrollTop > 0) {
      requestAnimationFrame(() => {
        nav.scrollTop = _sidebarScrollTop;
      });
    }
  }, [pathname]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSubCategoryActive = (cat: SidebarCategory) => {
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
      <nav ref={navRef} className="flex-1 overflow-y-auto p-4 space-y-6">
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
                        onClick={saveScrollPosition}
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
                            {...(isActive || isSubActive ? { style: { color: `var(--tw-colors-${cat.color})` } } : {})}
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
                              <ChevronRight className="w-4 h-4 text-gray-400" />
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
                                onClick={saveScrollPosition}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
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
