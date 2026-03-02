"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  affirmations,
  DAY_THEMES,
  dashboardTimeToAffirmationTime,
} from "@/data/routines/affirmations";
import type { TimeOfDay } from "@/types";

// ── Type badge styling ──
const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  affirmation: { label: "AFFIRMATION", className: "bg-fuchsia-100 text-fuchsia-700" },
  action: { label: "ACTION", className: "bg-amber-100 text-amber-700" },
  visualization: { label: "VISUALIZATION", className: "bg-sky-100 text-sky-700" },
};

interface AffirmationsSectionProps {
  dayOfWeek: number;
  timeOfDay: TimeOfDay;
  dateKey: string;
  getProductCompletion: (dateKey: string, productId: string) => boolean;
  toggleProductCompletion: (dateKey: string, productId: string) => void;
}

export function AffirmationsSection({
  dayOfWeek,
  timeOfDay,
  dateKey,
  getProductCompletion,
  toggleProductCompletion,
}: AffirmationsSectionProps) {
  const affTime = dashboardTimeToAffirmationTime(timeOfDay);
  if (!affTime) return null;

  const items = affirmations.filter(
    (a) => a.weekday === dayOfWeek && a.timeOfDay === affTime
  );

  const dayTheme = DAY_THEMES.find((d) => d.weekday === dayOfWeek);
  const completed = items.filter((a) => getProductCompletion(dateKey, a.id)).length;

  if (items.length === 0) {
    return <p className="text-center text-gray-400 py-8 text-sm">No affirmations for this time</p>;
  }

  return (
    <div className="space-y-4">
      {/* Day Theme */}
      {dayTheme && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-sm">
          <span className="text-base">{dayTheme.emoji}</span>
          <span className="font-semibold text-fuchsia-800">{dayTheme.subtitle}</span>
          <span className="ml-auto text-xs text-fuchsia-500 tabular-nums">{completed}/{items.length}</span>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const done = getProductCompletion(dateKey, item.id);
          const badge = TYPE_BADGE[item.type] ?? { label: "AFFIRMATION", className: "bg-fuchsia-100 text-fuchsia-700" };

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border p-3 transition-all duration-300 animate-slide-in",
                done
                  ? "bg-gray-50 border-gray-200 opacity-70"
                  : "bg-white border-fuchsia-200 hover:border-fuchsia-300 hover:shadow-sm"
              )}
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    done ? "bg-gray-200 text-gray-400" : "bg-fuchsia-100 text-fuchsia-600"
                  )}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-medium text-sm text-gray-900 transition-all",
                      done && "line-through text-gray-500"
                    )}
                  >
                    {item.text}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                    <button
                      onClick={() => toggleProductCompletion(dateKey, item.id)}
                      className={cn(
                        "p-1 rounded-lg transition-all flex-shrink-0",
                        done
                          ? "bg-fuchsia-100 text-fuchsia-600"
                          : "bg-gray-100 text-gray-400 hover:bg-fuchsia-100 hover:text-fuchsia-600"
                      )}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
