"use client";

import { useEffect, useRef, useState } from "react";
import type { SkillExperiment } from "@/types/editorial";
import { Check } from "lucide-react";

interface SkillCardProps {
  skill: SkillExperiment;
}

export function SkillCard({ skill }: SkillCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isAchieved = skill.proficiency >= 75;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col h-full rounded-lg border transition-all duration-300 p-4 ${
        isAchieved
          ? "bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200 hover:border-emerald-300 hover:shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Header with Badge */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className={`text-sm font-semibold flex-1 ${
            isAchieved
              ? "text-emerald-900"
              : "text-gray-900"
          }`}
        >
          {skill.name}
        </h3>
        
        {isAchieved && (
          <div className="ml-2 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Body - Flexible grow */}
      <div className="flex-1 flex flex-col">
        {/* Category/Tags */}
        <div className="mb-3 flex-1">
          <p
            className={`text-[10px] uppercase tracking-widest font-medium ${
              isAchieved
                ? "text-emerald-700"
                : "text-gray-500"
            }`}
          >
            {skill.category}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          {/* Percentage */}
          <div className="flex items-baseline gap-1">
            <span
              className={`text-lg font-bold ${
                isAchieved
                  ? "text-emerald-600"
                  : "text-gray-700"
              }`}
            >
              {skill.proficiency}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${
                isAchieved
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-amber-700 to-amber-900"
              }`}
              style={{
                width: isVisible ? `${Math.min(skill.proficiency, 100)}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer - Tags/Tools */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div
          className={`text-[9px] uppercase tracking-[0.08em] font-medium ${
            isAchieved
              ? "text-emerald-600"
              : "text-gray-400"
          }`}
        >
          {skill.tools.slice(0, 3).join(" · ")}
          {skill.tools.length > 3 && " · ..."}
        </div>
      </div>
    </div>
  );
}
