"use client";

// ========================================
// ListDetail — List View with Expandable Items
//
// Inspired by the Skills/Completed pattern: a scrollable list
// where clicking an item expands an inline detail panel.
// Supports progress bars, completion states, and category pills.
// ========================================

import { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle2, Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { colors, typography, motion as motionTokens, radii } from "./tokens";
import type { ListDetailProps, ListDetailItem } from "./types";

// ── Single list item ─────────────────────

interface ListItemRowProps {
  item: ListDetailItem;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function ListItemRow({ item, isExpanded, onToggle, index }: ListItemRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, item]);

  const isAchieved = item.isCompleted || (item.progress !== undefined && item.progress >= 75);
  const thumbMedia = item.media?.[0];

  return (
    <div
      className={cn(
        "border transition-all duration-300",
        radii.card,
        isAchieved
          ? "bg-gradient-to-br from-emerald-50 to-emerald-50/30 border-emerald-200 hover:border-emerald-300"
          : "bg-white border-stone-200 hover:border-stone-300",
        isExpanded && "shadow-md"
      )}
      style={{ animationDelay: motionTokens.staggerDelay(index) }}
    >
      {/* ── Collapsed row ── */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 flex items-center gap-3 sm:gap-4 group"
        aria-expanded={isExpanded}
      >
        {/* Thumbnail */}
        {thumbMedia && (
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
            <Image
              src={thumbMedia.src}
              alt={thumbMedia.alt}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}

        {/* Number badge (when no thumbnail) */}
        {!thumbMedia && (
          <div
            className={cn(
              "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm",
              radii.pill,
              isAchieved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-stone-100 text-stone-600"
            )}
          >
            {index + 1}
          </div>
        )}

        {/* Completion check */}
        {isAchieved && (
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
        )}

        {/* Title + category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                "text-sm sm:text-base font-semibold truncate",
                isAchieved ? "text-emerald-900" : "text-stone-900"
              )}
            >
              {item.title}
            </h3>
            {item.category && (
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-medium flex-shrink-0",
                  radii.pill,
                  isAchieved
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-500"
                )}
              >
                {item.category}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {item.progress !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    isAchieved
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      : "bg-gradient-to-r from-amber-700 to-amber-900"
                  )}
                  style={{ width: `${Math.min(item.progress, 100)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  isAchieved ? "text-emerald-600" : "text-stone-600"
                )}
              >
                {item.progress}%
              </span>
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-300",
            isAchieved ? "text-emerald-400" : "text-stone-400",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* ── Expanded detail ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : 0 }}
      >
        <div ref={contentRef} className="px-4 sm:px-5 pb-5">
          <div
            className="pt-3 border-t"
            style={{ borderColor: colors.border.light }}
          >
            {/* Subtitle */}
            {item.subtitle && (
              <p className="font-editorial text-sm text-stone-600 mb-3">
                {item.subtitle}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={cn(
                      "px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] font-medium",
                      radii.pill,
                      tag.className ?? "bg-stone-100 text-stone-500"
                    )}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            {/* Body */}
            {item.body && (
              <div className="mt-2">
                {typeof item.body === "string" ? (
                  <p
                    className={cn(typography.body, "text-sm font-light")}
                    style={{ color: `${colors.text.heading}CC`, lineHeight: "1.8" }}
                  >
                    {item.body}
                  </p>
                ) : (
                  item.body
                )}
              </div>
            )}

            {/* Metadata */}
            {item.metadata && item.metadata.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {item.metadata.map((m) => (
                  <div key={m.label}>
                    <dt
                      className={typography.label}
                      style={{ color: colors.accent.oxblood }}
                    >
                      {m.label}
                    </dt>
                    <dd className="font-editorial text-sm mt-0.5 text-stone-700">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </div>
            )}

            {/* Tools / footer labels */}
            {item.tools && item.tools.length > 0 && (
              <div className="mt-3 pt-2 border-t border-stone-100">
                <span
                  className={cn(
                    "text-[9px] uppercase tracking-[0.08em] font-medium",
                    isAchieved ? "text-emerald-600" : "text-stone-400"
                  )}
                >
                  {item.tools.join(" · ")}
                </span>
              </div>
            )}

            {/* Actions */}
            {item.actions && item.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.actions.map((action) =>
                  action.href ? (
                    <a
                      key={action.label}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "font-editorial text-xs font-semibold tracking-[0.05em] underline underline-offset-4 transition-colors",
                      )}
                      style={{ color: colors.accent.amber }}
                    >
                      {action.label} →
                    </a>
                  ) : (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="font-editorial text-xs font-semibold tracking-[0.05em] underline underline-offset-4 transition-colors"
                      style={{ color: colors.accent.amber }}
                    >
                      {action.label} →
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────

export function ListDetail({
  items,
  title,
  layoutVariant = "default",
  className,
}: ListDetailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isCompact = layoutVariant === "compact";

  return (
    <section
      className={cn(
        "w-full",
        layoutVariant === "centered" && "max-w-3xl mx-auto",
        className
      )}
    >
      {/* Header */}
      {title && (
        <div className="mb-6 lg:mb-8">
          <h2
            className={typography.sectionTitle}
            style={{ color: colors.text.heading }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* List */}
      <div className={cn(isCompact ? "space-y-2" : "space-y-3")}>
        {items.map((item, i) => (
          <ListItemRow
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
            index={i}
          />
        ))}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className={typography.meta}>
            {items.filter((i) => i.isCompleted || (i.progress !== undefined && i.progress >= 75)).length}{" "}
            / {items.length} completed
          </span>
          <CheckCircle2 className="w-4 h-4 text-stone-300" />
        </div>
      )}
    </section>
  );
}
