import type { MealTemplate } from "@/types";

// ========================================
// LUNCH BOWL CONFIGURATION
// ========================================
export interface LunchBowlConfig {
  base: {
    item: string;
    quantity: string;
  };
  salads: {
    name: string;
    quantity: string;
  }[];
  proteinOptions: {
    name: string;
    quantity: string;
  }[];
  proteinPortions: {
    days: string;
    quantity: string;
  }[];
  quickProteinTopups: {
    combo: string;
    note: string;
  }[];
}

export const lunchBowlConfig: LunchBowlConfig = {
  base: {
    item: "Rice",
    quantity: "3/4–1 cup cooked",
  },
  salads: [
    { name: "Everyday Salads", quantity: "1/2 cup" },
  ],
  proteinOptions: [
    { name: "Chickpeas", quantity: "1/2 cup" },
    { name: "Rajma", quantity: "1/2 cup" },
    { name: "Paneer", quantity: "1/4 cup" },
  ],
  proteinPortions: [
    { days: "Monday/Tuesday", quantity: "120–140 g/bowl" },
    { days: "Wednesday/Thursday", quantity: "120–140 g/bowl" },
    { days: "Friday/Saturday", quantity: "100–120 g/bowl" },
    { days: "Sunday", quantity: "150 g/bowl" },
  ],
  quickProteinTopups: [
    { combo: "Paneer + chilli flakes", note: "Quick protein boost" },
    { combo: "Curd + roasted chana", note: "Probiotic + protein" },
    { combo: "Milk + peanut butter (shake)", note: "Liquid protein rescue" },
  ],
};

// ========================================
// LUNCH MEALS
// ========================================
export const lunchMeals: MealTemplate[] = [
  {
    id: "build-your-bowl",
    name: "Build Your Bowl",
    timeOfDay: "ANY",
    mealType: "lunch",
    items: ["Rice base", "Everyday salads", "Rotating proteins", "Quick topups"],
    ingredients: [
      {
        name: "Rice (cooked)",
        quantity: "3/4–1 cup",
        category: "grains"
      },
      {
        name: "Everyday Salads",
        quantity: "1/2 cup",
        category: "vegetables"
      },
      {
        name: "Protein (rotating)",
        quantity: "100-150g",
        category: "protein"
      }
    ],
    instructions: [
      "Start with rice base (3/4-1 cup cooked)",
      "Add everyday salads (1/2 cup)",
      "Choose protein based on daily rotation:",
      "• Monday/Tuesday: 120-140g chickpeas/rajma/paneer",
      "• Wednesday/Thursday: 120-140g chickpeas/rajma/paneer", 
      "• Friday/Saturday: 100-120g chickpeas/rajma/paneer",
      "• Sunday: 150g protein",
      "Optional: Add quick protein topups like paneer + chilli flakes"
    ],
    prepTimeMin: 15,
    servings: 1,
    tags: ["daily", "lunch-bowl", "balanced", "protein-rich", "customizable"]
  }
];