"use client";

import { useState } from "react";
import Image from "next/image";
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
import { WardrobeItem } from "@/types";

const wardrobeSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Top", "Bottom", "Dress", "Shoes", "Accessories", "Outerwear"]),
  imageUrl: z.string().url("Must be a valid URL"),
  colors: z.string(),
});

type WardrobeForm = z.infer<typeof wardrobeSchema>;

export function WardrobeTab() {
  const { data, upsertWardrobe, deleteById } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WardrobeForm>({
    resolver: zodResolver(wardrobeSchema),
    defaultValues: { category: "Top" },
  });

  const onSubmit = (values: WardrobeForm) => {
    const item: WardrobeItem = {
      id: values.id,
      name: values.name,
      category: values.category,
      imageUrl: values.imageUrl,
      colors: values.colors.split(",").map((s) => s.trim()).filter(Boolean),
    };
    upsertWardrobe(item);
    toast({ title: "Wardrobe item saved", variant: "success" });
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Wardrobe ({data.wardrobe.length})</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="ID (e.g., w-top-01)" {...register("id")} />
              {errors.id && <span className="text-xs text-red-500">{errors.id.message}</span>}
            </div>
            <div>
              <Input placeholder="Name" {...register("name")} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
          </div>
          <Select {...register("category")}>
            <option value="Top">Top</option>
            <option value="Bottom">Bottom</option>
            <option value="Dress">Dress</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
            <option value="Outerwear">Outerwear</option>
          </Select>
          <div>
            <Input placeholder="Image URL" {...register("imageUrl")} />
            {errors.imageUrl && <span className="text-xs text-red-500">{errors.imageUrl.message}</span>}
          </div>
          <Input placeholder="Colors (comma-separated)" {...register("colors")} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.wardrobe.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded overflow-hidden relative">
                <Image src={item.imageUrl} alt={item.name} fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex gap-1 mt-0.5">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => { deleteById("wardrobe", item.id); toast({ title: "Item deleted" }); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
