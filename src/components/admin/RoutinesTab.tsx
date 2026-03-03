"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Trash2, Plus, Pencil, Loader2, Save,
  ChevronDown, ChevronRight, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ToastProvider";
import type { Routine, RoutineStep } from "@/types";

// ── Constants ────────────────────────────────────────────────

const ROUTINE_TYPES = ["skin", "hair", "body", "bodySpecific", "wellness", "workout", "food"];
const TIME_OPTIONS = ["AM", "PM", "MIDDAY", "ANY"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Schema ───────────────────────────────────────────────────

const stepSchema = z.object({
  order: z.number(),
  title: z.string().min(1, "Step title required"),
  description: z.string().optional(),
  durationMin: z.string().optional(),
  productIds: z.string().optional(),
  essential: z.boolean().optional(),
});

const routineSchema = z.object({
  id: z.string().min(1, "ID is required"),
  type: z.string().min(1, "Type is required"),
  name: z.string().min(1, "Name is required"),
  timeOfDay: z.string().min(1, "Time of day is required"),
  weekdays: z.array(z.boolean()).length(7),
  tagOffice: z.boolean(),
  tagWfh: z.boolean(),
  tagTravel: z.boolean(),
  tagGoingOut: z.boolean(),
  productIds: z.string().optional(),
  notes: z.string().optional(),
  steps: z.array(stepSchema),
});

type RoutineForm = z.infer<typeof routineSchema>;

// ── Helpers ──────────────────────────────────────────────────

function routineToForm(r: Routine): RoutineForm {
  const wd = Array(7).fill(false) as boolean[];
  r.schedule.weekday?.forEach((d) => { wd[d] = true; });

  return {
    id: r.id,
    type: r.type,
    name: r.name,
    timeOfDay: r.timeOfDay,
    weekdays: wd,
    tagOffice: r.tags.office ?? false,
    tagWfh: r.tags.wfh ?? false,
    tagTravel: r.tags.travel ?? false,
    tagGoingOut: r.tags.goingOut ?? false,
    productIds: r.productIds?.join(", ") ?? "",
    notes: r.notes ?? "",
    steps: r.steps?.map((s, i) => ({
      order: s.order ?? i + 1,
      title: s.title,
      description: s.description ?? "",
      durationMin: s.durationMin?.toString() ?? "",
      productIds: s.productIds?.join(", ") ?? "",
      essential: s.essential ?? false,
    })) ?? [],
  };
}

function formToRoutine(v: RoutineForm): Routine {
  const weekday = v.weekdays
    .map((on, i) => (on ? i : -1))
    .filter((i) => i >= 0);

  const routine: Routine = {
    id: v.id.trim(),
    type: v.type as Routine["type"],
    name: v.name.trim(),
    timeOfDay: v.timeOfDay as Routine["timeOfDay"],
    schedule: { weekday },
    tags: {
      office: v.tagOffice,
      wfh: v.tagWfh,
      travel: v.tagTravel,
      goingOut: v.tagGoingOut,
    },
  };

  const pids = v.productIds?.split(",").map((s) => s.trim()).filter(Boolean);
  if (pids?.length) routine.productIds = pids;
  if (v.notes?.trim()) routine.notes = v.notes.trim();

  if (v.steps.length) {
    routine.steps = v.steps.map((s, i) => {
      const step: RoutineStep = {
        order: s.order ?? i + 1,
        title: s.title.trim(),
      };
      if (s.description?.trim()) step.description = s.description.trim();
      if (s.durationMin) step.durationMin = Number(s.durationMin);
      const stepPids = s.productIds?.split(",").map((x) => x.trim()).filter(Boolean);
      if (stepPids?.length) step.productIds = stepPids;
      if (s.essential) step.essential = true;
      return step;
    });
  }

  return routine;
}

const EMPTY_FORM: RoutineForm = {
  id: "", type: "", name: "", timeOfDay: "",
  weekdays: Array(7).fill(false),
  tagOffice: false, tagWfh: false, tagTravel: false, tagGoingOut: false,
  productIds: "", notes: "", steps: [],
};

// ── Component ────────────────────────────────────────────────

export function RoutinesTab() {
  const { data, upsertRoutine, deleteById, refreshFromDb } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoutineForm>({
    resolver: zodResolver(routineSchema),
    defaultValues: EMPTY_FORM,
  });

  const { fields: stepFields, append: addStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps",
  });

  const watchWeekdays = watch("weekdays");

  // ── Save ────────────────────────────────────────────────

  const onSubmit = async (values: RoutineForm) => {
    setSaving(true);
    try {
      const routine = formToRoutine(values);

      const res = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routine),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      upsertRoutine(routine);
      toast({
        title: editingId ? "Routine updated" : "Routine created",
        description: routine.name,
        variant: "success",
      });

      reset(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      await refreshFromDb();
    } catch (err) {
      toast({
        title: "Failed to save routine",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this routine? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/routines?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      deleteById("routines", id);
      toast({ title: "Routine deleted", variant: "success" });
      await refreshFromDb();
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Edit ────────────────────────────────────────────────

  const handleEdit = (routine: Routine) => {
    reset(routineToForm(routine));
    setEditingId(routine.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    reset(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  // ── Filtered list ───────────────────────────────────────

  const filtered = filterType === "all"
    ? data.routines
    : data.routines.filter((r) => r.type === filterType);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-medium">Routines ({data.routines.length})</h3>
        <div className="flex items-center gap-2">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-8 text-xs w-36"
          >
            <option value="all">All types</option>
            {ROUTINE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Button
            size="sm"
            onClick={() => { setEditingId(null); reset(EMPTY_FORM); setShowForm(!showForm); }}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-700">
            {editingId ? `Editing: ${editingId}` : "New Routine"}
          </p>

          {/* Row 1: id + name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="ID (e.g. r-skin-am-daily)"
                {...register("id")}
                disabled={!!editingId}
                className={editingId ? "bg-gray-100" : ""}
              />
              {errors.id && <span className="text-xs text-red-500">{errors.id.message}</span>}
            </div>
            <div>
              <Input placeholder="Name" {...register("name")} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
          </div>

          {/* Row 2: type + timeOfDay */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Select {...register("type")} className="h-10 text-sm">
                <option value="">Type</option>
                {ROUTINE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              {errors.type && <span className="text-xs text-red-500">{errors.type.message}</span>}
            </div>
            <div>
              <Select {...register("timeOfDay")} className="h-10 text-sm">
                <option value="">Time of day</option>
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              {errors.timeOfDay && <span className="text-xs text-red-500">{errors.timeOfDay.message}</span>}
            </div>
          </div>

          {/* Weekday toggles */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Schedule (weekdays)</label>
            <div className="flex gap-2">
              {WEEKDAY_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    watchWeekdays[i]
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    const next = [...watchWeekdays];
                    next[i] = !next[i];
                    setValue("weekdays", next);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag checkboxes */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Context tags</label>
            <div className="flex gap-4">
              {(["tagOffice", "tagWfh", "tagTravel", "tagGoingOut"] as const).map((tag) => (
                <label key={tag} className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" {...register(tag)} className="rounded" />
                  {tag.replace("tag", "").replace(/([A-Z])/g, " $1").trim()}
                </label>
              ))}
            </div>
          </div>

          {/* Product IDs */}
          <Input placeholder="Product IDs (comma-separated, e.g. p-wash-salicylic, p-sunscreen)" {...register("productIds")} />

          {/* Notes */}
          <Input placeholder="Notes (optional)" {...register("notes")} />

          {/* ── Steps ─────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600">Steps ({stepFields.length})</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => addStep({ order: stepFields.length + 1, title: "", essential: false })}
              >
                <Plus className="h-3 w-3" /> Add Step
              </Button>
            </div>

            {stepFields.map((field, idx) => (
              <div key={field.id} className="flex items-start gap-2 bg-white p-3 rounded border">
                <GripVertical className="h-4 w-4 text-gray-300 mt-2 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Step title"
                      {...register(`steps.${idx}.title`)}
                      className="col-span-2 h-8 text-sm"
                    />
                    <Input
                      placeholder="Duration (min)"
                      {...register(`steps.${idx}.durationMin`)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <Input
                    placeholder="Product IDs (comma-separated)"
                    {...register(`steps.${idx}.productIds`)}
                    className="h-8 text-sm"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    <input type="checkbox" {...register(`steps.${idx}.essential`)} className="rounded" />
                    Essential step
                  </label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-400 hover:text-red-600 shrink-0"
                  onClick={() => removeStep(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="gap-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* ── Routine List ─────────────────────────────────── */}
      <div className="max-h-[32rem] overflow-y-auto space-y-2">
        {filtered.map((routine) => {
          const isExpanded = expandedId === routine.id;
          const weekdays = routine.schedule.weekday
            ?.map((d) => WEEKDAY_LABELS[d])
            .join(", ") ?? "—";

          return (
            <div key={routine.id} className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between p-3">
                <button
                  type="button"
                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : routine.id)}
                >
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{routine.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{routine.type}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{routine.timeOfDay}</Badge>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{weekdays}</p>
                  </div>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-blue-600"
                    onClick={() => handleEdit(routine)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-600"
                    disabled={deletingId === routine.id}
                    onClick={() => handleDelete(routine.id)}
                  >
                    {deletingId === routine.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {routine.tags.office && <Badge className="text-[10px] bg-green-50 text-green-700">Office</Badge>}
                    {routine.tags.wfh && <Badge className="text-[10px] bg-blue-50 text-blue-700">WFH</Badge>}
                    {routine.tags.travel && <Badge className="text-[10px] bg-amber-50 text-amber-700">Travel</Badge>}
                    {routine.tags.goingOut && <Badge className="text-[10px] bg-purple-50 text-purple-700">Going Out</Badge>}
                  </div>

                  {/* Product IDs */}
                  {routine.productIds?.length ? (
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 mb-1">Products</p>
                      <div className="flex gap-1 flex-wrap">
                        {routine.productIds.map((pid) => (
                          <Badge key={pid} variant="secondary" className="text-[10px]">{pid}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Steps */}
                  {routine.steps?.length ? (
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 mb-1">Steps ({routine.steps.length})</p>
                      <ol className="space-y-1">
                        {routine.steps.map((step) => (
                          <li key={step.order} className="flex items-start gap-2 text-xs text-gray-700">
                            <span className="text-gray-400 shrink-0 w-4 text-right">{step.order}.</span>
                            <span>
                              {step.title}
                              {step.durationMin ? ` (${step.durationMin} min)` : ""}
                              {step.essential ? " ★" : ""}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  <p className="text-[10px] text-gray-400">{routine.id}</p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No routines found</p>
        )}
      </div>
    </div>
  );
}
