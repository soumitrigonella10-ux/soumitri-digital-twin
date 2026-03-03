"use client";

import { useState, useMemo, useCallback } from "react";
import { getDay, format } from "date-fns";
import { Sunrise, Sun, Moon, CheckCircle2, Flame, Loader2, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { DayOfWeekFilter } from "@/components/routines";
import { useDbData } from "@/hooks/useDbData";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCrudModal, Field, inputClass, selectClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";

// ── Types (previously in data file, now kept as local types) ──
export type AffirmationType = "affirmation" | "action" | "visualization";
export type AffirmationTime = "morning" | "midday" | "evening";

export interface Affirmation {
  id: string;
  text: string;
  type: AffirmationType;
  timeOfDay: AffirmationTime;
  weekday: number;
}

export interface DayTheme {
  weekday: number;
  emoji: string;
  title: string;
  subtitle: string;
}

// ── Type badge styling ──
const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  affirmation: {
    label: "AFFIRMATION",
    className: "bg-fuchsia-100 text-fuchsia-700",
  },
  action: {
    label: "ACTION ITEM",
    className: "bg-amber-100 text-amber-700",
  },
  visualization: {
    label: "VISUALIZATION",
    className: "bg-sky-100 text-sky-700",
  },
};

// ── Column config ──
const COLUMNS: {
  key: AffirmationTime;
  label: string;
  icon: typeof Sunrise;
  iconClass: string;
}[] = [
  { key: "morning", label: "Morning", icon: Sunrise, iconClass: "text-amber-500" },
  { key: "midday", label: "Midday", icon: Sun, iconClass: "text-fuchsia-500" },
  { key: "evening", label: "Evening", icon: Moon, iconClass: "text-indigo-400" },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Affirmation Form Modal ──
function AffirmationFormModal({
  item,
  defaultWeekday,
  onClose,
  onSaved,
}: {
  item?: Affirmation | null;
  defaultWeekday: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!item;
  const [text, setText] = useState(item?.text ?? "");
  const [type, setType] = useState<AffirmationType>(item?.type ?? "affirmation");
  const [timeOfDay, setTimeOfDay] = useState<AffirmationTime>(item?.timeOfDay ?? "morning");
  const [weekday, setWeekday] = useState<number>(item?.weekday ?? defaultWeekday);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        entity: "affirmation",
        id: item?.id ?? `aff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: text.trim(),
        type,
        timeOfDay,
        weekday,
      };
      const res = await fetch("/api/affirmations", {
        method: isEdit ? "PATCH" : "POST",
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
  }, [text, type, timeOfDay, weekday, item?.id, isEdit, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Affirmation" : "Add Affirmation"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor="bg-fuchsia-600"
    >
      <Field label="Text *">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="I am..." className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value as AffirmationType)} className={selectClass}>
            <option value="affirmation">Affirmation</option>
            <option value="action">Action</option>
            <option value="visualization">Visualization</option>
          </select>
        </Field>
        <Field label="Time of Day">
          <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value as AffirmationTime)} className={selectClass}>
            <option value="morning">Morning</option>
            <option value="midday">Midday</option>
            <option value="evening">Evening</option>
          </select>
        </Field>
      </div>
      <Field label="Weekday">
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day, idx) => (
            <button
              key={day}
              type="button"
              onClick={() => setWeekday(idx)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                weekday === idx ? "bg-fuchsia-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Field>
    </AdminCrudModal>
  );
}

// ── Affirmation Card ──
function AffirmationCard({
  item,
  index,
  completed,
  onToggle,
  onEdit,
  onDelete,
  animDelay,
}: {
  item: Affirmation;
  index: number;
  completed: boolean;
  onToggle: () => void;
  onEdit?: (() => void) | undefined;
  onDelete?: (() => void) | undefined;
  animDelay: number;
}) {
  const badge = TYPE_BADGE[item.type] ?? { label: "AFFIRMATION", className: "bg-fuchsia-100 text-fuchsia-700" };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-300 animate-slide-in",
        completed
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-fuchsia-200 hover:border-fuchsia-300 hover:shadow-sm"
      )}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Number circle */}
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
            completed ? "bg-gray-200 text-gray-400" : "bg-fuchsia-100 text-fuchsia-600"
          )}
        >
          {index + 1}
        </div>

        {/* Text + badge */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-sm leading-relaxed text-gray-900 transition-all",
              completed && "line-through text-gray-400"
            )}
          >
            {item.text}
          </p>
          <span
            className={cn(
              "inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase",
              badge.className
            )}
          >
            {badge.label}
          </span>
        </div>

        {/* Checkbox + Admin Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onEdit && (
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              completed
                ? "bg-fuchsia-100 text-fuchsia-600"
                : "bg-gray-100 text-gray-300 hover:bg-fuchsia-50 hover:text-fuchsia-500"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Content ──
function AffirmationsPageContent() {
  const today = new Date();
  const todayDow = getDay(today);
  const dateKey = format(today, "yyyy-MM-dd");

  const [activeDayFilter, setActiveDayFilter] = useState<number | "ALL">(todayDow);
  const { isAdmin } = useAdmin();

  const { getProductCompletion, toggleProductCompletion } = useAppStore();

  // Fetch from DB
  const { data, loading, refetch } = useDbData<{ affirmations: Affirmation[]; dayThemes: DayTheme[] }>(
    "/api/affirmations",
    { affirmations: [], dayThemes: [] }
  );
  const allAffirmations = data.affirmations;
  const allDayThemes = data.dayThemes;

  // CRUD state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Affirmation | null>(null);
  const [deletingItem, setDeletingItem] = useState<Affirmation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/affirmations?entity=affirmation&id=${deletingItem.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      refetch();
      setDeletingItem(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingItem, refetch]);

  // Filter affirmations for chosen day(s)
  const filtered = useMemo(() => {
    if (activeDayFilter === "ALL") return allAffirmations;
    return allAffirmations.filter((a) => a.weekday === activeDayFilter);
  }, [activeDayFilter, allAffirmations]);

  // Group per column
  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      items: filtered.filter((a) => a.timeOfDay === col.key),
    }));
  }, [filtered]);

  // Day theme
  const dayTheme =
    activeDayFilter !== "ALL"
      ? allDayThemes.find((d) => d.weekday === activeDayFilter)
      : null;

  // Column-level progress
  const getProgress = (items: Affirmation[]) => {
    const done = items.filter((a) => getProductCompletion(dateKey, a.id)).length;
    return { done, total: items.length };
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-affirmations flex items-center justify-center">
            <Flame className="w-6 h-6 text-fuchsia-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Affirmations Rituals</h1>
            <p className="text-gray-500">Track your trajectory and daily manifestations</p>
          </div>
          {isAdmin && <AdminAddButton onClick={() => setShowAddModal(true)} accentColor="bg-fuchsia-600" />}
        </div>
      </header>

      {/* Day Filter */}
      <DayOfWeekFilter
        activeDayFilter={activeDayFilter}
        onFilterChange={setActiveDayFilter}
        activeColorClass="bg-fuchsia-100 text-fuchsia-700"
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-fuchsia-400" />
        </div>
      )}

      {/* Day Theme Banner (single-day mode) */}
      {dayTheme && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-sm animate-fade-in">
          <span className="text-lg">{dayTheme.emoji}</span>
          <span className="font-semibold text-fuchsia-800">{dayTheme.title}</span>
          <span className="text-fuchsia-600">— {dayTheme.subtitle}</span>
        </div>
      )}

      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
        {columns.map((col) => {
          const Icon = col.icon;
          const progress = getProgress(col.items);

          return (
            <div key={col.key} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", col.iconClass)} />
                  <h3 className="font-semibold text-gray-900">{col.label}</h3>
                </div>
                <span className="text-xs text-gray-500 tabular-nums">
                  {progress.done}/{progress.total}
                </span>
              </div>

              {/* Cards */}
              {col.items.length > 0 ? (
                <div className="space-y-3">
                  {col.items.map((item, idx) => (
                    <AffirmationCard
                      key={item.id}
                      item={item}
                      index={idx}
                      completed={getProductCompletion(dateKey, item.id)}
                      onToggle={() => toggleProductCompletion(dateKey, item.id)}
                      onEdit={isAdmin ? () => setEditingItem(item) : undefined}
                      onDelete={isAdmin ? () => setDeletingItem(item) : undefined}
                      animDelay={idx * 75}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No affirmations
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <AffirmationFormModal
          item={editingItem}
          defaultWeekday={typeof activeDayFilter === "number" ? activeDayFilter : todayDow}
          onClose={() => { setShowAddModal(false); setEditingItem(null); }}
          onSaved={refetch}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <DeleteConfirmModal
          itemName={deletingItem.text.slice(0, 50) + (deletingItem.text.length > 50 ? "…" : "")}
          onConfirm={handleDelete}
          onCancel={() => setDeletingItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function AffirmationsPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <AffirmationsPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
