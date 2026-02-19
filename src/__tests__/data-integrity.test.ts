// ========================================
// Data Integrity Tests
// Validates all seed data arrays have correct shapes
// ========================================

import { describe, it, expect } from "vitest";
import {
  products,
  skinProducts,
  bodyProducts,
  bodySpecificProducts,
  hairProducts,
  wellnessProducts,
} from "@/data/products/index";
import { routines } from "@/data/routines/index";
import { wardrobe } from "@/data/wardrobe/index";
import { meals, breakfastMeals, lunchMeals, dinnerMeals } from "@/data/meals/index";
import { dressings } from "@/data/meals/dressings";
import { workouts } from "@/data/workouts";
import { wishlist } from "@/data/wishlist";
import { BODY_AREAS, getProductArea } from "@/data/bodyAreas";
import { topics, getPublicTopicSlugs, getPrivateTopicSlugs, getTopicBySlug } from "@/data/topics";
import type { Product } from "@/types";

// ========================================
// Products
// ========================================
describe("Products data", () => {
  it("products is a non-empty array", () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("combined products matches sum of category arrays", () => {
    const combined = skinProducts.length + bodyProducts.length + bodySpecificProducts.length + hairProducts.length + wellnessProducts.length;
    expect(products.length).toBe(combined);
  });

  it("each product has required fields", () => {
    for (const p of products) {
      expect(p.id).toBeDefined();
      expect(typeof p.id).toBe("string");
      expect(p.id.length).toBeGreaterThan(0);
      expect(p.name).toBeDefined();
      expect(typeof p.name).toBe("string");
      expect(p.category).toBeDefined();
      expect(Array.isArray(p.actives)).toBe(true);
      expect(Array.isArray(p.cautionTags)).toBe(true);
    }
  });

  it("product IDs are unique", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each product has a valid routineType if specified", () => {
    const validTypes = ["skin", "hair", "body", "bodySpecific", "wellness", "workout", "food"];
    for (const p of products) {
      if (p.routineType) {
        expect(validTypes).toContain(p.routineType);
      }
    }
  });

  it("each product has a valid timeOfDay if specified", () => {
    const validTimes = ["AM", "MIDDAY", "PM", "ANY"];
    for (const p of products) {
      if (p.timeOfDay) {
        expect(validTimes).toContain(p.timeOfDay);
      }
    }
  });

  it("weekdays are valid day numbers if specified", () => {
    for (const p of products) {
      if (p.weekdays) {
        for (const d of p.weekdays) {
          expect(d).toBeGreaterThanOrEqual(0);
          expect(d).toBeLessThanOrEqual(6);
        }
      }
    }
  });

  it("displayOrder is a positive number if specified", () => {
    for (const p of products) {
      if (p.displayOrder !== undefined) {
        expect(typeof p.displayOrder).toBe("number");
        expect(p.displayOrder).toBeGreaterThan(0);
      }
    }
  });

  it("skinProducts all have routineType=skin", () => {
    for (const p of skinProducts) {
      expect(p.routineType).toBe("skin");
    }
  });

  it("bodyProducts all have routineType=body", () => {
    for (const p of bodyProducts) {
      expect(p.routineType).toBe("body");
    }
  });

  it("bodySpecificProducts all have routineType=bodySpecific", () => {
    for (const p of bodySpecificProducts) {
      expect(p.routineType).toBe("bodySpecific");
    }
  });

  it("hairProducts all have routineType=hair", () => {
    for (const p of hairProducts) {
      expect(p.routineType).toBe("hair");
    }
  });

  it("wellnessProducts all have routineType=wellness", () => {
    for (const p of wellnessProducts) {
      expect(p.routineType).toBe("wellness");
    }
  });

  it("hair products have valid hairPhase if specified", () => {
    const validPhases = ["oiling", "washing", "postWash", "daily"];
    for (const p of hairProducts) {
      if (p.hairPhase) {
        expect(validPhases).toContain(p.hairPhase);
      }
    }
  });

  it("bodyAreas contain valid area codes", () => {
    const validAreas = ["UA", "IT", "BL", "IA", "B&S"];
    for (const p of products) {
      if (p.bodyAreas) {
        for (const area of p.bodyAreas) {
          expect(validAreas).toContain(area);
        }
      }
    }
  });
});

// ========================================
// Routines
// ========================================
describe("Routines data", () => {
  it("routines is a non-empty array", () => {
    expect(Array.isArray(routines)).toBe(true);
    expect(routines.length).toBeGreaterThan(0);
  });

  it("each routine has required fields", () => {
    for (const r of routines) {
      expect(r.id).toBeDefined();
      expect(typeof r.id).toBe("string");
      expect(r.name).toBeDefined();
      expect(r.type).toBeDefined();
      expect(r.timeOfDay).toBeDefined();
      expect(r.schedule).toBeDefined();
      expect(r.tags).toBeDefined();
    }
  });

  it("routine IDs are unique", () => {
    const ids = routines.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("routines have valid timeOfDay", () => {
    const validTimes = ["AM", "MIDDAY", "PM", "ANY"];
    for (const r of routines) {
      expect(validTimes).toContain(r.timeOfDay);
    }
  });

  it("routines have valid type", () => {
    const validTypes = ["skin", "hair", "body", "bodySpecific", "wellness", "workout", "food"];
    for (const r of routines) {
      expect(validTypes).toContain(r.type);
    }
  });

  it("routine schedule weekdays are valid", () => {
    for (const r of routines) {
      if (r.schedule.weekday) {
        for (const d of r.schedule.weekday) {
          expect(d).toBeGreaterThanOrEqual(0);
          expect(d).toBeLessThanOrEqual(6);
        }
      }
    }
  });

  it("routine steps have proper order fields", () => {
    for (const r of routines) {
      if (r.steps) {
        for (const s of r.steps) {
          expect(typeof s.order).toBe("number");
          expect(s.title).toBeDefined();
        }
      }
    }
  });
});

// ========================================
// Wardrobe
// ========================================
describe("Wardrobe data", () => {
  it("wardrobe is a non-empty array", () => {
    expect(Array.isArray(wardrobe)).toBe(true);
    expect(wardrobe.length).toBeGreaterThan(0);
  });

  it("each item has required fields", () => {
    for (const w of wardrobe) {
      expect(w.id).toBeDefined();
      expect(w.name).toBeDefined();
      expect(w.category).toBeDefined();
      expect(w.imageUrl).toBeDefined();
    }
  });

  it("wardrobe IDs are unique", () => {
    const ids = wardrobe.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("wardrobe items have valid category", () => {
    const validCategories = ["Top", "Bottom", "Dress", "Shoes", "Bags", "Innerwear", "Activewear", "Ethnic", "Outerwear", "Others"];
    for (const w of wardrobe) {
      expect(validCategories).toContain(w.category);
    }
  });

});

// ========================================
// Meals
// ========================================
describe("Meals data", () => {
  it("meals is a non-empty array", () => {
    expect(Array.isArray(meals)).toBe(true);
    expect(meals.length).toBeGreaterThan(0);
  });

  it("each meal has required fields", () => {
    for (const m of meals) {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.mealType).toBeDefined();
      expect(["breakfast", "lunch", "dinner"]).toContain(m.mealType);
      expect(Array.isArray(m.items)).toBe(true);
    }
  });

  it("meal IDs are unique", () => {
    const ids = meals.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("breakfastMeals have mealType=breakfast", () => {
    for (const m of breakfastMeals) {
      expect(m.mealType).toBe("breakfast");
    }
  });

  it("lunchMeals have mealType=lunch", () => {
    for (const m of lunchMeals) {
      expect(m.mealType).toBe("lunch");
    }
  });

  it("dinnerMeals have mealType=dinner", () => {
    for (const m of dinnerMeals) {
      expect(m.mealType).toBe("dinner");
    }
  });

  it("meals array contains all subcategories", () => {
    expect(meals.length).toBe(breakfastMeals.length + lunchMeals.length + dinnerMeals.length);
  });

  it("weekdays are valid if specified", () => {
    for (const m of meals) {
      if (m.weekdays) {
        for (const d of m.weekdays) {
          expect(d).toBeGreaterThanOrEqual(0);
          expect(d).toBeLessThanOrEqual(6);
        }
      }
    }
  });
});

// ========================================
// Dressings
// ========================================
describe("Dressings data", () => {
  it("dressings is a non-empty array", () => {
    expect(Array.isArray(dressings)).toBe(true);
    expect(dressings.length).toBeGreaterThan(0);
  });

  it("each dressing has required fields", () => {
    for (const d of dressings) {
      expect(d.id).toBeDefined();
      expect(d.name).toBeDefined();
      expect(typeof d.shelfLifeDays).toBe("number");
      expect(d.shelfLifeDays).toBeGreaterThan(0);
      expect(Array.isArray(d.ingredients)).toBe(true);
      expect(d.ingredients.length).toBeGreaterThan(0);
    }
  });

  it("dressing IDs are unique", () => {
    const ids = dressings.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ========================================
// Workouts
// ========================================
describe("Workouts data", () => {
  it("workouts is a non-empty array", () => {
    expect(Array.isArray(workouts)).toBe(true);
    expect(workouts.length).toBeGreaterThan(0);
  });

  it("each workout has required fields", () => {
    for (const w of workouts) {
      expect(w.id).toBeDefined();
      expect(w.name).toBeDefined();
      expect(Array.isArray(w.weekday)).toBe(true);
      expect(typeof w.durationMin).toBe("number");
      expect(w.durationMin).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(w.sections)).toBe(true);
      expect(w.sections.length).toBeGreaterThan(0);
    }
  });

  it("workout IDs are unique", () => {
    const ids = workouts.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("workout weekdays are valid", () => {
    for (const w of workouts) {
      for (const d of w.weekday) {
        expect(d).toBeGreaterThanOrEqual(0);
        expect(d).toBeLessThanOrEqual(6);
      }
    }
  });

  it("workout sections have exercises", () => {
    for (const w of workouts) {
      for (const s of w.sections) {
        expect(s.title).toBeDefined();
        expect(Array.isArray(s.exercises)).toBe(true);
        expect(s.exercises.length).toBeGreaterThan(0);
      }
    }
  });

  it("exercises have name field", () => {
    for (const w of workouts) {
      for (const s of w.sections) {
        for (const e of s.exercises) {
          expect(e.name).toBeDefined();
          expect(typeof e.name).toBe("string");
        }
      }
    }
  });
});

// ========================================
// Wishlist
// ========================================
describe("Wishlist data", () => {
  it("wishlist is a non-empty array", () => {
    expect(Array.isArray(wishlist)).toBe(true);
    expect(wishlist.length).toBeGreaterThan(0);
  });

  it("each item has required fields", () => {
    for (const w of wishlist) {
      expect(w.id).toBeDefined();
      expect(w.name).toBeDefined();
      expect(w.category).toBeDefined();
    }
  });

  it("wishlist IDs are unique", () => {
    const ids = wishlist.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("wishlist items have valid category", () => {
    const validCategories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Jewellery"];
    for (const w of wishlist) {
      expect(validCategories).toContain(w.category);
    }
  });

  it("prices are positive if specified", () => {
    for (const w of wishlist) {
      if (w.price !== undefined) {
        expect(w.price).toBeGreaterThan(0);
      }
    }
  });

  it("priority is valid if specified", () => {
    const validPriorities = ["Low", "Medium", "High"];
    for (const w of wishlist) {
      if (w.priority) {
        expect(validPriorities).toContain(w.priority);
      }
    }
  });
});

// ========================================
// Body Areas
// ========================================
describe("Body Areas data", () => {
  it("BODY_AREAS is a non-empty object", () => {
    expect(Object.keys(BODY_AREAS).length).toBeGreaterThan(0);
  });

  it("each area has name, color, border", () => {
    for (const key of Object.keys(BODY_AREAS)) {
      const area = BODY_AREAS[key as keyof typeof BODY_AREAS];
      expect(area.name).toBeDefined();
      expect(area.color).toBeDefined();
      expect(area.border).toBeDefined();
    }
  });

  it("getProductArea returns a valid area key", () => {
    const mockProduct = { bodyAreas: ["UA"] } as Product;
    const area = getProductArea(mockProduct);
    expect(area).toBeDefined();
    expect(BODY_AREAS[area]).toBeDefined();
  });

  it("getProductArea returns UA as default for no bodyAreas", () => {
    const mockProduct = {} as Product;
    const area = getProductArea(mockProduct);
    expect(area).toBe("UA");
  });
});

// ========================================
// Topics
// ========================================
describe("Topics data", () => {
  it("topics is a non-empty array", () => {
    expect(Array.isArray(topics)).toBe(true);
    expect(topics.length).toBeGreaterThan(0);
  });

  it("each topic has slug and title", () => {
    for (const t of topics) {
      expect(t.slug).toBeDefined();
      expect(t.title).toBeDefined();
    }
  });

  it("getPublicTopicSlugs returns an array", () => {
    const slugs = getPublicTopicSlugs();
    expect(Array.isArray(slugs)).toBe(true);
  });

  it("getPrivateTopicSlugs returns an array", () => {
    const slugs = getPrivateTopicSlugs();
    expect(Array.isArray(slugs)).toBe(true);
  });

  it("getTopicBySlug finds existing topic", () => {
    const slug = topics[0]!.slug;
    const found = getTopicBySlug(slug);
    expect(found).toBeDefined();
    expect(found!.slug).toBe(slug);
  });

  it("getTopicBySlug returns undefined for missing slug", () => {
    const found = getTopicBySlug("nonexistent-slug-xyz");
    expect(found).toBeUndefined();
  });
});

// ========================================
// Re-export index
// ========================================
describe("Data index re-exports", () => {
  it("re-exports products", async () => {
    const mod = await import("@/data/index");
    expect(mod.products).toBeDefined();
    expect(mod.products.length).toBeGreaterThan(0);
  });

  it("re-exports routines", async () => {
    const mod = await import("@/data/index");
    expect(mod.routines).toBeDefined();
  });

  it("re-exports wardrobe", async () => {
    const mod = await import("@/data/index");
    expect(mod.wardrobe).toBeDefined();
  });

  it("re-exports meals", async () => {
    const mod = await import("@/data/index");
    expect(mod.meals).toBeDefined();
  });

  it("re-exports dressings", async () => {
    const mod = await import("@/data/index");
    expect(mod.dressings).toBeDefined();
  });

  it("re-exports workouts", async () => {
    const mod = await import("@/data/index");
    expect(mod.workouts).toBeDefined();
  });

  it("re-exports wishlist", async () => {
    const mod = await import("@/data/index");
    expect(mod.wishlist).toBeDefined();
  });
});
