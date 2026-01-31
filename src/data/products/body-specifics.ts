import { Product } from "@/types";

// ========================================
// BODY-SPECIFIC PRODUCTS (Targeted Areas)
// ========================================
// Body Areas: UA = Underarm, IT = Inner Thigh, BL = Bikini Line, IA = Intimate Area, B = Belly/Stomach
// Display Order: Simple step order within each area + time routine (1, 2, 3...)

export const bodySpecificProducts: Product[] = [
  // ========================================
  // 🦶 UNDERARM (UA)
  // ========================================
  // --- AM ---
  {
    id: "p-kojic-soap-ua",
    name: "Kojic Acid Soap",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 1,
  },
  {
    id: "p-even-tone-spray-ua-am",
    name: "Asaya Even Tone Body Spray",
    category: "Treatment",
    actives: ["Brightening actives"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },
  // --- PM ---
  {
    id: "p-even-tone-spray-ua-pm",
    name: "Asaya Even Tone Body Spray",
    category: "Treatment",
    actives: ["Brightening actives"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 1,
  },

  // ========================================
  // 🦵 INNER THIGH, BIKINI LINE, INTIMATE AREA (IT/BL/IA)
  // ========================================
  // --- AM ---
  {
    id: "p-acmed-cleanser-itblia",
    name: "Acmed Cleanser",
    category: "Cleanser",
    actives: ["Azelaic Acid"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 3, 5], // Sun, Mon, Wed, Fri
    displayOrder: 1,
  },
  {
    id: "p-kojic-soap-itblia",
    name: "Kojic Acid Soap",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "AM",
    weekdays: [2, 4, 6], // Tue, Thu, Sat
    displayOrder: 1,
  },
  {
    id: "p-vaseline-gluta-hya-itblia-am",
    name: "Vaseline Gluta-Hya Lotion",
    category: "Moisturizer",
    actives: ["Glutathione", "Hyaluronic Acid", "Brightening agents"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },
  {
    id: "p-vaseline-blue-seal-itblia-am",
    name: "Vaseline Blue Seal Petroleum Jelly (Jar)",
    category: "Occlusive",
    actives: ["Petrolatum"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 3,
  },

  // --- PM ---
  {
    id: "p-bodywise-urea-blia",
    name: "Bodywise Urea Body Lotion",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["BL", "IA"],
    timeOfDay: "PM",
    weekdays: [1, 3, 5], // Mon, Wed, Fri - Bikini Line & Intimate Area
    displayOrder: 1,
  },
  {
    id: "p-bodywise-urea-ia-only",
    name: "Bodywise Urea Body Lotion",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["IA"],
    timeOfDay: "PM",
    weekdays: [1, 3], // Mon, Wed - Intimate Area only (extra application)
    displayOrder: 1,
  },
  {
    id: "p-kozicare-itbl",
    name: "Kozicare Cream",
    category: "Treatment",
    actives: ["Kojic Acid", "Arbutin", "Glutathione"],
    cautionTags: ["brightening", "photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday - Inner Thigh & Bikini Line
    displayOrder: 2,
  },
  {
    id: "p-kozicare-ia",
    name: "Kozicare Cream",
    category: "Treatment",
    actives: ["Kojic Acid", "Arbutin", "Glutathione"],
    cautionTags: ["brightening", "photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["IA"],
    timeOfDay: "PM",
    weekdays: [1, 3], // Mon, Wed - Intimate Area only
    displayOrder: 2,
  },
  {
    id: "p-vaseline-blue-seal-itblia-pm",
    name: "Vaseline Blue Seal Petroleum Jelly (Jar)",
    category: "Occlusive",
    actives: ["Petrolatum"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 3,
  },

  // ========================================
  // 🫃 STOMACH/BELLY (B)
  // ========================================
  // --- AM ---
  {
    id: "p-kojic-soap-belly-am",
    name: "Kojic Acid Soap",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "AM",
    weekdays: [2, 4, 6], // Tue, Thu, Sat
    displayOrder: 1,
  },
  {
    id: "p-vaseline-gluta-hya-belly-am",
    name: "Vaseline Gluta-Hya Lotion",
    category: "Moisturizer",
    actives: ["Glutathione", "Hyaluronic Acid", "Brightening agents"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },

  // --- PM ---
  {
    id: "p-tretinoin-belly",
    name: "Tretinoin Cream",
    category: "Retinoid",
    actives: ["Tretinoin"],
    cautionTags: ["strong-active", "photosensitizing", "drying", "irritation-risk"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "PM",
    weekdays: [3, 6], // Wed, Sat
    displayOrder: 1,
  },
  {
    id: "p-glycolic-toner-belly",
    name: "Glycolic Acid Toner",
    category: "Chemical Exfoliant",
    actives: ["Glycolic Acid"],
    cautionTags: ["strong-active", "photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "PM",
    weekdays: [1, 5], // Mon, Fri
    displayOrder: 1,
  },
  {
    id: "p-chromalite-belly",
    name: "Chromalite Cream",
    category: "Treatment",
    actives: ["Brightening actives", "Kojic Acid", "Arbutin"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "PM",
    weekdays: [2, 4], // Tue, Thu
    displayOrder: 1,
  },
  {
    id: "p-niacinamide-belly",
    name: "Niacinamide 10% Serum",
    category: "Serum",
    actives: ["Niacinamide 10%"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },
  {
    id: "p-urea-moisturizer-belly",
    name: "Urea 10% Moisturizer",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active"],
    routineType: "bodySpecific",
    bodyAreas: ["B"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 3,
  },

  // ========================================
  // 👄 LIPS
  // ========================================
  {
    id: "p-wishcare-lipbalm-spf",
    name: "WishCare Ceramide Lip Balm SPF 50 (Tinted)",
    category: "Lip Care",
    actives: ["Ceramides", "SPF 50"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: [],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 1,
  },
  {
    id: "p-lip-mask-night",
    name: "Lip Balm/Mask (Night)",
    category: "Lip Care",
    actives: ["Occlusives", "Emollients"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: [],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 1,
  },

  // ========================================
  // 🧖‍♀️ OCCASIONAL
  // ========================================
  {
    id: "p-veet-wax-strips",
    name: "Veet Wax Strips",
    category: "Hair Removal",
    actives: [],
    cautionTags: ["irritation-risk"],
    routineType: "bodySpecific",
    bodyAreas: ["UA", "IT", "BL", "IA"],
    timeOfDay: "ANY",
    weekdays: [], // Occasional/As needed
    displayOrder: 1,
  },
];

// ========================================
// HELPER: Get products for specific body area, time, and weekday
// ========================================
export const getBodySpecificProducts = (
  area: "UA" | "IT" | "BL" | "IA" | "B" | "LIPS",
  timeOfDay: "AM" | "PM",
  weekday: number // 0=Sun, 1=Mon, ..., 6=Sat
): Product[] => {
  return bodySpecificProducts
    .filter((p) => {
      // Handle LIPS which uses empty bodyAreas
      if (area === "LIPS") {
        return (
          p.bodyAreas?.length === 0 &&
          p.category === "Lip Care" &&
          p.timeOfDay === timeOfDay &&
          (p.weekdays?.includes(weekday) || p.weekdays?.length === 0)
        );
      }
      // Regular body areas
      return (
        p.bodyAreas?.includes(area as "UA" | "IT" | "BL" | "IA" | "B") &&
        p.timeOfDay === timeOfDay &&
        (p.weekdays?.includes(weekday) || p.weekdays?.length === 0)
      );
    })
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
};

// ========================================
// HELPER: Get all products for a weekday grouped by area and time
// ========================================
export const getDailyBodyRoutine = (weekday: number) => {
  const areas = ["UA", "IT", "BL", "IA", "B", "LIPS"] as const;
  const times = ["AM", "PM"] as const;

  const routine: Record<string, Record<string, Product[]>> = {};

  for (const area of areas) {
    routine[area] = {};
    for (const time of times) {
      routine[area][time] = getBodySpecificProducts(area, time, weekday);
    }
  }

  return routine;
};
