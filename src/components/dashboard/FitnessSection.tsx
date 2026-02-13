"use client";

import { Clock, Play } from "lucide-react";
import { WorkoutPlan } from "@/types";

interface FitnessSectionProps {
  todayWorkout: WorkoutPlan | undefined;
}

export function FitnessSection({ todayWorkout }: FitnessSectionProps) {
  if (!todayWorkout) {
    return <p className="text-center text-gray-400 py-8">No workout scheduled</p>;
  }

  return (
    <div className="space-y-3">
      <div className="lifeos-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{todayWorkout.name}</h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{todayWorkout.durationMin} minutes</span>
            </div>
            {todayWorkout.goal && (
              <p className="text-sm text-gray-600 mt-2">{todayWorkout.goal}</p>
            )}
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-colors">
            <Play className="w-4 h-4" />
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
