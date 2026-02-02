import { MealTemplate } from "@/types";

// ========================================
// DINNER MEALS
// ========================================
export const dinnerMeals: MealTemplate[] = [
  {
    id: "m-masoor-dal-soup",
    name: "Masoor Dal Tomato Soup",
    timeOfDay: "PM",
    mealType: "dinner",
    items: ["masoor dal", "tomato", "ginger-garlic paste", "spices", "lemon"],
    ingredients: [
      { name: "Red lentils (masoor)", quantity: "1/2", unit: "cup" },
      { name: "Water", quantity: "2½", unit: "cups" },
      { name: "Tomato puree", quantity: "1/2", unit: "cup (or 1 small tomato)" },
      { name: "Ginger-garlic paste", quantity: "1", unit: "tsp" },
      { name: "Cumin powder", quantity: "1/2", unit: "tsp" },
      { name: "Coriander powder", quantity: "1/2", unit: "tsp" },
      { name: "Red chili powder", quantity: "1/4", unit: "tsp" },
      { name: "Turmeric", quantity: "1/4", unit: "tsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" },
      { name: "Lemon juice", quantity: "1", unit: "tsp" },
      { name: "Butter/ghee (optional)", quantity: "1", unit: "tsp" },
    ],
    instructions: [
      "Boil/pressure cook masoor with water + turmeric + salt",
      "Add tomato puree + spices, simmer 5 min",
      "Finish with lemon",
      "Optional: Add butter/ghee for richness",
    ],
    weekdays: [1, 2, 3, 4], // Monday, Tuesday, Wednesday, Thursday (4 days)
    prepTimeMin: 5,
    cookTimeMin: 20,
    servings: 2,
    tags: ["vegetarian", "high-protein", "comfort", "no-fuss", "flavorful"],
  },
  {
    id: "m-moong-dal-soup",
    name: "Moong Dal Soup Bowl",
    timeOfDay: "PM",
    mealType: "dinner",
    items: ["moong dal", "ginger-garlic paste", "tadka", "lemon"],
    ingredients: [
      { name: "Moong dal (yellow)", quantity: "1/2", unit: "cup" },
      { name: "Water", quantity: "2½–3", unit: "cups (soup consistency)" },
      { name: "Ginger-garlic paste", quantity: "1", unit: "tsp" },
      { name: "Turmeric", quantity: "1/4", unit: "tsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" },
      { name: "Black pepper", quantity: "1/4", unit: "tsp" },
      { name: "Lemon juice", quantity: "1", unit: "tsp" },
      { name: "Oil/ghee (for tadka)", quantity: "1", unit: "tsp" },
      { name: "Cumin seeds (for tadka)", quantity: "1/2", unit: "tsp" },
      { name: "Hing (for tadka)", quantity: "a", unit: "pinch" },
      { name: "Chili flakes/green chili paste", quantity: "a", unit: "little" },
    ],
    instructions: [
      "Rinse dal → pressure cook 2 whistles (or boil 15–18 min)",
      "Mash slightly + add water to make it soupy",
      "Tadka: Heat oil/ghee → add cumin seeds → hing → chili flakes",
      "Pour tadka on top of dal",
      "Finish with lemon + pepper",
    ],
    weekdays: [5, 6, 0], // Friday, Saturday, Sunday (3 days)
    prepTimeMin: 5,
    cookTimeMin: 20,
    servings: 1,
    tags: ["vegetarian", "high-protein", "comfort", "light", "digestive"],
  },
];
