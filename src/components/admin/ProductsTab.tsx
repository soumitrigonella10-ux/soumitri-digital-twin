"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Pencil, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { routineService } from "@/lib/services";
import { useToast } from "@/components/ToastProvider";
import type { Product } from "@/types";

// ── Form schema ──────────────────────────────────────────────

const productSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  actives: z.string().optional(),
  cautionTags: z.string().optional(),
  routineType: z.string().optional(),
  hairPhase: z.string().optional(),
  timeOfDay: z.string().optional(),
  weekdays: z.string().optional(),
  displayOrder: z.string().optional(),
  notes: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

const ROUTINE_TYPES = ["skin", "hair", "body", "bodySpecific", "wellness", "workout", "food"];
const TIME_OPTIONS = ["AM", "PM", "MIDDAY", "ANY"];
const HAIR_PHASES = ["oiling", "washing", "postWash", "daily"];

// ── Helpers ──────────────────────────────────────────────────

function formToProduct(values: ProductForm): Product {
  const product: Product = {
    id: values.id.trim(),
    name: values.name.trim(),
    category: values.category.trim(),
    actives: values.actives?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    cautionTags: values.cautionTags?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
  };
  const brand = values.brand?.trim();
  if (brand) product.brand = brand;
  const routineType = values.routineType as Product["routineType"];
  if (routineType) product.routineType = routineType;
  const hairPhase = values.hairPhase as Product["hairPhase"];
  if (hairPhase) product.hairPhase = hairPhase;
  const timeOfDay = values.timeOfDay as Product["timeOfDay"];
  if (timeOfDay) product.timeOfDay = timeOfDay;
  const weekdays = values.weekdays?.split(",").map(Number).filter((n) => !isNaN(n));
  if (weekdays?.length) product.weekdays = weekdays;
  const displayOrder = values.displayOrder ? Number(values.displayOrder) : null;
  if (displayOrder != null) product.displayOrder = displayOrder;
  const notes = values.notes?.trim();
  if (notes) product.notes = notes;
  return product;
}

function productToForm(p: Product): ProductForm {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand ?? "",
    actives: p.actives?.join(", ") ?? "",
    cautionTags: p.cautionTags?.join(", ") ?? "",
    routineType: p.routineType ?? "",
    hairPhase: p.hairPhase ?? "",
    timeOfDay: p.timeOfDay ?? "",
    weekdays: p.weekdays?.join(", ") ?? "",
    displayOrder: p.displayOrder?.toString() ?? "",
    notes: p.notes ?? "",
  };
}

// ── Component ────────────────────────────────────────────────

export function ProductsTab() {
  const { data, upsertProduct, deleteById, refreshFromDb } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { id: "", name: "", category: "" },
  });

  // Save to DB then sync store
  const onSubmit = async (values: ProductForm) => {
    setSaving(true);
    try {
      const product = formToProduct(values);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Optimistically update store, then re-sync from DB
      upsertProduct(product);
      toast({
        title: editingId ? "Product updated" : "Product created",
        description: product.name,
        variant: "success",
      });

      reset();
      setShowForm(false);
      setEditingId(null);

      // Background re-sync to get server-side timestamps etc.
      await refreshFromDb();
    } catch (err) {
      toast({
        title: "Failed to save product",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete from DB then sync store
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      deleteById("products", id);
      toast({ title: "Product deleted", variant: "success" });
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

  // Edit: pre-fill form with existing product
  const handleEdit = (product: Product) => {
    reset(productToForm(product));
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    reset({ id: "", name: "", category: "" });
    setShowForm(false);
    setEditingId(null);
  };

  // Filter products by routine type
  const filtered = filterType === "all"
    ? data.products
    : routineService.getProductsByType(data.products, filterType as Product["routineType"] & string);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-medium">Products ({data.products.length})</h3>
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
            onClick={() => { setEditingId(null); reset({ id: "", name: "", category: "" }); setShowForm(!showForm); }}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-700">
            {editingId ? `Editing: ${editingId}` : "New Product"}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="ID (e.g. p-serum-01)"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="Category (Cleanser, Serum...)" {...register("category")} />
              {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
            </div>
            <Input placeholder="Brand (optional)" {...register("brand")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select {...register("routineType")} className="h-10 text-sm">
              <option value="">Routine type</option>
              {ROUTINE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>

            <Select {...register("timeOfDay")} className="h-10 text-sm">
              <option value="">Time of day</option>
              {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>

            <Select {...register("hairPhase")} className="h-10 text-sm">
              <option value="">Hair phase</option>
              {HAIR_PHASES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>

          <Input placeholder="Actives (comma-separated)" {...register("actives")} />
          <Input placeholder="Caution tags (comma-separated)" {...register("cautionTags")} />

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Weekdays (0-6, comma-separated)" {...register("weekdays")} />
            <Input placeholder="Display order (number)" {...register("displayOrder")} />
          </div>

          <Input placeholder="Notes (optional)" {...register("notes")} />

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

      {/* Product List */}
      <div className="max-h-[32rem] overflow-y-auto space-y-2">
        {filtered.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-xs text-gray-400">({product.category})</span>
                {product.routineType && (
                  <Badge variant="secondary" className="text-[10px]">{product.routineType}</Badge>
                )}
                {product.timeOfDay && (
                  <Badge variant="secondary" className="text-[10px]">{product.timeOfDay}</Badge>
                )}
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {product.actives?.slice(0, 3).map((a) => (
                  <Badge key={a} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">{a}</Badge>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{product.id}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-blue-600"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-red-600"
                disabled={deletingId === product.id}
                onClick={() => handleDelete(product.id)}
              >
                {deletingId === product.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No products found</p>
        )}
      </div>
    </div>
  );
}
