// ========================================
// Form validation schemas and utilities
// Centralized validation logic with proper error handling
// ========================================

import { z } from "zod";

// ========================================
// Base validation schemas
// ========================================
const stringRequired = z.string().min(1, "This field is required");
const stringOptional = z.string().optional();
const numberOptional = z.number().optional();
const booleanOptional = z.boolean().optional();

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
  id: stringRequired,
  name: stringRequired,
  shelfLifeDays: z.number(),
  ingredients: z.array(z.string()).default([]),
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
  } catch (error) {
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
// Export all schemas for type inference
// ========================================
export type ProductFormData = z.infer<typeof productSchema>;
export type WardrobeItemFormData = z.infer<typeof wardrobeItemSchema>;
export type MealTemplateFormData = z.infer<typeof mealTemplateSchema>;
export type DressingFormData = z.infer<typeof dressingSchema>;
export type WorkoutPlanFormData = z.infer<typeof workoutPlanSchema>;