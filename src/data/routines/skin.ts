import type { Routine } from "@/types";

// ========================================
// SKINCARE ROUTINES
// ========================================

export const skinRoutines: Routine[] = [
  {
    id: "r-skin-am-daily",
    type: "skin",
    name: "Skincare AM (Daily)",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "AM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    // No steps: products + weekday schedules define what shows up
    productIds: [
      "p-wash-salicylic",
      "p-vitc-essence",
      "p-sekkesi-essence",
      "p-moisturizer",
      "p-sunscreen",
    ],
  },

  {
    id: "r-skin-pm-sun",
    type: "skin",
    name: "Skincare PM (Sun - Salicylic Night)",
    schedule: { weekday: [0] }, // Sunday
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    productIds: ["p-wash-cetaphil", "p-salicylic-serum"],
  },

  {
    id: "r-skin-pm-tret",
    type: "skin",
    name: "Skincare PM (Tret Night)",
    schedule: { weekday: [1, 3] }, // Mon, Wed
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: false, goingOut: false },
    productIds: ["p-wash-cetaphil", "p-tret", "p-pm-moisturizer"],
  },

  {
    id: "r-skin-pm-niacinamide",
    type: "skin",
    name: "Skincare PM (Niacinamide Night)",
    schedule: { weekday: [2, 4, 6] }, // Tue, Thu, Sat
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    productIds: ["p-wash-cetaphil", "p-niacinamide"],
  },

  {
    id: "r-skin-pm-peel",
    type: "skin",
    name: "Skincare PM (Peel Night)",
    schedule: { weekday: [5] }, // Friday
    timeOfDay: "PM",
    tags: { office: false, wfh: true, travel: false, goingOut: false },
    productIds: ["p-wash-cetaphil", "p-peel-aha-bha", "p-eye-pads"],
  },

  {
    id: "r-skin-pm-hydration",
    type: "skin",
    name: "Skincare PM (Hydration Night)",
    schedule: { weekday: [5] }, // Friday (same night as eye pads + peel; keep as fallback if you skip peel)
    timeOfDay: "PM",
    tags: { office: false, wfh: true, travel: false, goingOut: false },
    productIds: ["p-wash-cetaphil", "p-pm-moisturizer"],
  },
];

