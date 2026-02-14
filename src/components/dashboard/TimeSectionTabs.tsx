"use client";

import { Coffee, UtensilsCrossed, Moon, Dumbbell, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeOfDay } from "@/types";

interface TimeSectionTabsProps {
  timeOfDay: TimeOfDay;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TAB_DEFINITIONS: Record<TimeOfDay, { id: string; label: string; icon: React.ReactNode }[]> = {
  AM: [
    { id: "breakfast", label: "Food", icon: <Coffee className="w-4 h-4" /> },
    { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "routines", label: "Routines", icon: <Sparkles className="w-4 h-4" /> },
    { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> },
  ],
  MIDDAY: [
    { id: "lunch", label: "Food", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> },
  ],
  PM: [
    { id: "dinner", label: "Food", icon: <Moon className="w-4 h-4" /> },
    { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "routines", label: "Routines", icon: <Sparkles className="w-4 h-4" /> },
    { id: "wellness", label: "Wellness", icon: <Heart className="w-4 h-4" /> },
  ],
  ANY: [],
};

export function TimeSectionTabs({ timeOfDay, activeTab, onTabChange }: TimeSectionTabsProps) {
  const tabs = TAB_DEFINITIONS[timeOfDay] ?? [];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-1.5 sm:gap-2",
            activeTab === tab.id
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
