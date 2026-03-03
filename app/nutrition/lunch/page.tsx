"use client";

import { useState, useCallback } from "react";
import { UtensilsCrossed, Clock, Leaf, Droplets, ChefHat, Info, Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDbData } from "@/hooks/useDbData";
import { useAdmin } from "@/hooks/useAdmin";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { AdminCrudModal, Field, inputClass, selectClass, AdminAddButton, DeleteConfirmModal } from "@/components/AdminCrudModal";

interface DressingRecipe {
  id: string;
  name: string;
  shelfLifeDays: number;
  baseType?: string | null;
  ingredients: { name: string; quantity: string; unit?: string }[];
  instructions?: string[] | null;
  tips?: string[] | null;
  tags?: string[] | null;
}

interface LunchBowlConfig {
  base: { item: string; quantity: string };
  salads: { name: string; quantity: string }[];
  proteinOptions: { name: string; quantity: string }[];
  proteinPortions: { days: string; quantity: string }[];
  quickProteinTopups: { combo: string; note: string }[];
}

type TabType = "bowl" | "dressings";

/* ─── Dressing Form Modal ─── */
function DressingFormModal({
  dressing,
  onClose,
  onSaved,
}: {
  dressing?: DressingRecipe | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!dressing;
  const [name, setName] = useState(dressing?.name ?? "");
  const [baseType, setBaseType] = useState(dressing?.baseType ?? "yogurt");
  const [shelfLifeDays, setShelfLifeDays] = useState(dressing?.shelfLifeDays ?? 5);
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit?: string }[]>(
    dressing?.ingredients ?? [{ name: "", quantity: "", unit: "" }]
  );
  const [instructions, setInstructions] = useState<string[]>(dressing?.instructions ?? [""]);
  const [tips] = useState<string[]>(dressing?.tips ?? []);
  const [tags, setTags] = useState(dressing?.tags?.join(", ") ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const updateIngredient = (idx: number, field: string, value: string) => {
    setIngredients(ingredients.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
  };

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (idx: number) => setInstructions(instructions.filter((_, i) => i !== idx));

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        entity: "dressing",
        id: dressing?.id ?? `dr-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: name.trim(),
        baseType: baseType || null,
        shelfLifeDays,
        ingredients: ingredients.filter((i) => i.name.trim()).map((i) => ({
          name: i.name.trim(), quantity: i.quantity.trim(), unit: i.unit?.trim() || undefined,
        })),
        instructions: instructions.filter((s) => s.trim()),
        tips: tips.filter((t) => t.trim()),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch("/api/lunch-data", {
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
  }, [name, baseType, shelfLifeDays, ingredients, instructions, tips, tags, dressing?.id, isEdit, onSaved, onClose]);

  return (
    <AdminCrudModal
      title={isEdit ? "Edit Dressing" : "Add Dressing"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      success={success}
      error={error}
      submitLabel={isEdit ? "Save" : "Add"}
      accentColor="bg-emerald-600"
    >
      <div className="grid grid-cols-[1fr_100px_80px] gap-3">
        <Field label="Name *">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Tahini Lemon" />
        </Field>
        <Field label="Base Type">
          <select value={baseType ?? ""} onChange={(e) => setBaseType(e.target.value)} className={selectClass}>
            <option value="yogurt">Yogurt</option>
            <option value="oil">Oil</option>
            <option value="tahini">Tahini</option>
            <option value="tomato">Tomato</option>
            <option value="tamarind">Tamarind</option>
          </select>
        </Field>
        <Field label="Shelf">
          <input type="number" value={shelfLifeDays} onChange={(e) => setShelfLifeDays(+e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Ingredients">
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input value={ing.name} onChange={(e) => updateIngredient(idx, "name", e.target.value)} placeholder="Name" className={cn(inputClass, "flex-1")} />
              <input value={ing.quantity} onChange={(e) => updateIngredient(idx, "quantity", e.target.value)} placeholder="Qty" className={cn(inputClass, "w-20")} />
              <input value={ing.unit ?? ""} onChange={(e) => updateIngredient(idx, "unit", e.target.value)} placeholder="Unit" className={cn(inputClass, "w-16")} />
              <button onClick={() => removeIngredient(idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <button onClick={addIngredient} className="mt-1 text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add ingredient</button>
      </Field>
      <Field label="Instructions">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {instructions.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5">{idx + 1}.</span>
              <input value={step} onChange={(e) => { const n = [...instructions]; n[idx] = e.target.value; setInstructions(n); }} className={cn(inputClass, "flex-1")} />
              <button onClick={() => removeInstruction(idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <button onClick={addInstruction} className="mt-1 text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add step</button>
      </Field>
      <Field label="Tags (comma-separated)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="e.g. creamy, tangy" />
      </Field>
    </AdminCrudModal>
  );
}

function LunchPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>("bowl");
  const [expandedDressing, setExpandedDressing] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDressing, setEditingDressing] = useState<DressingRecipe | null>(null);
  const [deletingDressing, setDeletingDressing] = useState<DressingRecipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading, refetch } = useDbData<{ lunchBowlConfig: LunchBowlConfig | null; dressings: DressingRecipe[] }>(
    "/api/lunch-data",
    { lunchBowlConfig: null, dressings: [] }
  );
  const lunchBowlConfig = data.lunchBowlConfig;
  const lunchDressings = data.dressings;

  const handleDelete = useCallback(async () => {
    if (!deletingDressing) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/lunch-data?entity=dressing&id=${deletingDressing.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setDeletingDressing(null);
    }
  }, [deletingDressing, refetch]);

  const getDressingTypeColor = (type: DressingRecipe["baseType"]) => {
    switch (type) {
      case "yogurt": return "bg-blue-100 text-blue-700";
      case "oil": return "bg-amber-100 text-amber-700";
      case "tahini": return "bg-orange-100 text-orange-700";
      case "tomato": return "bg-red-100 text-red-700";
      case "tamarind": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-lunch flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lunch</h1>
            <p className="text-gray-500">Midday meal templates</p>
          </div>
        </div>
        {isAdmin && activeTab === "dressings" && (
          <AdminAddButton onClick={() => setShowAddModal(true)} label="Add Dressing" accentColor="bg-emerald-600" />
        )}
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab("bowl")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "bowl"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <ChefHat className="w-4 h-4" />
          Bowl Builder
        </button>
        <button
          onClick={() => setActiveTab("dressings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "dressings"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Droplets className="w-4 h-4" />
          Dressings ({lunchDressings.length})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      )}

      {/* Bowl Tab Content */}
      {!loading && activeTab === "bowl" && lunchBowlConfig && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="lifeos-card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-500">12:00 - 2:00 PM</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Ideal window</p>
          </div>

          {/* Bowl Configuration Card */}
          <div className="lifeos-card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-500" />
              Build Your Bowl
            </h3>
            
            {/* Base */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Base</p>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="font-medium text-gray-800">{lunchBowlConfig.base.item}</span>
                <span className="text-sm text-amber-600 font-medium">{lunchBowlConfig.base.quantity}</span>
              </div>
            </div>

            {/* Salads */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Salads</p>
              <div className="space-y-2">
                {lunchBowlConfig.salads.map((salad, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="font-medium text-gray-800">{salad.name}</span>
                    <span className="text-sm text-green-600 font-medium">{salad.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Protein Options (pick one) */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Protein <span className="text-purple-500">(pick one)</span></p>
              <div className="grid grid-cols-3 gap-2">
                {lunchBowlConfig.proteinOptions.map((protein, i) => (
                  <div key={i} className="p-3 bg-purple-50 rounded-xl text-center border-2 border-dashed border-purple-200">
                    <span className="font-medium text-gray-800 text-sm">{protein.name}</span>
                    <p className="text-xs text-purple-600 font-medium mt-1">{protein.quantity}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center italic">Choose any one protein per bowl</p>
            </div>

            {/* Protein Portions by Day */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Daily Protein Portions</p>
              <div className="grid grid-cols-2 gap-2">
                {lunchBowlConfig.proteinPortions.map((portion, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{portion.days}</span>
                    <span className="text-xs text-emerald-600 font-medium">{portion.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Protein Top-ups */}
          <div className="lifeos-card p-5 bg-orange-50 border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-orange-600" />
              <h3 className="font-medium text-orange-800">2-Ingredient Protein Rescue</h3>
            </div>
            <p className="text-xs text-orange-600 mb-3">When you&apos;re short on time</p>
            <div className="space-y-2">
              {lunchBowlConfig.quickProteinTopups.map((topup, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-gray-800 font-medium">{topup.combo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="lifeos-card p-5 bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h3 className="font-medium text-emerald-800">Lunch Tips</h3>
            </div>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Include vegetables for nutrients</li>
              <li>• Balance protein, carbs, and fats</li>
              <li>• Avoid heavy meals that cause afternoon slump</li>
              <li>• Take a short walk after eating</li>
            </ul>
          </div>
        </div>
      )}

      {/* Dressings Tab Content */}
      {!loading && activeTab === "dressings" && (
        <div className="space-y-6">
          {/* Dressing Storage Info */}
          <div className="lifeos-card p-4 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-blue-800">Storage Tips</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Yogurt-based:</strong> 5–6 days (keep thick, avoid raw onion in jar)</li>
              <li>• <strong>Oil/soy/vinegar-based:</strong> 7 days easily</li>
              <li>• Make 1 and store for the week!</li>
            </ul>
          </div>

          {/* Dressings Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Weekly Dressings ({lunchDressings.length})
            </h2>

            {lunchDressings.map((dressing, index) => (
              <div
                key={dressing.id}
                className="lifeos-card overflow-hidden animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Dressing Header */}
                <button
                  onClick={() => setExpandedDressing(expandedDressing === dressing.id ? null : dressing.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{dressing.name}</h3>
                        {isAdmin && (
                          <span className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setEditingDressing(dressing); }} className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setDeletingDressing(dressing); }} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getDressingTypeColor(dressing.baseType))}>
                          {dressing.baseType}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Lasts {dressing.shelfLifeDays} days
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                      expandedDressing === dressing.id ? "rotate-180" : ""
                    )}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedDressing === dressing.id && (
                  <>
                    {/* Ingredients */}
                    <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                        Ingredients
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {dressing.ingredients.map((ing, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">{ing.name}</span>
                            <span className="text-xs text-emerald-600 font-medium">
                              {ing.quantity} {ing.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                        How to Make
                      </p>
                      <ol className="space-y-2">
                        {dressing.instructions?.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips */}
                    {dressing.tips && dressing.tips.length > 0 && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Tips
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {dressing.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {dressing.tags && dressing.tags.length > 0 && (
                      <div className="px-5 pb-5 flex flex-wrap gap-2">
                        {dressing.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRUD Modals */}
      {showAddModal && (
        <DressingFormModal onClose={() => setShowAddModal(false)} onSaved={refetch} />
      )}
      {editingDressing && (
        <DressingFormModal dressing={editingDressing} onClose={() => setEditingDressing(null)} onSaved={refetch} />
      )}
      {deletingDressing && (
        <DeleteConfirmModal
          itemName={deletingDressing.name}
          onCancel={() => setDeletingDressing(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default function LunchPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <LunchPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
