"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ToastProvider";
import { Product } from "@/types";

const productSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  actives: z.string(),
  cautionTags: z.string(),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductsTab() {
  const { data, upsertProduct, deleteById } = useAppStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { id: "", name: "", category: "", actives: "", cautionTags: "" },
  });

  const onSubmit = (values: ProductForm) => {
    const product: Product = {
      id: values.id,
      name: values.name,
      category: values.category,
      actives: values.actives.split(",").map((s) => s.trim()).filter(Boolean),
      cautionTags: values.cautionTags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    upsertProduct(product);
    toast({ title: "Product saved", variant: "success" });
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Products ({data.products.length})</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="ID (e.g., p-serum-01)" {...register("id")} />
              {errors.id && <span className="text-xs text-red-500">{errors.id.message}</span>}
            </div>
            <div>
              <Input placeholder="Name" {...register("name")} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
          </div>
          <Input placeholder="Category (e.g., Serum, Cleanser)" {...register("category")} />
          <Input placeholder="Actives (comma-separated)" {...register("actives")} />
          <Input placeholder="Caution Tags (comma-separated)" {...register("cautionTags")} />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{product.name}</span>
              <span className="text-xs text-gray-500 ml-2">({product.category})</span>
              <div className="flex gap-1 mt-1">
                {product.actives.slice(0, 3).map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => { deleteById("products", product.id); toast({ title: "Product deleted" }); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
