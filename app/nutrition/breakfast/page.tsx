"use client";

import { useState, useMemo, useCallback } from "react";
import { Coffee, Clock, Calendar, Edit2, Trash2, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCrudModal, Field, inputClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";
import type { MealTemplate, Ingredient } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Meal Template Form Modal ─── */
function MealFormModal({
  meal,
  mealType,
  onClose,
  onSaved,
}: {
  meal?: MealTemplate | null;
  mealType: "breakfast" | "dinner";
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!meal;
  const [name, setName] = useState(meal?.name ?? "");
  const [prepTimeMin, setPrepTimeMin] = useState(meal?.prepTimeMin ?? 0);
  const [cookTimeMin, setCookTimeMin] = useState(meal?.cookTimeMin ?? 0);
  const [servings, setServings] = useState(meal?.servings ?? 1);
  const [weekdays, setWeekdays] = useState<number[]>(meal?.weekdays ?? []);
  const [items] = useState<string[]>(meal?.items?.length ? meal.items : [""]);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    meal?.ingredients?.length ? meal.ingredients : [{ name: "", quantity: "", unit: "" }]
  );
  const [instructions, setInstructions] = useState<string[]>(meal?.instructions?.length ? meal.instructions : [""]);
  const [tags, setTags] = useState(meal?.tags?.join(", ") ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (d: number) => setWeekdays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        id: meal?.id ?? `mt-${mealType}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: name.trim(),
        timeOfDay: mealType === "breakfast" ? "AM" : "PM",
        mealType,
        items: items.filter((i) => i.trim()),
        ingredients: ingredients.filter((i) => i.name.trim()).map((i) => ({
          name: i.name.trim(),
          quantity: i.quantity.trim(),
          unit: i.unit?.trim() || undefined,
        })),
        instructions: instructions.filter((s) => s.trim()),
        weekdays: weekdays.length > 0 ? weekdays : null,
        prepTimeMin: prepTimeMin || null,
        cookTimeMin: cookTimeMin || null,
        servings: servings || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch("/api/meals", {
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
  }, [name, mealType, prepTimeMin, cookTimeMin, servings, weekdays, items, ingredients, instructions, tags, meal?.id, onSaved, onClose]);

  const accentColor = mealType === "breakfast" ? "bg-amber-500" : "bg-indigo-500";

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Dish" : "Add Dish"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor={accentColor}
    >
      <Field label="Name *">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Overnight Oats" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Prep (min)">
          <input type="number" value={prepTimeMin} onChange={(e) => setPrepTimeMin(+e.target.value)} className={inputClass} />
        </Field>
        <Field label="Cook (min)">
          <input type="number" value={cookTimeMin} onChange={(e) => setCookTimeMin(+e.target.value)} className={inputClass} />
        </Field>
        <Field label="Servings">
          <input type="number" value={servings} onChange={(e) => setServings(+e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Schedule Days">
        <div className="flex gap-1 flex-wrap">
          {DAYS_OF_WEEK.map((d, i) => (
            <button key={i} type="button" onClick={() => toggleDay(i)} className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
              weekdays.includes(i)
                ? `${accentColor} text-white border-transparent`
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}>{d}</button>
          ))}
        </div>
      </Field>
      <Field label="Ingredients">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input value={ing.name} onChange={(e) => setIngredients(ingredients.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder="Name" className={cn(inputClass, "flex-1")} />
              <input value={ing.quantity} onChange={(e) => setIngredients(ingredients.map((x, i) => i === idx ? { ...x, quantity: e.target.value } : x))} placeholder="Qty" className={cn(inputClass, "w-20")} />
              <input value={ing.unit ?? ""} onChange={(e) => setIngredients(ingredients.map((x, i) => i === idx ? { ...x, unit: e.target.value } : x))} placeholder="Unit" className={cn(inputClass, "w-16")} />
              <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])} className="mt-1 text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add ingredient</button>
      </Field>
      <Field label="Instructions">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {instructions.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5">{idx + 1}.</span>
              <input value={step} onChange={(e) => { const n = [...instructions]; n[idx] = e.target.value; setInstructions(n); }} className={cn(inputClass, "flex-1")} />
              <button type="button" onClick={() => setInstructions(instructions.filter((_, i) => i !== idx))} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setInstructions([...instructions, ""])} className="mt-1 text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add step</button>
      </Field>
      <Field label="Tags (comma-separated)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="e.g. quick, high-protein" />
      </Field>
    </AdminCrudModal>
  );
}

function BreakfastPageContent() {
  const { data, refreshFromDb } = useAppStore();
  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">("ALL");
  const { isAdmin } = useAdmin();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealTemplate | null>(null);
  const [deletingMeal, setDeletingMeal] = useState<MealTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!deletingMeal) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/meals?id=${deletingMeal.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await refreshFromDb();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setDeletingMeal(null);
    }
  }, [deletingMeal, refreshFromDb]);

  // Filter breakfast meals
  const breakfastMeals = useMemo(() => {
    return data.mealTemplates.filter(
      (m) => m.mealType === "breakfast" || m.timeOfDay === "AM" || m.name.toLowerCase().includes("breakfast")
    );
  }, [data.mealTemplates]);

  // Apply day filter
  const filteredMeals = useMemo(() => {
    if (activeDayFilter === "ALL") return breakfastMeals;
    return breakfastMeals.filter(
      (m) => !m.weekdays || m.weekdays.length === 0 || m.weekdays.includes(activeDayFilter)
    );
  }, [breakfastMeals, activeDayFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-breakfast flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Breakfast</h1>
            <p className="text-gray-500">Morning meal templates</p>
          </div>
        </div>
        {isAdmin && (
          <AdminAddButton onClick={() => setShowAddModal(true)} label="Add Dish" accentColor="bg-amber-500" />
        )}
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="lifeos-card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{breakfastMeals.length}</p>
          <p className="text-sm text-gray-500">Dishes</p>
        </div>
        <div className="lifeos-card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-500">7:00 - 9:00 AM</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Ideal window</p>
        </div>
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Day:</span>
        <button
          onClick={() => setActiveDayFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            activeDayFilter === "ALL"
              ? "bg-amber-100 text-amber-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All Days
        </button>
        {DAYS_OF_WEEK.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDayFilter(index)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeDayFilter === index
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meal Templates */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Your Dishes ({filteredMeals.length})
        </h2>

        {filteredMeals.map((meal, index) => (
          <div
            key={meal.id}
            className="lifeos-card overflow-hidden animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Meal Header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                      Morning
                    </span>
                    {meal.prepTimeMin && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {meal.prepTimeMin + (meal.cookTimeMin || 0)} min
                      </span>
                    )}
                    {meal.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => setEditingMeal(meal)} className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletingMeal(meal)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>

              {/* Schedule Days (read-only) */}
              <div className="mt-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {!meal.weekdays || meal.weekdays.length === 0
                    ? "Every day"
                    : meal.weekdays.length === 7
                    ? "Daily"
                    : meal.weekdays.map((d) => DAYS_OF_WEEK[d]).join(", ")}
                </span>
              </div>
            </div>

            {/* Ingredients - Always visible */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Ingredients
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {meal.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{ing.name}</span>
                      <span className="text-xs text-amber-600 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions - Always visible */}
            {meal.instructions && meal.instructions.length > 0 && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Instructions
                </p>
                <ol className="space-y-2">
                  {meal.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Simple items fallback */}
            {(!meal.ingredients || meal.ingredients.length === 0) && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Components
                </p>
                <div className="flex flex-wrap gap-2">
                  {meal.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredMeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No breakfast dishes found</p>
            <p className="text-sm">Try a different day filter or add new dishes</p>
          </div>
        )}
      </div>

      {/* Add New Template Button */}

      {/* CRUD Modals */}
      {showAddModal && (
        <MealFormModal mealType="breakfast" onClose={() => setShowAddModal(false)} onSaved={refreshFromDb} />
      )}
      {editingMeal && (
        <MealFormModal meal={editingMeal} mealType="breakfast" onClose={() => setEditingMeal(null)} onSaved={refreshFromDb} />
      )}
      {deletingMeal && (
        <DeleteConfirmModal
          itemName={deletingMeal.name}
          onCancel={() => setDeletingMeal(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function BreakfastPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <BreakfastPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
