// ========================================
// Form validation schemas and utilities
// Centralized validation logic with proper error handling
// ========================================

import { z } from "zod";

// ========================================
// Base validation schemas
// ========================================
const stringRequired = z.string().min(1, "This field is required");
const stringOptional = z.string().nullish();
const numberOptional = z.number().nullish();
const booleanOptional = z.boolean().nullish();

// ========================================
// Product validation schema
// ========================================
export const productSchema = z.object({
  id: stringRequired,
  name: stringRequired,
  category: stringRequired,
  brand: stringOptional,
  shade: stringOptional,
  actives: z.array(z.string()).default([]),
  cautionTags: z.array(z.string()).default([]),
  routineType: z.enum(["skin", "hair", "body", "bodySpecific", "wellness", "workout", "food"]).optional(),
  bodyAreas: z.array(z.enum(["UA", "IT", "BL", "IA", "B&S"])).optional(),
  hairPhase: z.enum(["oiling", "washing", "postWash", "daily"]).optional(),
  timeOfDay: z.enum(["AM", "MIDDAY", "PM", "ANY"]).optional(),
  weekdays: z.array(z.number().min(0).max(6)).optional(),
  displayOrder: numberOptional,
  notes: stringOptional,
});

// ========================================
// Wardrobe item validation schema
// ========================================
export const wardrobeItemSchema = z.object({
  id: stringRequired,
  name: stringRequired,
  category: z.enum(["Top", "Bottom", "Dress", "Shoes", "Bags", "Innerwear", "Activewear", "Ethnic", "Outerwear", "Others"]),
  subcategory: stringOptional,
  occasion: stringOptional,
  imageUrl: stringRequired,
  subType: stringOptional,
});

// ========================================
// Ingredient validation schema
// ========================================
const ingredientSchema = z.object({
  name: stringRequired,
  quantity: stringRequired,
  unit: stringOptional,
  category: stringOptional,
});

// ========================================
// Meal template validation schema
// ========================================
export const mealTemplateSchema = z.object({
  id: stringRequired,
  name: stringRequired,
  timeOfDay: z.enum(["AM", "MIDDAY", "PM", "ANY"]),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  items: z.array(z.string()).default([]),
  ingredients: z.array(ingredientSchema).optional(),
  instructions: z.array(z.string()).optional(),
  weekdays: z.array(z.number().min(0).max(6)).optional(),
  prepTimeMin: numberOptional,
  cookTimeMin: numberOptional,
  servings: numberOptional,
  tags: z.array(z.string()).optional(),
});

// ========================================
// Dressing validation schema
// ========================================
export const dressingSchema = z.object({
  id: z.string().optional(),
  name: stringRequired,
  shelfLifeDays: z.number(),
  baseType: stringOptional,
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.string().min(1),
    unit: z.string().optional(),
  })),
  instructions: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// ========================================
// Exercise validation schema
// ========================================
const exerciseSchema = z.object({
  name: stringRequired,
  sets: stringOptional,
  reps: stringOptional,
  notes: stringOptional,
  isNew: booleanOptional,
  isEssential: booleanOptional,
});

// ========================================
// Workout section validation schema
// ========================================
const workoutSectionSchema = z.object({
  title: stringRequired,
  description: stringOptional,
  exercises: z.array(exerciseSchema).default([]),
});

// ========================================
// Workout plan validation schema
// ========================================
export const workoutPlanSchema = z.object({
  id: stringRequired,
  name: stringRequired,
  weekday: z.array(z.number().min(0).max(6)).default([]),
  durationMin: z.number(),
  goal: stringOptional,
  sections: z.array(workoutSectionSchema).default([]),
});

// ========================================
// Routine validation schema
// ========================================
const routineStepSchema = z.object({
  order: numberOptional,
  title: stringRequired,
  description: stringOptional,
  durationMin: numberOptional,
  productIds: z.array(z.string()).optional(),
  bodyAreas: z.array(z.string()).optional(),
  weekdaysOnly: z.array(z.number().min(0).max(6)).optional(),
  essential: booleanOptional,
});

export const routineSchema = z.object({
  id: stringRequired,
  type: stringRequired,
  name: stringRequired,
  timeOfDay: z.enum(["AM", "MIDDAY", "PM", "ANY"]),
  schedule: z.object({
    weekday: z.array(z.number().min(0).max(6)).optional(),
    cycleDay: z.array(z.number()).optional(),
    frequencyPerWeek: z.number().optional(),
  }),
  tags: z.object({
    office: booleanOptional,
    wfh: booleanOptional,
    travel: booleanOptional,
    goingOut: booleanOptional,
  }),
  occasion: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
  notes: stringOptional,
  steps: z.array(routineStepSchema).default([]),
});

// ========================================
// Jewellery item validation schema
// ========================================
export const jewelleryItemSchema = z.object({
  id: z.string().optional(),
  name: stringRequired,
  category: stringRequired,
  subcategory: stringOptional,
  imageUrl: stringRequired,
  favorite: booleanOptional,
});

// ========================================
// Grocery category validation schema
// ========================================
export const groceryCategorySchema = z.object({
  id: z.string().optional(),
  name: stringRequired,
  emoji: stringRequired,
  listType: z.enum(["master", "weekly"]),
  items: z.array(z.object({ name: z.string().min(1), quantity: z.string().optional() })),
});

// ========================================
// Affirmation validation schema
// ========================================
export const affirmationSchema = z.object({
  id: stringRequired,
  text: stringRequired,
  type: z.enum(["affirmation", "action", "visualization"]),
  timeOfDay: z.enum(["morning", "midday", "evening"]),
  weekday: z.number().min(0).max(6),
  displayOrder: numberOptional,
});

// ========================================
// Day theme validation schema
// ========================================
export const dayThemeSchema = z.object({
  weekday: z.number().min(0).max(6),
  emoji: stringRequired,
  title: stringRequired,
  subtitle: stringRequired,
});

// ========================================
// Note creation validation schema
// ========================================
export const noteSchema = z.object({
  type: z.enum(["task", "idea"]),
  content: stringRequired,
  category: stringOptional,
});

// ========================================
// Bowl config validation schema
// ========================================
export const bowlConfigSchema = z.object({
  id: z.string().optional(),
  config: z.object({
    base: z.object({ item: z.string(), quantity: z.string() }),
    salads: z.array(z.object({ name: z.string(), quantity: z.string() })),
    proteinOptions: z.array(z.object({ name: z.string(), quantity: z.string() })),
    proteinPortions: z.array(z.object({ days: z.string(), quantity: z.string() })),
    quickProteinTopups: z.array(z.object({ combo: z.string(), note: z.string() })),
  }),
  isActive: booleanOptional,
});

// ========================================
// Form validation utilities
// ========================================
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
};

export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const errors: Record<string, string[]> = {};
      
      result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      });
      
      return {
        success: false,
        errors,
        message: "Validation failed. Please check the form for errors.",
      };
    }
  } catch {
    return {
      success: false,
      message: "An unexpected validation error occurred.",
    };
  }
}

// ========================================
// Form field helpers
// ========================================
export const fieldHelpers = {
  getFieldError: (errors: Record<string, string[]> | undefined, fieldName: string): string | undefined => {
    return errors?.[fieldName]?.[0];
  },

  hasFieldError: (errors: Record<string, string[]> | undefined, fieldName: string): boolean => {
    return Boolean(errors?.[fieldName]?.length);
  },

  formatFieldErrors: (errors: Record<string, string[]> | undefined): string => {
    if (!errors) return "";
    
    const allErrors = Object.values(errors).flat();
    return allErrors.join(", ");
  },
};



// ========================================
// Patch schemas — .partial() versions for PATCH endpoints
// These validate only the fields present in the request body.
// ========================================
export const productPatchSchema = productSchema.omit({ id: true }).partial();
export const mealTemplatePatchSchema = mealTemplateSchema.omit({ id: true, ingredients: true }).partial();
export const jewelleryItemPatchSchema = jewelleryItemSchema.omit({ id: true }).partial();
export const groceryCategoryPatchSchema = groceryCategorySchema.omit({ id: true }).partial();
export const dressingPatchSchema = dressingSchema.omit({ id: true }).partial();
export const bowlConfigPatchSchema = bowlConfigSchema.pick({ config: true, isActive: true }).partial();
export const affirmationPatchSchema = affirmationSchema.omit({ id: true }).partial();
export const dayThemePatchSchema = dayThemeSchema.omit({ weekday: true }).partial();

// Note patch includes fields not in the creation schema (completed, sortOrder)
export const notePatchSchema = z.object({
  content: z.string().min(1),
  category: z.string(),
  completed: z.boolean(),
  sortOrder: z.number(),
}).partial();