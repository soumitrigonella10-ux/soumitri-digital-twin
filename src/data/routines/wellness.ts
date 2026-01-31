import { Routine } from "@/types";

// ========================================
// WELLNESS ROUTINES
// Goals: Glowing skin, thick black hair, higher energy,
// less pigmentation, better cognition, deep sleep
// ========================================
export const wellnessRoutines: Routine[] = [
  {
    id: "r-wellness-am",
    type: "wellness",
    name: "Morning Wellness (With Breakfast)",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "AM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Vitamin B12",
        description: "500 mcg - Energy, metabolism, hair health (Mon & Wed only)",
        durationMin: 1,
        productIds: ["p-vitamin-b12"],
        essential: true,
        weekdaysOnly: [1, 3], // Monday & Wednesday
      },
      {
        order: 2,
        title: "Vitamin D3 + K2",
        description: "D3 600 IU + K2 55 mcg - Take together for synergy",
        durationMin: 1,
        productIds: ["p-vitamin-d3", "p-vitamin-k2"],
        essential: true,
      },
      {
        order: 3,
        title: "Eye Support",
        description: "Vision protection, screen strain relief",
        durationMin: 1,
        productIds: ["p-eye-support"],
      },
      {
        order: 4,
        title: "Matcha Latte",
        description: "L-theanine 100-200 mg - Calm focus, reduces caffeine jitters",
        durationMin: 5,
        productIds: ["p-l-theanine"],
      },
    ],
    notes: "Take after eating eggs, avocado, nuts, or yogurt for better fat-soluble vitamin absorption",
  },
  {
    id: "r-wellness-midday",
    type: "wellness",
    name: "Midday Wellness (Lunch Time)",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "MIDDAY",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Spirulina",
        description: "1-2 g - Detox, skin glow, minerals",
        durationMin: 1,
        productIds: ["p-spirulina"],
      },
      {
        order: 2,
        title: "Vitamin C",
        description: "500 mg or fruit source - Collagen support, pigmentation control",
        durationMin: 1,
        productIds: ["p-vitamin-c"],
        essential: true,
      },
      {
        order: 3,
        title: "Marine Collagen",
        description: "5-10 g - Skin elasticity, hair thickness",
        durationMin: 1,
        productIds: ["p-marine-collagen"],
        essential: true,
      },
      {
        order: 4,
        title: "Fast Metabolism Tea",
        description: "1 cup - Digestion & fat burning",
        durationMin: 5,
        productIds: ["p-metabolism-tea"],
      },
      {
        order: 5,
        title: "Vitamin E Foods",
        description: "Sunflower seeds, almonds, avocado, or spinach - Skin repair & glow",
        durationMin: 5,
        productIds: ["p-vitamin-e-foods"],
      },
    ],
  },
  {
    id: "r-wellness-pm",
    type: "wellness",
    name: "Night Wellness (Dinner / Before Bed)",
    schedule: { weekday: [0, 1, 2, 3, 4, 5, 6] },
    timeOfDay: "PM",
    tags: { office: true, wfh: true, travel: true, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Omega-3 (with dinner)",
        description: "250-500 mg DHA/EPA - Hair, skin, brain, anti-inflammation",
        durationMin: 1,
        productIds: ["p-omega3"],
        essential: true,
      },
      {
        order: 2,
        title: "Probiotic (with dinner)",
        description: "Yogurt or buttermilk - Gut health, nutrient absorption",
        durationMin: 5,
        productIds: ["p-probiotic"],
      },
      {
        order: 3,
        title: "Magnesium Glycinate",
        description: "400 mg - 30-60 min before bed for deep sleep & muscle relaxation",
        durationMin: 1,
        productIds: ["p-magnesium"],
        essential: true,
      },
    ],
    notes: "Take Omega-3 & probiotics with dinner. Magnesium 30-60 min before bed.",
  },
];
