"use client";

import { useState, useCallback } from "react";
import { getDay } from "date-fns";
import { Dumbbell, Clock, Zap, Edit2, Trash2, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCrudModal, Field, inputClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import type { WorkoutPlan, WorkoutSection } from "@/types";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ─── Workout Plan Form Modal ─── */
function WorkoutPlanFormModal({
  plan,
  onClose,
  onSaved,
}: {
  plan?: WorkoutPlan | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!plan;
  const [name, setName] = useState(plan?.name ?? "");
  const [durationMin, setDurationMin] = useState(plan?.durationMin ?? 30);
  const [goal, setGoal] = useState(plan?.goal ?? "");
  const [weekday, setWeekday] = useState<number[]>(plan?.weekday ?? []);
  const [sections, setSections] = useState<(WorkoutSection & { _key: number })[]>(
    plan?.sections.map((s, i) => ({ ...s, _key: i })) ?? [{ _key: 0, title: "", exercises: [{ name: "" }] }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextKey, setNextKey] = useState(plan?.sections.length ?? 1);

  const toggleDay = (d: number) => setWeekday((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());

  const addSection = () => {
    setSections([...sections, { _key: nextKey, title: "", exercises: [{ name: "" }] }]);
    setNextKey(nextKey + 1);
  };
  const removeSection = (idx: number) => setSections(sections.filter((_, i) => i !== idx));

  const updateSection = (idx: number, field: string, value: string) => {
    setSections(sections.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addExercise = (sIdx: number) => {
    setSections(sections.map((s, i) => i === sIdx ? { ...s, exercises: [...s.exercises, { name: "" }] } : s));
  };
  const removeExercise = (sIdx: number, eIdx: number) => {
    setSections(sections.map((s, i) => i === sIdx ? { ...s, exercises: s.exercises.filter((_, j) => j !== eIdx) } : s));
  };
  const updateExercise = (sIdx: number, eIdx: number, field: string, value: string | boolean) => {
    setSections(sections.map((s, i) => i === sIdx ? {
      ...s,
      exercises: s.exercises.map((e, j) => j === eIdx ? { ...e, [field]: value } : e),
    } : s));
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || weekday.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        id: plan?.id ?? `wp-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: name.trim(),
        durationMin,
        goal: goal.trim() || null,
        weekday,
        sections: sections.map((s, si) => ({
          title: s.title.trim(),
          description: s.description?.trim() || null,
          sortOrder: si + 1,
          exercises: s.exercises.filter((e) => e.name.trim()).map((e, ei) => ({
            name: e.name.trim(),
            sets: e.sets?.trim() || null,
            reps: e.reps?.trim() || null,
            notes: e.notes?.trim() || null,
            isNew: e.isNew ?? false,
            isEssential: e.isEssential ?? false,
            sortOrder: ei + 1,
          })),
        })),
      };
      const res = await fetch("/api/fitness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed");
      setSuccess(true);
      setTimeout(() => { onSaved(); onClose(); }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, durationMin, goal, weekday, sections, plan?.id, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Workout Plan" : "Add Workout Plan"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor="bg-red-500"
    >
      <Field label="Name *">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Upper Body Strength" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration (min)">
          <input type="number" value={durationMin} onChange={(e) => setDurationMin(+e.target.value)} className={inputClass} />
        </Field>
        <Field label="Goal">
          <input value={goal} onChange={(e) => setGoal(e.target.value)} className={inputClass} placeholder="Focus area" />
        </Field>
      </div>
      <Field label="Days *">
        <div className="flex gap-1 flex-wrap">
          {dayNames.map((d, i) => (
            <button key={i} type="button" onClick={() => toggleDay(i)} className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
              weekday.includes(i)
                ? "bg-red-500 text-white border-red-500"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}>{d}</button>
          ))}
        </div>
      </Field>

      {/* Sections */}
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">Sections</span>
          <button type="button" onClick={addSection} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Section</button>
        </div>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {sections.map((section, sIdx) => (
            <div key={section._key} className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <input value={section.title} onChange={(e) => updateSection(sIdx, "title", e.target.value)} placeholder="Section title" className={cn(inputClass, "flex-1 text-sm font-medium")} />
                <button type="button" onClick={() => removeSection(sIdx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input value={section.description ?? ""} onChange={(e) => updateSection(sIdx, "description", e.target.value)} placeholder="Description (optional)" className={cn(inputClass, "text-xs")} />

              {/* Exercises */}
              <div className="space-y-2 ml-2">
                {section.exercises.map((ex, eIdx) => (
                  <div key={eIdx} className="grid grid-cols-[1fr_60px_60px_auto] gap-1 items-center">
                    <input value={ex.name} onChange={(e) => updateExercise(sIdx, eIdx, "name", e.target.value)} placeholder="Exercise" className={cn(inputClass, "text-xs")} />
                    <input value={ex.sets ?? ""} onChange={(e) => updateExercise(sIdx, eIdx, "sets", e.target.value)} placeholder="Sets" className={cn(inputClass, "text-xs")} />
                    <input value={ex.reps ?? ""} onChange={(e) => updateExercise(sIdx, eIdx, "reps", e.target.value)} placeholder="Reps" className={cn(inputClass, "text-xs")} />
                    <button type="button" onClick={() => removeExercise(sIdx, eIdx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addExercise(sIdx)} className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 ml-1"><Plus className="w-3 h-3" /> Exercise</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminCrudModal>
  );
}

// Fitness Page Content
function FitnessPageContent() {
  const { data, refreshFromDb } = useAppStore();
  const [selectedDay, setSelectedDay] = useState<number>(getDay(new Date()));
  const { isAdmin } = useAdmin();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<WorkoutPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const today = new Date();
  const dayOfWeek = getDay(today);

  const handleDelete = useCallback(async () => {
    if (!deletingPlan) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/fitness?id=${deletingPlan.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await refreshFromDb();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setDeletingPlan(null);
    }
  }, [deletingPlan, refreshFromDb]);

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
          {isAdmin && (
            <AdminAddButton onClick={() => setShowAddModal(true)} label="Add Workout" accentColor="bg-red-500" />
          )}
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
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingPlan(workout)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeletingPlan(workout)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
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

      {/* CRUD Modals */}
      {showAddModal && (
        <WorkoutPlanFormModal onClose={() => setShowAddModal(false)} onSaved={refreshFromDb} />
      )}
      {editingPlan && (
        <WorkoutPlanFormModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSaved={refreshFromDb} />
      )}
      {deletingPlan && (
        <DeleteConfirmModal
          itemName={deletingPlan.name}
          onCancel={() => setDeletingPlan(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function FitnessPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <FitnessPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
