import { Dressing } from "@/types";

// ========================================
// DRESSINGS
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
