"use client";

import { useState } from "react";
import { format, getDay } from "date-fns";
import { Dumbbell, Plus, Clock, Play, Target, Flame, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FitnessPage() {
  const { data } = useAppStore();
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const today = new Date();
  const dayOfWeek = getDay(today);

  // Get today's workout
  const todayWorkout = data.workoutPlans.find((w) =>
    w.weekday.includes(dayOfWeek)
  );

  // Get weekly schedule
  const weekSchedule = dayNames.map((day, index) => {
    const workout = data.workoutPlans.find((w) => w.weekday.includes(index));
    return {
      day,
      dayIndex: index,
      workout,
      isToday: index === dayOfWeek,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-fitness flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fitness</h1>
            <p className="text-gray-500">Your workout library</p>
          </div>
        </div>
      </header>

      {/* Today's Workout */}
      {todayWorkout ? (
        <div className="lifeos-card p-6 border-2 border-red-100 bg-red-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-600">Today&apos;s Workout</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{todayWorkout.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{todayWorkout.durationMin} minutes</span>
            </div>
          </div>
          <button
            onClick={() => setActiveWorkout(todayWorkout.id)}
            className="mt-4 w-full py-3 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Workout
          </button>
        </div>
      ) : (
        <div className="lifeos-card p-6 text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h2 className="font-semibold text-gray-900">Rest Day</h2>
          <p className="text-sm text-gray-500 mt-1">No workout scheduled for today</p>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Weekly Schedule
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekSchedule.map((day) => (
            <div
              key={day.day}
              className={cn(
                "lifeos-card p-3 text-center",
                day.isToday && "ring-2 ring-red-500",
                day.workout && "bg-red-50"
              )}
            >
              <p
                className={cn(
                  "text-xs font-medium",
                  day.isToday ? "text-red-600" : "text-gray-500"
                )}
              >
                {day.day}
              </p>
              {day.workout ? (
                <div className="mt-2">
                  <Dumbbell
                    className={cn(
                      "w-4 h-4 mx-auto",
                      day.isToday ? "text-red-500" : "text-red-400"
                    )}
                  />
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {day.workout.name.split(" ")[0]}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">Rest</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* All Workouts */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          All Workouts
        </h2>

        {data.workoutPlans.map((workout, index) => (
          <div
            key={workout.id}
            className="lifeos-card p-5 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.durationMin} min</span>
                  </div>
                  <span>•</span>
                  <span>
                    {workout.weekday.map((d) => dayNames[d]).join(", ")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveWorkout(workout.id)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {data.workoutPlans.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No workouts yet</p>
            <p className="text-sm">Create your first workout below</p>
          </div>
        )}
      </div>

      {/* Add New Workout Button */}
      <button className="add-button-dashed w-full py-6">
        <Plus className="w-5 h-5" />
        <span>Add New Workout</span>
      </button>

      {/* Active Workout Modal */}
      {activeWorkout && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveWorkout(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {data.workoutPlans.find((w) => w.id === activeWorkout)?.name}
              </h2>
              <p className="text-gray-500 mb-6">
                {data.workoutPlans.find((w) => w.id === activeWorkout)?.durationMin} minutes
              </p>

              <div className="space-y-3">
                <button className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                  Start Timer
                </button>
                <button
                  onClick={() => setActiveWorkout(null)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
