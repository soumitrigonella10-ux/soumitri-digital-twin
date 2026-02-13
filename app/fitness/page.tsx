"use client";

import { useState } from "react";
import { getDay } from "date-fns";
import { Dumbbell, Plus, Clock, Play, Flame, Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Fitness Page Content
function FitnessPageContent() {
  const { data, refreshWorkoutData } = useAppStore();
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(getDay(new Date()));

  const today = new Date();
  const dayOfWeek = getDay(today);

  // Filter workouts by selected day
  const filteredWorkouts = data.workoutPlans.filter((w) =>
    w.weekday.includes(selectedDay)
  );

  // Get weekly schedule
  const weekSchedule = dayNames.map((day, index) => {
    const workout = data.workoutPlans.find((w) => w.weekday.includes(index));
    return {
      day,
      dayIndex: index,
      workout,
      isToday: index === dayOfWeek,
      isSelected: index === selectedDay,
    };
  });



  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-category-fitness flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Fitness</h1>
            <p className="text-gray-500">Your workout library</p>
          </div>
          <button
            onClick={refreshWorkoutData}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weekSchedule.map((day) => (
            <button
              key={day.dayIndex}
              onClick={() => setSelectedDay(day.dayIndex)}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2",
                day.isSelected
                  ? "bg-red-500 text-white border-red-500"
                  : day.isToday
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              )}
            >
              <div className="text-center">
                <div className="font-semibold">{day.day}</div>
                {day.workout && (
                  <div className="text-xs mt-1 opacity-75">
                    <Dumbbell className="w-3 h-3 mx-auto" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* Selected Day Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {dayNamesFull[selectedDay]} Workouts
        </h2>
        {filteredWorkouts.length > 0 && (
          <span className="text-sm text-gray-500">({filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''})</span>
        )}
      </div>

      {/* Today's Workout or Rest Day */}
      {selectedDay === dayOfWeek && (
        <>
          {filteredWorkouts.length > 0 ? (
            <div className="lifeos-card p-6 border-2 border-red-100 bg-red-50/30">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Today&apos;s Workout</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{filteredWorkouts[0]!.name}</h2>
              {filteredWorkouts[0]!.goal && (
                <p className="text-sm text-gray-600 mt-2">{filteredWorkouts[0]!.goal}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{filteredWorkouts[0]!.durationMin} minutes</span>
                </div>
              </div>
              <button
                onClick={() => setActiveWorkout(filteredWorkouts[0]!.id)}
                className="mt-4 w-full py-3 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Workout
              </button>
            </div>
          ) : (
            <div className="lifeos-card p-6 text-center border-2 border-blue-100 bg-blue-50/30">
              <div className="flex items-center gap-2 justify-center mb-3">
                <Flame className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Today&apos;s Workout</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Complete Rest</h2>
              <p className="text-sm text-gray-600 mt-2">Full recovery and preparation for the week ahead</p>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>0 minutes</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/50 rounded-xl border border-blue-200">
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Complete rest</h4>
                      <p className="text-xs text-gray-600 mt-1">Take the day off from structured exercise</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Meal prep (optional)</h4>
                      <p className="text-xs text-gray-600 mt-1">Prepare for the week ahead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Filtered Workouts */}
      <div className="space-y-4">
        {filteredWorkouts.map((workout, index) => (
          <div
            key={workout.id}
            className="lifeos-card animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Workout Header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{workout.name}</h3>
                  {workout.goal && (
                    <p className="text-sm text-gray-600 mt-1 mb-3">{workout.goal}</p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveWorkout(workout.id);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors ml-4 flex-shrink-0"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Exercises */}
            {workout.sections && (
              <div className="border-t border-gray-200 p-5 space-y-5 bg-gray-50/50">
                {workout.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {section.title}
                      </h4>
                      {section.description && (
                        <span className="text-xs text-gray-500">
                          ({section.description})
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 ml-2">
                      {section.exercises.map((exercise, exIdx) => (
                        <div
                          key={exIdx}
                          className={cn(
                            "p-3 rounded-lg border transition-colors",
                            exercise.isEssential
                              ? "bg-white border-red-200"
                              : "bg-white border-gray-200"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-medium text-gray-900">
                                  {exercise.name}
                                </h5>
                                {exercise.isNew && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    NEW
                                  </span>
                                )}
                                {exercise.isEssential && (
                                  <Zap className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              {exercise.sets && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {exercise.sets}
                                </p>
                              )}
                              {exercise.reps && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {exercise.reps}
                                </p>
                              )}
                              {exercise.notes && (
                                <p className="text-xs text-gray-500 italic mt-1">
                                  {exercise.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No workouts scheduled for {dayNamesFull[selectedDay]}</p>
            <p className="text-sm">Select a different day or add a workout</p>
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

export default function FitnessPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <FitnessPageContent />
      </div>
    </AuthenticatedLayout>
  );
}
