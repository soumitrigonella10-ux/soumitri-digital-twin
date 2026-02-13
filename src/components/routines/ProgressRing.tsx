"use client";

import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  percentage: number;
  colorClass: string;
  size?: number;
}

const CIRCUMFERENCE = 87.96; // 2 * Math.PI * 14

export function ProgressRing({ percentage, colorClass, size = 10 }: ProgressRingProps) {
  return (
    <div className={`relative w-${size} h-${size}`} style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
      <svg className={`w-full h-full -rotate-90`} viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${(percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          className={colorClass}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
}

export interface ProgressBarProps {
  percentage: number;
  colorClass: string;
}

export function ProgressBar({ percentage, colorClass }: ProgressBarProps) {
  return (
    <div className="flex-1">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
