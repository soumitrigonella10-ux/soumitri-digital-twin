"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  Repeat,
  Shirt,
  Utensils,
  Salad,
  Dumbbell,
  Trash2,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "./ToastProvider";
import { Product, WardrobeItem, MealTemplate, Dressing, WorkoutPlan } from "@/types";

// ========================================
// Tabs
// ========================================
type TabKey = "products" | "wardrobe" | "meals" | "dressings" | "workouts";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { key: "wardrobe", label: "Wardrobe", icon: <Shirt className="h-4 w-4" /> },
  { key: "meals", label: "Meals", icon: <Utensils className="h-4 w-4" /> },
  { key: "dressings", label: "Dressings", icon: <Salad className="h-4 w-4" /> },
  { key: "workouts", label: "Workouts", icon: <Dumbbell className="h-4 w-4" /> },
];

export function ManageTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="p-4">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "wardrobe" && <WardrobeTab />}
          {activeTab === "meals" && <MealsTab />}
          {activeTab === "dressings" && <DressingsTab />}
          {activeTab === "workouts" && <WorkoutsTab />}
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// Products Tab
// ========================================
const productSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  actives: z.string(),
  cautionTags: z.string(),
});

type ProductForm = z.infer<typeof productSchema>;

function ProductsTab() {
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
    defaultValues: {
      id: "",
      name: "",
      category: "",
      actives: "",
      cautionTags: "",
    },
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
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div>
              <span className="text-sm font-medium">{product.name}</span>
              <span className="text-xs text-gray-500 ml-2">({product.category})</span>
              <div className="flex gap-1 mt-1">
                {product.actives.slice(0, 3).map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => {
                deleteById("products", product.id);
                toast({ title: "Product deleted" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// Wardrobe Tab
// ========================================
const wardrobeSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Top", "Bottom", "Dress", "Shoes", "Accessories", "Outerwear"]),
  imageUrl: z.string().url("Must be a valid URL"),
  colors: z.string(),
});

type WardrobeForm = z.infer<typeof wardrobeSchema>;

function WardrobeTab() {
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
    defaultValues: {
      category: "Top",
    },
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
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.wardrobe.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 rounded object-cover"
                onError={(e) => (e.currentTarget.src = "")}
              />
              <div>
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex gap-1 mt-0.5">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => {
                deleteById("wardrobe", item.id);
                toast({ title: "Item deleted" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// Meals Tab
// ========================================
const mealSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  timeOfDay: z.enum(["AM", "PM", "ANY"]),
  items: z.string(),
});

type MealForm = z.infer<typeof mealSchema>;

function MealsTab() {
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
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.mealTemplates.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{meal.name}</span>
              <Badge variant="secondary" className="text-xs ml-2">
                {meal.timeOfDay}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => {
                deleteById("mealTemplates", meal.id);
                toast({ title: "Meal deleted" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// Dressings Tab
// ========================================
const dressingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shelfLifeDays: z.coerce.number().min(1),
  ingredients: z.string(),
});

type DressingForm = z.infer<typeof dressingSchema>;

function DressingsTab() {
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
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.dressings.map((dressing) => (
          <div key={dressing.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{dressing.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({dressing.shelfLifeDays} days)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => {
                deleteById("dressings", dressing.id);
                toast({ title: "Dressing deleted" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// Workouts Tab
// ========================================
const workoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  weekday: z.string(),
  durationMin: z.coerce.number().min(1),
});

type WorkoutForm = z.infer<typeof workoutSchema>;

function WorkoutsTab() {
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
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="max-h-96 overflow-y-auto space-y-2">
        {data.workoutPlans.map((workout) => (
          <div key={workout.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{workout.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({workout.durationMin} min)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => {
                deleteById("workoutPlans", workout.id);
                toast({ title: "Workout deleted" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
