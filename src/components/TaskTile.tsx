"use client";

import { useState } from "react";
import { Check, AlertTriangle, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnrichedStep } from "@/types";

interface TaskTileProps {
  step: EnrichedStep;
  isCompleted: boolean;
  onToggle: () => void;
  categoryColor?: string;
  isPriority?: boolean;
  showWarning?: boolean;
  warningText?: string;
}

export function TaskTile({
  step,
  isCompleted,
  onToggle,
  categoryColor: _categoryColor = "gray",
  isPriority = false,
  showWarning = false,
  warningText,
}: TaskTileProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "task-tile group",
        isCompleted && "task-tile-checked",
        isPriority && !isCompleted && "priority-warning",
        !isPriority && !isCompleted && "border-gray-100"
      )}
    >
      {/* Check Circle */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
            isCompleted
              ? "bg-green-500 border-green-500"
              : isPriority
              ? "border-purple-300"
              : "border-gray-300 group-hover:border-gray-400"
          )}
        >
          {isCompleted && (
            <Check
              className={cn(
                "w-3.5 h-3.5 text-white",
                isAnimating && "animate-check"
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-medium transition-all duration-300 task-text",
                isCompleted ? "text-gray-400 line-through" : "text-gray-900"
              )}
            >
              {step.title}
            </h4>
            {showWarning && (
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
          </div>

          {step.description && (
            <p
              className={cn(
                "text-xs mt-0.5 transition-all duration-300",
                isCompleted ? "text-gray-300" : "text-gray-500"
              )}
            >
              {step.description}
            </p>
          )}

          {/* Product Tags */}
          {step.products && step.products.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {step.products.map((product) => (
                <span
                  key={product.id}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs",
                    isCompleted
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {product.name}
                </span>
              ))}
            </div>
          )}

          {/* Warning Text */}
          {warningText && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
              <Info className="w-3.5 h-3.5" />
              <span>{warningText}</span>
            </div>
          )}
        </div>

        {/* Duration */}
        {step.durationMin && !isCompleted && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{step.durationMin}m</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// Section Header Component
// ========================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string | undefined;
  icon: React.ReactNode;
  color: string;
  progress?: number | undefined;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  color,
  progress,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            `bg-category-${color}`
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}

// ========================================
// Smart Section Card
// ========================================
interface SmartSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  progress?: number;
  className?: string;
}

export function SmartSection({
  title,
  subtitle,
  icon,
  color,
  children,
  progress,
  className,
}: SmartSectionProps) {
  return (
    <section className={cn("animate-slide-in", className)}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        color={color}
        progress={progress}
      />
      <div className="space-y-3">{children}</div>
    </section>
  );
}
