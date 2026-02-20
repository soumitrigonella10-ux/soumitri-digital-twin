"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ToastProvider";
import type { Dressing } from "@/types";

const dressingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shelfLifeDays: z.coerce.number().min(1),
  ingredients: z.string(),
});

type DressingForm = z.infer<typeof dressingSchema>;

export function DressingsTab() {
  const { data, upsertDressing, deleteById } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<DressingForm>({
    resolver: zodResolver(dressingSchema),
    defaultValues: { shelfLifeDays: 7 },
  });

  const onSubmit = (values: DressingForm) => {
    const dressing: Dressing = {
      id: values.id,
      name: values.name,
      shelfLifeDays: values.shelfLifeDays,
      ingredients: values.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
    };
    upsertDressing(dressing);
    toast({ title: "Dressing saved", variant: "success" });
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Dressings ({data.dressings.length})</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="ID" {...register("id")} />
            <Input placeholder="Name" {...register("name")} />
          </div>
          <Input type="number" placeholder="Shelf life (days)" {...register("shelfLifeDays")} />
          <Input placeholder="Ingredients (comma-separated)" {...register("ingredients")} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.dressings.map((dressing) => (
          <div key={dressing.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{dressing.name}</span>
              <span className="text-xs text-gray-500 ml-2">({dressing.shelfLifeDays} days)</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => { deleteById("dressings", dressing.id); toast({ title: "Dressing deleted" }); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
