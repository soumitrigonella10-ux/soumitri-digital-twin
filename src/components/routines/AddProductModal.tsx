// ─────────────────────────────────────────────────────────────
// AddProductModal — Create a new product for a routine type
// Used by: Skincare, Haircare, Body Care, Body Specifics pages
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useCallback } from "react";
import { AdminCrudModal, Field, inputClass, selectClass } from "@/components/AdminCrudModal";

const TIME_OPTIONS = ["AM", "PM", "MIDDAY", "ANY"] as const;
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AddProductModalProps {
  routineType: string;
  apiUrl: string;
  accentColor: string;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
  /** Hair-specific field */
  showHairPhase?: boolean;
  /** Body-specific field */
  showBodyAreas?: boolean;
  bodyAreaOptions?: { code: string; label: string }[];
  /** Show shade field (makeup) */
  showShade?: boolean;
  /** Hide Time of Day and Active Days (makeup) */
  hideSchedule?: boolean;
}

export function AddProductModal({
  routineType,
  apiUrl,
  accentColor,
  categories,
  onClose,
  onSaved,
  showHairPhase = false,
  showBodyAreas = false,
  bodyAreaOptions = [],
  showShade = false,
  hideSchedule = false,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [brand, setBrand] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<string>("AM");
  const [hairPhase, setHairPhase] = useState("daily");
  const [weekdays, setWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [bodyAreas, setBodyAreas] = useState<string[]>([]);
  const [shade, setShade] = useState("");
  const [notes, setNotes] = useState("");
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
      const id = `p-${routineType}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      const payload: Record<string, unknown> = {
        id,
        name: name.trim(),
        category,
        brand: brand.trim() || null,
        routineType,
        timeOfDay: hideSchedule ? null : timeOfDay,
        weekdays: hideSchedule ? null : weekdays,
        notes: notes.trim() || null,
        displayOrder: 99,
      };
      if (showShade) payload.shade = shade.trim() || null;
      if (showHairPhase) payload.hairPhase = hairPhase;
      if (showBodyAreas) payload.bodyAreas = bodyAreas.length > 0 ? bodyAreas : null;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create product");

      setSuccess(true);
      setTimeout(() => { onSaved(); onClose(); }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, category, brand, shade, routineType, timeOfDay, weekdays, notes, hairPhase, bodyAreas, showShade, showHairPhase, showBodyAreas, apiUrl, onSaved, onClose]);

  return (
    <AdminCrudModal
      title="Add Product"
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel="Add Product"
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

      {/* Shade (makeup only) */}
      {showShade && (
        <Field label="Shade">
          <input
            type="text"
            value={shade}
            onChange={(e) => setShade(e.target.value)}
            placeholder="e.g. Warm Nude, Berry"
            className={inputClass}
          />
        </Field>
      )}

      {/* Time of Day */}
      {!hideSchedule && (
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
      )}

      {/* Hair Phase (hair only) */}
      {showHairPhase && (
        <Field label="Hair Phase">
          <select value={hairPhase} onChange={(e) => setHairPhase(e.target.value)} className={selectClass}>
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
      {!hideSchedule && (
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
      )}

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
