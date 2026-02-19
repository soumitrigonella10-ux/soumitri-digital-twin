"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ToastProvider";
import { MealTemplate } from "@/types";

const mealSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  timeOfDay: z.enum(["AM", "PM", "ANY"]),
  items: z.string(),
});

type MealForm = z.infer<typeof mealSchema>;

export function MealsTab() {
  const { data, upsertMeal, deleteById } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: { timeOfDay: "ANY" },
  });

  const onSubmit = (values: MealForm) => {
    const meal: MealTemplate = {
      id: values.id,
      name: values.name,
      timeOfDay: values.timeOfDay,
      mealType: "lunch",
      items: values.items.split(",").map((s) => s.trim()).filter(Boolean),
    };
    upsertMeal(meal);
    toast({ title: "Meal saved", variant: "success" });
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Meal Templates ({data.mealTemplates.length})</h3>
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
          <Select {...register("timeOfDay")}>
            <option value="AM">Morning</option>
            <option value="PM">Evening</option>
            <option value="ANY">Any time</option>
          </Select>
          <Input placeholder="Items (comma-separated)" {...register("items")} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.mealTemplates.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{meal.name}</span>
              <Badge variant="secondary" className="text-xs ml-2">{meal.timeOfDay}</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => { deleteById("mealTemplates", meal.id); toast({ title: "Meal deleted" }); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
