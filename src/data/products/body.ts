import { Product } from "@/types";

// ========================================
// BODYCARE PRODUCTS
// ========================================
export const bodyProducts: Product[] = [
  // ------------------
  // CLEANING ROUTINE
  // ------------------
  {
    id: "p-body-brush",
    name: "Dry Body Brush",
    category: "Exfoliation Tool",
    actives: ["Mechanical exfoliation"],
    cautionTags: ["abrasive"],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [1, 3, 5, 0], // Mon, Wed, Fri, Sun
    displayOrder: 1,
  },
  {
    id: "p-kojic-soap",
    name: "Kojic Acid Soap",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [2, 4, 6],
    displayOrder: 2,
  },
  {
    id: "p-body-scrub",
    name: "Pink Sugar Scrub",
    category: "Exfoliant",
    actives: ["Sugar"],
    cautionTags: ["abrasive"],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [6], // Sunday
    displayOrder: 3,
  },

  // ------------------
  // POST BATH
  // ------------------
  {
    id: "p-curel-spray",
    name: "Curel Deep Moisture Spray",
    category: "Moisturizer",
    actives: ["Ceramides"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [0, 2, 4, 6],
    displayOrder: 4,
  },
  {
    id: "p-cerave-lotion",
    name: "CeraVe Moisturizing Lotion",
    category: "Moisturizer",
    actives: ["Ceramides", "Hyaluronic Acid"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [1, 3, 5],
    displayOrder: 5,
  },
  {
    id: "p-body-sunscreen",
    name: "Nivea Protect & Moisture SPF 50",
    category: "Sunscreen",
    actives: ["UV Filters"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    displayOrder: 6,
  },

  // ------------------
  // NIGHT ROUTINE (Tue/Thu)
  // ------------------
  {
    id: "p-glycolic",
    name: "Minimalist Glycolic Acid 8%",
    category: "Chemical Exfoliant",
    actives: ["Glycolic Acid"],
    cautionTags: ["strong-active", "photosensitizing"],
    routineType: "body",
    timeOfDay: "PM",
    weekdays: [2, 4], // Tue, Thu
    displayOrder: 7,
  },
  {
    id: "p-hada-blue",
    name: "Hada Labo Gel Cream",
    category: "Moisturizer",
    actives: ["Hyaluronic Acid"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "PM",
    weekdays: [2, 4],
    displayOrder: 8,
  },
  {
    id: "p-vitc-body",
    name: "Double Shot Serum",
    category: "Serum",
    actives: ["Vitamin C"],
    cautionTags: ["photosensitizing"],
    routineType: "body",
    timeOfDay: "PM",
    weekdays: [1, 3], // Mon, Wed
    displayOrder: 9,
  },
  {
    id: "p-japanese-whitening",
    name: "Japanese Whitening Body Cream",
    category: "Serum",
    actives: ["Vitamin C"],
    cautionTags: ["photosensitizing"],
    routineType: "body",
    timeOfDay: "PM",
    weekdays: [5, 6], // Fri, Sat
    displayOrder: 10,
  },

  // ------------------
  // SHAVING (SUNDAY)
  // ------------------
  {
    id: "p-shave-gel",
    name: "Satin Care Sensitive Shave Gel",
    category: "Shave",
    actives: ["Aloe"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [0], // Sunday
    displayOrder: 11,
  },
  {
    id: "p-after-shave",
    name: "Plush After Shave Gel",
    category: "Post Shave",
    actives: ["Aloe", "Panthenol"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [0],
    displayOrder: 12,
  },

  // ------------------
  // HEALING
  // ------------------
  {
    id: "p-boroplus",
    name: "Boroplus Antiseptic Cream",
    category: "Healing",
    actives: ["Herbal actives"],
    cautionTags: [],
    routineType: "body",
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    displayOrder: 13,
  },
];
