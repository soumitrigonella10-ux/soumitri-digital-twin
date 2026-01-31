import { Routine } from "@/types";

// ========================================
// FOOD ROUTINES
// ========================================
export const foodRoutines: Routine[] = [
  {
    id: "r-food-daily",
    type: "food",
    name: "Daily Meal Plan",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "ANY",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Breakfast: Spicy Scramble",
        description: "Eggs + spinach + chili + onion + spices",
        durationMin: 15,
        essential: true,
      },
      {
        order: 2,
        title: "Lunch: Power Bowl",
        description: "Greens + protein + complex carb + crunch + dressing",
        durationMin: 10,
        essential: true,
      },
      {
        order: 3,
        title: "Snack: Protein + Fruit",
        description: "Greek yogurt or nuts + apple/berries",
        durationMin: 5,
      },
      {
        order: 4,
        title: "Dinner: Salad Bowl",
        description: "Leafy greens + beans + pickled veg + protein + dressing",
        durationMin: 15,
        essential: true,
      },
    ],
  },
];
