"use client";

import { AlertTriangle, Info, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface WarningPanelProps {
  warnings: string[];
}

export function WarningPanel({ warnings }: WarningPanelProps) {
  if (warnings.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-amber-800">
            Conflicts & Suggestions
          </h3>
        </div>
        <ul className="space-y-2">
          {warnings.map((warning, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-amber-700"
            >
              {warning.startsWith("⚠️") ? (
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              ) : warning.startsWith("💡") ? (
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              ) : (
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              )}
              <span>{warning.replace(/^[⚠️💡✈️]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
