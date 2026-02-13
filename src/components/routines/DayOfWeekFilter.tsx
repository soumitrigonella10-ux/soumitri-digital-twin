"use client";

import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface DayOfWeekFilterProps {
  activeDayFilter: number | "ALL";
  onFilterChange: (day: number | "ALL") => void;
  activeColorClass: string;
}

export function DayOfWeekFilter({ activeDayFilter, onFilterChange, activeColorClass }: DayOfWeekFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
      <button
        onClick={() => onFilterChange("ALL")}
        className={cn(
          "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
          activeDayFilter === "ALL"
            ? activeColorClass
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        All Days
      </button>
      {DAYS_OF_WEEK.map((day, index) => (
        <button
          key={day}
          onClick={() => onFilterChange(index)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            activeDayFilter === index
              ? activeColorClass
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
