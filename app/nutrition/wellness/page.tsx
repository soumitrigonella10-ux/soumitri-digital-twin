"use client";

import { useState, useMemo } from "react";
import { Pill, Clock, Sun, Moon, Sparkles, Sunrise, Info, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { RoutineStep } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WellnessPage() {
  const { data } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const [activeTimeFilter, setActiveTimeFilter] = useState<"ALL" | "AM" | "MIDDAY" | "PM">("ALL");

  // Get wellness routines
  const wellnessRoutines = useMemo(() => {
    return data.routines.filter((r) => r.type === "wellness");
  }, [data.routines]);

  // Check if a step applies to the selected day
  const stepAppliesToDay = (step: RoutineStep, dayIndex: number | "ALL") => {
    if (dayIndex === "ALL") return true;
    if (!step.weekdaysOnly || step.weekdaysOnly.length === 0) return true;
    return step.weekdaysOnly.includes(dayIndex);
  };

  // Get days that have special/limited items (not daily)
  const specialDays = useMemo(() => {
    const days = new Set<number>();
    wellnessRoutines.forEach((routine) => {
      routine.steps?.forEach((step: RoutineStep) => {
        if (step.weekdaysOnly && step.weekdaysOnly.length > 0 && step.weekdaysOnly.length < 7) {
          step.weekdaysOnly.forEach((d: number) => days.add(d));
        }
      });
    });
    return days;
  }, [wellnessRoutines]);

  const filteredRoutines = useMemo(() => {
    let filtered = wellnessRoutines;
    
    if (activeTimeFilter !== "ALL") {
      filtered = filtered.filter((r) => r.timeOfDay === activeTimeFilter);
    }
    
    if (activeDayFilter !== "ALL") {
      filtered = filtered.filter(
        (r) => !r.schedule?.weekday || r.schedule.weekday.length === 0 || r.schedule.weekday.includes(activeDayFilter)
      );
    }
    
    return filtered;
  }, [wellnessRoutines, activeDayFilter, activeTimeFilter]);

  // Count routines by time
  const amCount = wellnessRoutines.filter((r) => r.timeOfDay === "AM").length;
  const middayCount = wellnessRoutines.filter((r) => r.timeOfDay === "MIDDAY").length;
  const pmCount = wellnessRoutines.filter((r) => r.timeOfDay === "PM").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-wellness flex items-center justify-center">
            <Pill className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wellness</h1>
            <p className="text-gray-500">Supplements & wellness routines</p>
          </div>
        </div>
      </header>

      {/* Goals Banner */}
      <div className="lifeos-card p-4 bg-gradient-to-r from-teal-50 to-emerald-50">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          Goals
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Glowing skin", "Thick black hair", "Higher energy", "Less pigmentation", "Better cognition", "Deep sleep"].map((goal) => (
            <span key={goal} className="px-2 py-1 text-xs bg-white/70 text-teal-700 rounded-full">
              {goal}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="lifeos-card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{wellnessRoutines.length}</p>
          <p className="text-sm text-gray-500">Routines</p>
        </div>
        <div className="lifeos-card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-bold text-gray-900">{amCount}</span>
          </div>
          <p className="text-sm text-gray-500">Morning</p>
        </div>
        <div className="lifeos-card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Sunrise className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">{middayCount}</span>
          </div>
          <p className="text-sm text-gray-500">Midday</p>
        </div>
        <div className="lifeos-card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span className="text-2xl font-bold text-gray-900">{pmCount}</span>
          </div>
          <p className="text-sm text-gray-500">Night</p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Time:</span>
        {(["ALL", "AM", "MIDDAY", "PM"] as const).map((time) => (
          <button
            key={time}
            onClick={() => setActiveTimeFilter(time)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1",
              activeTimeFilter === time
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {time === "AM" && <Sun className="w-3 h-3" />}
            {time === "MIDDAY" && <Sunrise className="w-3 h-3" />}
            {time === "PM" && <Moon className="w-3 h-3" />}
            {time === "ALL" ? "All Times" : time === "MIDDAY" ? "Midday" : time}
          </button>
        ))}
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
        <button
          onClick={() => setActiveDayFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            activeDayFilter === "ALL"
              ? "bg-teal-100 text-teal-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All Days
        </button>
        {DAYS_OF_WEEK.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDayFilter(index)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all relative",
              activeDayFilter === index
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {day}
            {specialDays.has(index) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" title="Has special items" />
            )}
          </button>
        ))}
      </div>

      {/* Day indicator legend */}
      {specialDays.size > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Days with special supplements (e.g., B12 on Mon & Wed)</span>
        </div>
      )}

      {/* Wellness Routines */}
      {filteredRoutines.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Routines ({filteredRoutines.length})
          </h2>

          {filteredRoutines.map((routine, index) => (
            <div
              key={routine.id}
              className="lifeos-card overflow-hidden animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {routine.timeOfDay === "AM" && <Sun className="w-4 h-4 text-amber-500" />}
                    {routine.timeOfDay === "MIDDAY" && <Sunrise className="w-4 h-4 text-orange-500" />}
                    {routine.timeOfDay === "PM" && <Moon className="w-4 h-4 text-indigo-500" />}
                    <h3 className="font-semibold text-gray-900">{routine.name}</h3>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    routine.timeOfDay === "AM" && "bg-amber-100 text-amber-700",
                    routine.timeOfDay === "MIDDAY" && "bg-orange-100 text-orange-700",
                    routine.timeOfDay === "PM" && "bg-indigo-100 text-indigo-700"
                  )}>
                    {routine.timeOfDay === "MIDDAY" ? "Midday" : routine.timeOfDay}
                  </span>
                </div>

                {/* Steps */}
                {routine.steps && routine.steps.length > 0 && (
                <div className="space-y-2">
                  {routine.steps
                    .filter((step) => activeDayFilter === "ALL" || stepAppliesToDay(step, activeDayFilter))
                    .map((step) => {
                      const isSpecialDay = step.weekdaysOnly && step.weekdaysOnly.length > 0 && step.weekdaysOnly.length < 7;
                      return (
                    <div
                      key={step.order}
                          className={cn(
                            "flex items-start gap-3 p-2 rounded-lg",
                            isSpecialDay ? "bg-amber-50 border border-amber-100" : "bg-gray-50"
                          )}
                    >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            isSpecialDay ? "bg-amber-100" : "bg-teal-100"
                          )}>
                            <span className={cn(
                              "text-xs font-medium",
                              isSpecialDay ? "text-amber-700" : "text-teal-700"
                            )}>{step.order}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{step.title}</p>
                          {step.essential && (
                            <Sparkles className="w-3 h-3 text-amber-500" />
                          )}
                              {isSpecialDay && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                                  <Calendar className="w-3 h-3" />
                                  {step.weekdaysOnly?.map((d) => DAYS_OF_WEEK[d]).join(" & ")}
                                </span>
                              )}
                        </div>
                        {step.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {step.durationMin}m
                      </div>
                    </div>
                      );
                    })}
                </div>
                )}

                {/* Routine Notes */}
                {routine.notes && (
                  <div className="mt-3 p-2 rounded-lg bg-teal-50 flex items-start gap-2">
                    <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-teal-700">{routine.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="lifeos-card p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-500" />
          Daily Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Drink 2.5-3 L water daily
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Add protein at every meal
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Sleep 7-9 hours
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Avoid caffeine after 3 PM
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Sun exposure 15-20 min daily
          </li>
        </ul>
      </div>
    </div>
  );
}
