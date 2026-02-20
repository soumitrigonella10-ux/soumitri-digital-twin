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
import type { WorkoutPlan } from "@/types";

const workoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  weekday: z.string(),
  durationMin: z.coerce.number().min(1),
});

type WorkoutForm = z.infer<typeof workoutSchema>;

export function WorkoutsTab() {
  const { data, upsertWorkout, deleteById } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<WorkoutForm>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { durationMin: 45 },
  });

  const onSubmit = (values: WorkoutForm) => {
    const workout: WorkoutPlan = {
      id: values.id,
      name: values.name,
      weekday: values.weekday
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n)),
      durationMin: values.durationMin,
      sections: [],
    };
    upsertWorkout(workout);
    toast({ title: "Workout saved", variant: "success" });
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Workout Plans ({data.workoutPlans.length})</h3>
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
          <Input placeholder="Days (0=Sun,1=Mon,..., comma-separated)" {...register("weekday")} />
          <Input type="number" placeholder="Duration (minutes)" {...register("durationMin")} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.workoutPlans.map((workout) => (
          <div key={workout.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{workout.name}</span>
              <span className="text-xs text-gray-500 ml-2">({workout.durationMin} min)</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => { deleteById("workoutPlans", workout.id); toast({ title: "Workout deleted" }); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
