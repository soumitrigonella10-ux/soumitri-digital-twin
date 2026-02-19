import { Dressing, Ingredient } from "@/types";

// ========================================
// DRESSING TYPE
// ========================================
export interface DressingRecipe {
  id: string;
  name: string;
  shelfLifeDays: number;
  baseType: "yogurt" | "oil" | "tahini" | "tomato" | "tamarind";
  ingredients: Ingredient[];
  instructions: string[];
  tips?: string[];
  tags?: string[];
}

// ========================================
// LUNCH DRESSINGS
// ========================================
export const lunchDressings: DressingRecipe[] = [
  {
    id: "d-lemon-cumin-yogurt",
    name: "Lemon–Cumin Yogurt",
    shelfLifeDays: 5,
    baseType: "yogurt",
    ingredients: [
      { name: "Thick curd", quantity: "5", unit: "cups (≈1 kg)" },
      { name: "Lemon juice", quantity: "1/2", unit: "cup" },
      { name: "Cumin powder", quantity: "3", unit: "tbsp" },
      { name: "Salt", quantity: "1¾", unit: "tsp" },
      { name: "Black pepper / chili powder", quantity: "1–1½", unit: "tsp (to taste)" },
      { name: "Water", quantity: "1/2–1", unit: "cup (as needed)" },
    ],
    instructions: [
      "Whisk curd until smooth",
      "Mix in lemon, jeera, salt, pepper",
      "Add water to reach pourable consistency",
    ],
    tips: ["Keep thick, avoid adding raw onion inside the jar"],
    tags: ["yogurt-based", "tangy", "indian"],
  },
  {
    id: "d-peanut-butter-satay",
    name: "Peanut Butter Satay",
    shelfLifeDays: 7,
    baseType: "oil",
    ingredients: [
      { name: "Peanut butter", quantity: "1", unit: "cup" },
      { name: "Lime/lemon juice", quantity: "1/2", unit: "cup" },
      { name: "Soy sauce", quantity: "1/3", unit: "cup" },
      { name: "Chili flakes", quantity: "2–3", unit: "tbsp" },
      { name: "Water", quantity: "4–4½", unit: "cups (adjust)" },
    ],
    instructions: [
      "Whisk peanut butter + soy + lime",
      "Add water slowly until it becomes a smooth pourable sauce",
      "Add chili flakes + optional sweetener",
    ],
    tags: ["oil-based", "nutty", "asian"],
  },
  {
    id: "d-tahini-lemon",
    name: "Tahini and Lemon",
    shelfLifeDays: 7,
    baseType: "tahini",
    ingredients: [
      { name: "Tahini", quantity: "2", unit: "cups" },
      { name: "Lemon juice", quantity: "1/2", unit: "cup" },
      { name: "Garlic paste", quantity: "2–3", unit: "tsp" },
      { name: "Salt", quantity: "1½–2", unit: "tsp" },
      { name: "Water", quantity: "4–4½", unit: "cups" },
    ],
    instructions: [
      "Mix tahini + lemon + garlic + salt (it'll thicken first)",
      "Add water little by little until creamy and pourable",
    ],
    tags: ["oil-based", "mediterranean", "creamy"],
  },
  {
    id: "d-mint-curd",
    name: "Mint Curd",
    shelfLifeDays: 5,
    baseType: "yogurt",
    ingredients: [
      { name: "Thick curd", quantity: "7", unit: "cups" },
      { name: "Mint leaves", quantity: "1½", unit: "cups" },
      { name: "Coriander leaves", quantity: "1", unit: "cup" },
      { name: "Lemon juice", quantity: "6–7", unit: "tbsp" },
      { name: "Roasted cumin powder", quantity: "5–7", unit: "tsp" },
      { name: "Salt", quantity: "1¾", unit: "tsp" },
      { name: "Green chili paste", quantity: "2–3", unit: "tsp" },
      { name: "Water", quantity: "as", unit: "needed" },
    ],
    instructions: [
      "Blend mint + coriander + lemon + ¼ cup water",
      "Mix into whisked curd",
      "Add salt + jeera, thin as needed",
    ],
    tags: ["yogurt-based", "herby", "indian", "refreshing"],
  },
  {
    id: "d-pickle-yogurt",
    name: "Pickle Yogurt",
    shelfLifeDays: 5,
    baseType: "yogurt",
    ingredients: [
      { name: "Thick curd", quantity: "7", unit: "cups" },
      { name: "Achar oil/paste", quantity: "7", unit: "tsp" },
      { name: "Lemon juice", quantity: "3–4", unit: "tbsp" },
      { name: "Salt", quantity: "1–1½", unit: "tsp" },
      { name: "Water", quantity: "¼–½", unit: "cup" },
    ],
    instructions: [
      "Whisk curd",
      "Mix in achar + lemon",
      "Taste and adjust salt",
    ],
    tags: ["yogurt-based", "spicy", "indian", "tangy"],
  },
  {
    id: "d-chilli-soy-sauce",
    name: "Chilli Soy Sauce",
    shelfLifeDays: 7,
    baseType: "oil",
    ingredients: [
      { name: "Soy sauce", quantity: "1/2", unit: "cup" },
      { name: "Sesame oil", quantity: "1/3", unit: "cup" },
      { name: "Lemon juice", quantity: "1/3", unit: "cup" },
      { name: "Grated ginger", quantity: "1/4", unit: "cup" },
      { name: "Honey/jaggery", quantity: "2", unit: "tbsp" },
      { name: "Water", quantity: "5–5½", unit: "cups" },
      { name: "Garlic", quantity: "1", unit: "tbsp" },
      { name: "Chili flakes", quantity: "1–2", unit: "tbsp" },
    ],
    instructions: [
      "Mix soy + sesame oil + vinegar + honey",
      "Stir in ginger (and garlic/chili)",
      "Add water until it's a light drizzle sauce",
    ],
    tags: ["oil-based", "asian", "umami"],
  },
  {
    id: "d-tamarind-rasam",
    name: "Tamarind Rasam Style",
    shelfLifeDays: 7,
    baseType: "tamarind",
    ingredients: [
      { name: "Tamarind paste", quantity: "7", unit: "tbsp" },
      { name: "Water", quantity: "7", unit: "cups" },
      { name: "Salt", quantity: "1½–2", unit: "tsp" },
      { name: "Cumin powder", quantity: "5–7", unit: "tsp" },
      { name: "Black pepper", quantity: "1–2", unit: "tsp" },
      { name: "Crushed garlic", quantity: "2", unit: "tbsp" },
      { name: "Chili", quantity: "1", unit: "tsp" },
      { name: "Curry leaves", quantity: "8–10", unit: "leaves" },
    ],
    instructions: [
      "Mix tamarind paste + water",
      "Add salt + jeera + pepper + garlic",
      "Rest 10 min so flavors settle",
    ],
    tags: ["tamarind-based", "south-indian", "tangy", "warming"],
  },
  {
    id: "d-tomato-sauce",
    name: "Tomato Sauce",
    shelfLifeDays: 7,
    baseType: "tomato",
    ingredients: [
      { name: "Tomato puree", quantity: "4", unit: "cups" },
      { name: "Garlic paste", quantity: "2", unit: "tbsp" },
      { name: "Olive oil", quantity: "1/4", unit: "cup" },
      { name: "Lemon juice", quantity: "1/4", unit: "cup" },
      { name: "Oregano", quantity: "2", unit: "tbsp" },
      { name: "Chili flakes", quantity: "1–2", unit: "tbsp" },
      { name: "Salt", quantity: "2", unit: "tsp" },
      { name: "Water", quantity: "2", unit: "cups" },
    ],
    instructions: [
      "Blend everything until smooth",
      "Adjust salt + vinegar",
      "Add water to make it pourable",
    ],
    tags: ["tomato-based", "italian", "versatile"],
  },
];

// ========================================
// SIMPLE DRESSINGS (store-managed seed data)
// ========================================
export const dressings: Dressing[] = [
  {
    id: "d-spicy-tahini",
    name: "Spicy Tahini Dressing",
    shelfLifeDays: 7,
    ingredients: ["tahini", "lemon juice", "garlic", "sriracha", "salt", "water"],
  },
  {
    id: "d-herb-vinaigrette",
    name: "Fresh Herb Vinaigrette",
    shelfLifeDays: 10,
    ingredients: ["olive oil", "apple cider vinegar", "fresh herbs", "dijon mustard", "honey", "salt"],
  },
  {
    id: "d-miso-ginger",
    name: "Miso Ginger Dressing",
    shelfLifeDays: 14,
    ingredients: ["white miso", "rice vinegar", "ginger", "sesame oil", "honey", "water"],
  },
  {
    id: "d-lemon-garlic",
    name: "Lemon Garlic Dressing",
    shelfLifeDays: 5,
    ingredients: ["lemon juice", "olive oil", "garlic", "oregano", "salt", "pepper"],
  },
];
