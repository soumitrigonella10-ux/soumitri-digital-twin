import type { Routine } from "@/types";

// ========================================
// BODYCARE ROUTINES (Aligned to BODY SSOT)
// ========================================
export const bodyRoutines: Routine[] = [
  // ----------------------------
  // AM (Daily Core + rotating)
  // ----------------------------
  {
    id: "r-body-am-daily",
    type: "body",
    name: "Bodycare AM (Daily)",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "AM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Body Sunscreen",
        durationMin: 2,
        productIds: ["p-body-sunscreen"],
        essential: true,
      },
      {
        order: 2,
        title: "Moisturize (Curel days)",
        durationMin: 2,
        productIds: ["p-curel-spray"],
      },
      {
        order: 3,
        title: "Moisturize (CeraVe days)",
        durationMin: 2,
        productIds: ["p-cerave-lotion"],
      },
      {
        order: 4,
        title: "Healing (as needed)",
        durationMin: 1,
        productIds: ["p-boroplus"],
      },
    ],
  },

  // ----------------------------
  // AM - Dry Brushing
  // ----------------------------
  {
    id: "r-body-am-brush",
    type: "body",
    name: "Bodycare AM (Dry Brush)",
    schedule: { weekday: [0, 1, 3, 5] }, // Sun, Mon, Wed, Fri
    timeOfDay: "AM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Dry Body Brush",
        durationMin: 3,
        productIds: ["p-body-brush"],
        essential: true,
      },
    ],
  },

  // ----------------------------
  // AM - Kojic Soap (Tue/Thu/Sat)
  // ----------------------------
  {
    id: "r-body-am-kojic",
    type: "body",
    name: "Bodycare AM (Kojic Soap Days)",
    schedule: { weekday: [2, 4, 6] }, // Tue, Thu, Sat
    timeOfDay: "AM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Kojic Acid Soap",
        durationMin: 2,
        productIds: ["p-kojic-soap"],
        essential: true,
      },
    ],
  },

  // ----------------------------
  // AM - Scrub (Sunday)
  // ----------------------------
  {
    id: "r-body-am-scrub",
    type: "body",
    name: "Bodycare AM (Scrub)",
    schedule: { weekday: [6] }, // Sunday (as per your SSOT block)
    timeOfDay: "AM",
    tags: { office: false, wfh: true, travel: false, goingOut: false },
    steps: [
      {
        order: 1,
        title: "Body Scrub",
        durationMin: 3,
        productIds: ["p-body-scrub"],
      },
    ],
  },

  // ----------------------------
  // AM - Shaving + After Shave (Sunday)
  // ----------------------------
  {
    id: "r-body-am-shave",
    type: "body",
    name: "Bodycare AM (Shave + After Shave)",
    schedule: { weekday: [0] }, // Sunday
    timeOfDay: "AM",
    tags: { office: false, wfh: true, travel: false, goingOut: false },
    steps: [
      {
        order: 1,
        title: "Shave Gel",
        durationMin: 3,
        productIds: ["p-shave-gel"],
        essential: true,
      },
      {
        order: 2,
        title: "After Shave",
        durationMin: 2,
        productIds: ["p-after-shave"],
        essential: true,
      },
    ],
  },

  // ----------------------------
  // PM - Glycolic Nights (Tue/Thu)
  // ----------------------------
  {
    id: "r-body-pm-glycolic",
    type: "body",
    name: "Bodycare PM (Glycolic Night)",
    schedule: { weekday: [2, 4] }, // Tue, Thu
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: false, goingOut: false },
    steps: [
      {
        order: 1,
        title: "Glycolic Acid",
        durationMin: 2,
        productIds: ["p-glycolic"],
        essential: true,
      },
      {
        order: 2,
        title: "Moisturize",
        durationMin: 2,
        productIds: ["p-hada-blue"],
        essential: true,
      },
    ],
  },

  // ----------------------------
  // PM - Double Shot Serum (Mon/Wed)
  // ----------------------------
  {
    id: "r-body-pm-double-shot",
    type: "body",
    name: "Bodycare PM (Double Shot Serum)",
    schedule: { weekday: [1, 3] }, // Mon, Wed
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Double Shot Serum",
        durationMin: 2,
        productIds: ["p-vitc-body"],
        essential: true,
      },
    ],
  },

  // ----------------------------
  // PM - Japanese Whitening Cream (Fri/Sat)
  // ----------------------------
  {
    id: "r-body-pm-japanese-whitening",
    type: "body",
    name: "Bodycare PM (Japanese Whitening Cream)",
    schedule: { weekday: [5, 6] }, // Fri, Sat
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Japanese Whitening Body Cream",
        durationMin: 2,
        productIds: ["p-japanese-whitening"],
        essential: true,
      },
    ],
  },
];
