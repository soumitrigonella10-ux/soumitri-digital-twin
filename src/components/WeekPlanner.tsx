"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Modal } from "./Modal";
import { DayPlan } from "@/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

interface WeekPlannerProps {
  weekStart: Date;
  plans: DayPlan[];
}

export function WeekPlanner({ weekStart, plans }: WeekPlannerProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [todayStr, setTodayStr] = useState<string>("");
  const { filters, setFilters } = useAppStore();

  useEffect(() => {
    setTodayStr(format(new Date(), "yyyy-MM-dd"));
  }, []);

  const days = [...Array(7)].map((_, i) => addDays(weekStart, i));

  return (
    <>
      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {days.map((day, index) => {
          const plan = plans[index]!;
          const isToday = format(day, "yyyy-MM-dd") === todayStr;
          const isSelected = format(day, "yyyy-MM-dd") === format(filters.date, "yyyy-MM-dd");

          const totalSteps = plan.sections.reduce(
            (acc, s) => acc + s.totalSteps,
            0
          );

          const sectionsWithSteps = plan.sections.filter(
            (s) => s.totalSteps > 0
          );

          return (
            <Card
              key={index}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isToday && "ring-2 ring-blue-500",
                isSelected && "bg-blue-50"
              )}
              onClick={() => setSelectedDay(index)}
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span
                    className={cn(
                      "font-medium",
                      isToday && "text-blue-600"
                    )}
                  >
                    {format(day, "EEE")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(day, "d")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Check className="h-3 w-3" />
                    <span>{totalSteps} steps</span>
                  </div>

                  {/* Section Summary */}
                  <div className="flex flex-wrap gap-1">
                    {sectionsWithSteps.slice(0, 3).map((section) => (
                      <Badge
                        key={section.key}
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        {section.key.slice(0, 4)}
                      </Badge>
                    ))}
                    {sectionsWithSteps.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        +{sectionsWithSteps.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Warnings indicator */}
                  {plan.warnings.length > 0 && (
                    <Badge variant="warning" className="text-xs">
                      {plan.warnings.length} warning{plan.warnings.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Day Detail Modal */}
      {selectedDay !== null && plans[selectedDay] && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDay(null)}
          title={format(days[selectedDay]!, "EEEE, MMMM d")}
          className="max-w-2xl"
        >
          <DayDetail
            plan={plans[selectedDay]!}
            onNavigate={() => {
              setFilters({ date: days[selectedDay]! });
              setSelectedDay(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}

// ========================================
// Day Detail Component (for modal)
// ========================================
interface DayDetailProps {
  plan: DayPlan;
  onNavigate: () => void;
}

function DayDetail({ plan, onNavigate }: DayDetailProps) {
  return (
    <div className="space-y-4">
      {/* Warnings */}
      {plan.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-amber-800 mb-2">
            Warnings & Suggestions
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            {plan.warnings.map((w, i) => (
              <li key={i}>{w.replace(/^[⚠️💡✈️]\s*/, "")}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {plan.sections
          .filter((s) => s.totalSteps > 0)
          .map((section) => (
            <div
              key={section.key}
              className="bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {section.key}
                </h4>
                <Badge variant="secondary">{section.totalSteps} steps</Badge>
              </div>

              <ul className="space-y-1">
                {section.routines.map((routine) => (
                  <li key={routine.routineId} className="text-sm">
                    <span className="text-gray-700">{routine.name}</span>
                    <span className="text-gray-400 ml-2">
                      ({routine.steps.length} steps)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Navigate Button */}
      <button
        onClick={onNavigate}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <span>View Full Day</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
