"use client";

import { useState, useEffect } from "react";
import { Check, Clock, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { EnrichedStep, PlanSection } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  section: PlanSection;
  dateKey: string;
}

export function SectionCard({ section, dateKey }: SectionCardProps) {
  const { toggleStepCompletion, getStepCompletion, getSectionCompletion } =
    useAppStore();

  const completionPct = getSectionCompletion(
    dateKey,
    section.key,
    section.totalSteps
  );

  // Calculate total duration
  const totalDuration = section.routines.reduce(
    (acc, routine) =>
      acc +
      routine.steps.reduce((stepAcc, step) => stepAcc + (step.durationMin || 0), 0),
    0
  );

  if (section.routines.length === 0 || section.totalSteps === 0) {
    return (
      <Card className="opacity-60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            {section.key}
            <Badge variant="secondary">No items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No routines scheduled for current filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{section.key}</span>
          <div className="flex items-center gap-2">
            {totalDuration > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {totalDuration} min
              </Badge>
            )}
            <Badge variant={completionPct === 100 ? "success" : "outline"}>
              {completionPct}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.routines.map((routine) => (
          <div key={routine.routineId} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">{routine.name}</h4>
            <ul className="space-y-2">
              {routine.steps.map((step) => (
                <StepItem
                  key={`${routine.routineId}-${step.order}`}
                  step={step}
                  routineId={routine.routineId}
                  sectionKey={section.key}
                  dateKey={dateKey}
                  isChecked={getStepCompletion(
                    dateKey,
                    section.key,
                    routine.routineId,
                    step.order
                  )}
                  onToggle={(checked) =>
                    toggleStepCompletion(
                      dateKey,
                      section.key,
                      routine.routineId,
                      step.order,
                      checked
                    )
                  }
                />
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ========================================
// Step Item Component
// ========================================
interface StepItemProps {
  step: EnrichedStep;
  routineId: string;
  sectionKey: string;
  dateKey: string;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

function StepItem({ step, isChecked, onToggle }: StepItemProps) {
  const [checked, setChecked] = useState(isChecked);

  // Sync with store state
  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onToggle(newValue);
  };

  return (
    <li
      className={cn(
        "flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors",
        checked ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
      )}
      onClick={handleToggle}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "flex items-center justify-center h-5 w-5 rounded-md border-2 flex-shrink-0 mt-0.5 transition-colors",
          checked
            ? "bg-green-500 border-green-500"
            : "bg-white border-gray-300"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              checked && "line-through text-gray-400"
            )}
          >
            {step.title}
          </span>
          {step.durationMin && (
            <span className="text-xs text-gray-400">{step.durationMin} min</span>
          )}
          {step.essential && (
            <Badge variant="warning" className="text-xs">
              Essential
            </Badge>
          )}
        </div>

        {step.description && (
          <p
            className={cn(
              "text-xs text-gray-500 mt-0.5",
              checked && "line-through"
            )}
          >
            {step.description}
          </p>
        )}

        {/* Products */}
        {step.products.length > 0 && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <Package className="h-3 w-3 text-gray-400" />
            {step.products.map((product) => (
              <span
                key={product.id}
                className="text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600"
              >
                {product.name}
              </span>
            ))}
          </div>
        )}

        {/* Body Areas */}
        {step.bodyAreas && step.bodyAreas.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {step.bodyAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
