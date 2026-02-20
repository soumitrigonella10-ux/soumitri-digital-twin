import type { Routine } from "@/types";

// ========================================
// HAIRCARE ROUTINES
// ========================================
export const hairRoutines: Routine[] = [
  {
    id: "r-hair-full",
    type: "hair",
    name: "Haircare (Full Treatment Day)",
    schedule: { weekday: [6] },
    timeOfDay: "ANY",
    tags: { office: false, wfh: true, travel: false, goingOut: false },
    steps: [
      {
        order: 1,
        title: "Pre-wash Oil",
        durationMin: 30,
        productIds: ["p-hair-oil"],
      },
      {
        order: 2,
        title: "Scalp Scrub",
        durationMin: 5,
        productIds: ["p-hair-scrub"],
      },
      {
        order: 3,
        title: "Shampoo",
        durationMin: 5,
        productIds: ["p-shampoo"],
        essential: true,
      },
      {
        order: 4,
        title: "Conditioner",
        durationMin: 5,
        productIds: ["p-conditioner"],
        essential: true,
      },
      {
        order: 5,
        title: "Hair Mask",
        durationMin: 10,
        productIds: ["p-hair-mask"],
      },
      {
        order: 6,
        title: "Final Rinse",
        durationMin: 2,
      },
    ],
  },
  {
    id: "r-hair-light",
    type: "hair",
    name: "Haircare (Quick Wash)",
    schedule: { weekday: [3] },
    timeOfDay: "ANY",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Shampoo",
        durationMin: 5,
        productIds: ["p-shampoo"],
        essential: true,
      },
      {
        order: 2,
        title: "Conditioner",
        durationMin: 3,
        productIds: ["p-conditioner"],
        essential: true,
      },
    ],
  },
];
