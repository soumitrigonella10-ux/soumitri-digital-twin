// ─────────────────────────────────────────────────────────────
// EditProductModal — Full-featured edit modal for routine products
// Mirrors AddProductModal so every field is editable.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useCallback } from "react";
import { AdminCrudModal, Field, inputClass, selectClass } from "@/components/AdminCrudModal";
import type { Product } from "@/types";

const TIME_OPTIONS = ["AM", "PM", "MIDDAY", "ANY"] as const;
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** @deprecated – kept for backward compat; new code should not rely on this */
export interface EditFormState {
  displayOrder?: number | undefined;
  timeOfDay?: string | undefined;
  weekdays?: number[] | undefined;
}

export interface EditProductModalProps {
  product: Product;
  apiUrl: string;
  accentColor: string;          // tailwind bg class e.g. "bg-pink-500"
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
  /** Hair-specific field */
  showHairPhase?: boolean;
  /** Body-specific field */
  showBodyAreas?: boolean;
  bodyAreaOptions?: { code: string; label: string }[];
}

export function EditProductModal({
  product,
  apiUrl,
  accentColor,
  categories,
  onClose,
  onSaved,
  showHairPhase = false,
  showBodyAreas = false,
  bodyAreaOptions = [],
}: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [brand, setBrand] = useState(product.brand ?? "");
  const [timeOfDay, setTimeOfDay] = useState<string>(product.timeOfDay ?? "AM");
  const [hairPhase, setHairPhase] = useState(product.hairPhase ?? "daily");
  const [weekdays, setWeekdays] = useState<number[]>(product.weekdays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [bodyAreas, setBodyAreas] = useState<string[]>((product.bodyAreas as string[]) ?? []);
  const [notes, setNotes] = useState(product.notes ?? "");
  const [displayOrder, setDisplayOrder] = useState(product.displayOrder ?? 99);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (d: number) => {
    setWeekdays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());
  };

  const toggleArea = (code: string) => {
    setBodyAreas((prev) => prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]);
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !category) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        id: product.id,
        name: name.trim(),
        category,
        brand: brand.trim() || null,
        timeOfDay,
        weekdays,
        notes: notes.trim() || null,
        displayOrder,
      };
      if (showHairPhase) payload.hairPhase = hairPhase;
      if (showBodyAreas) payload.bodyAreas = bodyAreas.length > 0 ? bodyAreas : null;

      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update product");

      setSuccess(true);
      setTimeout(() => { onSaved(); onClose(); }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, category, brand, timeOfDay, weekdays, notes, displayOrder, hairPhase, bodyAreas, showHairPhase, showBodyAreas, apiUrl, product.id, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={`Edit ${product.name}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel="Save Changes"
      accentColor={accentColor}
    >
      {/* Name + Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Product Name *">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cetaphil Cleanser"
            className={inputClass}
          />
        </Field>
        <Field label="Brand">
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Cetaphil"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Category */}
      <Field label="Category *">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      {/* Time of Day */}
      <Field label="Time of Day">
        <div className="flex gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeOfDay(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeOfDay === t
                  ? `${accentColor} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Hair Phase (hair only) */}
      {showHairPhase && (
        <Field label="Hair Phase">
          <select value={hairPhase} onChange={(e) => setHairPhase(e.target.value as "oiling" | "washing" | "postWash" | "daily")} className={selectClass}>
            <option value="oiling">Oiling</option>
            <option value="washing">Washing</option>
            <option value="postWash">Post-Wash</option>
            <option value="daily">Daily</option>
          </select>
        </Field>
      )}

      {/* Body Areas (body-specifics only) */}
      {showBodyAreas && bodyAreaOptions.length > 0 && (
        <Field label="Body Areas">
          <div className="flex flex-wrap gap-2">
            {bodyAreaOptions.map((area) => (
              <button
                key={area.code}
                type="button"
                onClick={() => toggleArea(area.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  bodyAreas.includes(area.code)
                    ? `${accentColor} text-white`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </Field>
      )}

      {/* Weekdays */}
      <Field label="Active Days">
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day, idx) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(idx)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                weekdays.includes(idx)
                  ? `${accentColor} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Field>

      {/* Display Order */}
      <Field label="Display Order">
        <input
          type="number"
          min="1"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
          className={inputClass}
        />
      </Field>

      {/* Notes */}
      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          rows={2}
          className={inputClass}
        />
      </Field>
    </AdminCrudModal>
  );
}
