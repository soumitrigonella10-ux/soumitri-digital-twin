// ========================================
// Tests for src/lib/validation.ts
// Zod schema validation and helpers
// ========================================

import { describe, it, expect } from "vitest";
import {
  validateWithSchema,
  productSchema,
  wardrobeItemSchema,
  mealTemplateSchema,
  dressingSchema,
  workoutPlanSchema,
  fieldHelpers,
} from "@/lib/validation";

// ========================================
// productSchema
// ========================================
describe("productSchema", () => {
  const validProduct = {
    id: "p-1",
    name: "Niacinamide Serum",
    category: "skincare",
    actives: ["niacinamide"],
    cautionTags: [],
  };

  it("accepts a valid minimal product", () => {
    const result = validateWithSchema(productSchema, validProduct);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.id).toBe("p-1");
  });

  it("accepts a product with all optional fields", () => {
    const full = {
      ...validProduct,
      routineType: "skin" as const,
      bodyAreas: ["UA", "IT"] as const,
      hairPhase: "daily" as const,
      timeOfDay: "AM" as const,
      weekdays: [1, 3, 5],
      displayOrder: 2,
    };
    const result = validateWithSchema(productSchema, full);
    expect(result.success).toBe(true);
  });

  it("rejects empty id", () => {
    const result = validateWithSchema(productSchema, { ...validProduct, id: "" });
    expect(result.success).toBe(false);
    expect(result.errors?.["id"]).toBeDefined();
  });

  it("rejects empty name", () => {
    const result = validateWithSchema(productSchema, { ...validProduct, name: "" });
    expect(result.success).toBe(false);
    expect(result.errors?.["name"]).toBeDefined();
  });

  it("rejects invalid routineType", () => {
    const result = validateWithSchema(productSchema, {
      ...validProduct,
      routineType: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid bodyArea values", () => {
    const result = validateWithSchema(productSchema, {
      ...validProduct,
      bodyAreas: ["INVALID"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects weekday out of range", () => {
    const result = validateWithSchema(productSchema, {
      ...validProduct,
      weekdays: [7],
    });
    expect(result.success).toBe(false);
  });

  it("defaults actives to empty array if not provided", () => {
    const { actives, ...withoutActives } = validProduct;
    const result = validateWithSchema(productSchema, withoutActives);
    // actives has .default([]) so missing should pass
    expect(result.success).toBe(true);
    expect(result.data!.actives).toEqual([]);
  });

  it("defaults isActive to true", () => {
    const result = validateWithSchema(productSchema, validProduct);
    expect(result.success).toBe(true);
    expect(result.data!.isActive).toBe(true);
  });
});

// ========================================
// wardrobeItemSchema
// ========================================
describe("wardrobeItemSchema", () => {
  const validItem = {
    id: "w-1",
    name: "Black T-Shirt",
    category: "Top" as const,
    imageUrl: "https://example.com/tshirt.jpg",
    colors: ["black"],
  };

  it("accepts a valid wardrobe item", () => {
    const result = validateWithSchema(wardrobeItemSchema, validItem);
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = validateWithSchema(wardrobeItemSchema, {
      ...validItem,
      category: "Hat",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing imageUrl", () => {
    const { imageUrl, ...noImage } = validItem;
    const result = validateWithSchema(wardrobeItemSchema, noImage);
    expect(result.success).toBe(false);
  });

  it("accepts all valid categories", () => {
    const cats = ["Top", "Bottom", "Dress", "Shoes", "Accessories", "Outerwear"] as const;
    for (const category of cats) {
      const result = validateWithSchema(wardrobeItemSchema, { ...validItem, category });
      expect(result.success).toBe(true);
    }
  });
});

// ========================================
// mealTemplateSchema
// ========================================
describe("mealTemplateSchema", () => {
  const validMeal = {
    id: "m-1",
    name: "Oatmeal Breakfast",
    timeOfDay: "AM" as const,
    mealType: "breakfast" as const,
    items: ["oats", "banana"],
  };

  it("accepts a valid meal template", () => {
    const result = validateWithSchema(mealTemplateSchema, validMeal);
    expect(result.success).toBe(true);
  });

  it("rejects invalid mealType", () => {
    const result = validateWithSchema(mealTemplateSchema, {
      ...validMeal,
      mealType: "brunch",
    });
    expect(result.success).toBe(false);
  });

  it("accepts meal with full detail", () => {
    const result = validateWithSchema(mealTemplateSchema, {
      ...validMeal,
      ingredients: [{ name: "Oats", quantity: "1 cup" }],
      instructions: ["Boil water", "Add oats"],
      weekdays: [1, 2, 3, 4, 5],
      prepTimeMin: 5,
      cookTimeMin: 10,
      servings: 1,
      tags: ["quick", "high-protein"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects ingredient without required name", () => {
    const result = validateWithSchema(mealTemplateSchema, {
      ...validMeal,
      ingredients: [{ name: "", quantity: "1 cup" }],
    });
    expect(result.success).toBe(false);
  });
});

// ========================================
// dressingSchema
// ========================================
describe("dressingSchema", () => {
  it("accepts a valid dressing", () => {
    const result = validateWithSchema(dressingSchema, {
      id: "d-1",
      name: "Balsamic Vinaigrette",
      shelfLifeDays: 7,
      ingredients: ["olive oil", "balsamic vinegar"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing shelfLifeDays", () => {
    const result = validateWithSchema(dressingSchema, {
      id: "d-1",
      name: "Bad Dressing",
      ingredients: [],
    });
    expect(result.success).toBe(false);
  });
});

// ========================================
// workoutPlanSchema
// ========================================
describe("workoutPlanSchema", () => {
  it("accepts valid workout plan", () => {
    const result = validateWithSchema(workoutPlanSchema, {
      id: "wp-1",
      name: "Upper Body",
      weekday: [1, 3],
      durationMin: 45,
      goal: "Build strength",
      sections: [
        {
          title: "Warm-up",
          exercises: [{ name: "Jumping Jacks" }],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing durationMin", () => {
    const result = validateWithSchema(workoutPlanSchema, {
      id: "wp-1",
      name: "Incomplete Workout",
      weekday: [],
      sections: [],
    });
    expect(result.success).toBe(false);
  });
});

// ========================================
// validateWithSchema — general behaviour
// ========================================
describe("validateWithSchema", () => {
  it("returns structured errors with field paths", () => {
    const result = validateWithSchema(productSchema, {
      id: "",
      name: "",
      category: "",
    });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!["id"]).toBeDefined();
    expect(result.errors!["name"]).toBeDefined();
    expect(result.errors!["category"]).toBeDefined();
    expect(result.message).toContain("Validation failed");
  });

  it("handles complete garbage input gracefully", () => {
    const result = validateWithSchema(productSchema, null);
    expect(result.success).toBe(false);
  });

  it("handles undefined input", () => {
    const result = validateWithSchema(productSchema, undefined);
    expect(result.success).toBe(false);
  });
});

// ========================================
// fieldHelpers
// ========================================
describe("fieldHelpers", () => {
  const errors = {
    id: ["This field is required"],
    name: ["This field is required", "Must be at least 3 characters"],
  };

  it("getFieldError returns first error for a field", () => {
    expect(fieldHelpers.getFieldError(errors, "id")).toBe("This field is required");
  });

  it("getFieldError returns undefined for missing field", () => {
    expect(fieldHelpers.getFieldError(errors, "category")).toBeUndefined();
  });

  it("getFieldError handles undefined errors", () => {
    expect(fieldHelpers.getFieldError(undefined, "id")).toBeUndefined();
  });

  it("hasFieldError returns true for errored field", () => {
    expect(fieldHelpers.hasFieldError(errors, "id")).toBe(true);
  });

  it("hasFieldError returns false for clean field", () => {
    expect(fieldHelpers.hasFieldError(errors, "category")).toBe(false);
  });

  it("formatFieldErrors joins all errors", () => {
    const formatted = fieldHelpers.formatFieldErrors(errors);
    expect(formatted).toContain("This field is required");
    expect(formatted).toContain("Must be at least 3 characters");
  });

  it("formatFieldErrors returns empty string for undefined", () => {
    expect(fieldHelpers.formatFieldErrors(undefined)).toBe("");
  });
});
