import type { Product } from "@/types";

// ========================================
// BODY-SPECIFIC PRODUCTS (Targeted Areas)
// ========================================
// Body Areas: UA = Underarm, IT = Inner Thigh, BL = Bikini Line, IA = Intimate Area, B&S = Butt & Stomach
// Display Order: Simple step order within each area + time routine (1, 2, 3...)

export const bodySpecificProducts: Product[] = [
  // ========================================
  // CLEANSERS
  // ========================================
  {
    id: "p-kojic-soap-ua",
    name: "Kojic Acid Soap (30s)",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "AM",
    weekdays: [2, 4, 6], // Tue, Thu, Sat
    displayOrder: 1,
  },
  {
    id: "p-kojic-soap-itblia",
    name: "Kojic Acid Soap (30s)",
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
    id: "p-kojic-soap-bs",
    name: "Kojic Acid Soap (30s)",
    category: "Cleanser",
    actives: ["Kojic Acid"],
    cautionTags: ["brightening", "photosensitizing", "drying"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "AM",
    weekdays: [2, 4, 6], // Tue, Thu, Sat
    displayOrder: 1,
  },

  // ========================================
  // TREATMENTS & SERUMS
  // ========================================
  {
    id: "p-asava-spray-ua-am",
    name: "Asaya Even Tone Body Spray",
    category: "Body Treatment",
    actives: ["Brightening actives"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },
  {
    id: "p-asava-spray-ua-pm",
    name: "Asaya Even Tone Body Spray",
    category: "Body Treatment",
    actives: ["Brightening actives"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["UA"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 1,
  },

  // ========================================
  // MOISTURIZERS
  // ========================================
  {
    id: "p-gluta-hya-itblia-am",
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
    id: "p-gluta-hya-bs-am",
    name: "Vaseline Gluta-Hya Lotion",
    category: "Moisturizer",
    actives: ["Glutathione", "Hyaluronic Acid", "Brightening agents"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "AM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 2,
  },

  // ========================================
  // OCCLUSIVES
  // ========================================
  {
    id: "p-vaseline-itblia-am",
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
  {
    id: "p-vaseline-itblia-pm",
    name: "Vaseline Blue Seal Petroleum Jelly (Jar)",
    category: "Occlusive",
    actives: ["Petrolatum"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL", "IA"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday - Final occlusive layer
    displayOrder: 4,
  },

  // ========================================
  // EXFOLIANTS & ACTIVES (PM)
  // ========================================
  {
    id: "p-urea-itbl-pm",
    name: "Exfoliant 10% Urea Body Lotion",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["IT", "BL"],
    timeOfDay: "PM",
    weekdays: [1, 3, 5], // Mon, Wed, Fri
    displayOrder: 1,
  },
  {
    id: "p-urea-ia-pm",
    name: "Exfoliant 10% Urea Body Lotion",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["IA"],
    timeOfDay: "PM",
    weekdays: [1, 3], // Mon, Wed
    displayOrder: 1,
  },
  {
    id: "p-urea-bs-pm",
    name: "Exfoliant 10% Urea Body Lotion",
    category: "Moisturizer",
    actives: ["Urea 10%"],
    cautionTags: ["active", "exfoliating"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    displayOrder: 5,
  },

  // ========================================
  // BUTT & STOMACH (B&S) TREATMENTS (PM)
  // ========================================
  {
    id: "p-tretinoin-bs",
    name: "Tretinoin Cream",
    category: "Retinoid",
    actives: ["Tretinoin"],
    cautionTags: ["strong-active", "photosensitizing", "drying", "irritation-risk"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "PM",
    weekdays: [3, 6], // Wed, Sat
    displayOrder: 1,
  },
  {
    id: "p-glycolic-bs",
    name: "Glycolic Acid Treatment",
    category: "Chemical Exfoliant",
    actives: ["Glycolic Acid"],
    cautionTags: ["strong-active", "photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "PM",
    weekdays: [1, 5], // Mon, Fri
    displayOrder: 1,
  },
  {
    id: "p-chromalite-bs",
    name: "Chromalite Cream",
    category: "Body Treatment",
    actives: ["Brightening actives", "Kojic Acid", "Arbutin"],
    cautionTags: ["photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "PM",
    weekdays: [2, 4], // Tue, Thu
    displayOrder: 1,
  },
  {
    id: "p-niacinamide-bs",
    name: "10% Niacinamide Serum",
    category: "Serum",
    actives: ["Niacinamide 10%"],
    cautionTags: [],
    routineType: "bodySpecific",
    bodyAreas: ["B&S"],
    timeOfDay: "PM",
    weekdays: [0, 1, 2, 3, 4, 5, 6], // Everyday - 10 mins after other treatments
    displayOrder: 3,
  },

  // ========================================
  // BRIGHTENING TREATMENTS (PM)
  // ========================================
  {
    id: "p-kozicare-itbl",
    name: "Kozicare Cream",
    category: "Body Treatment",
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
    category: "Body Treatment",
    actives: ["Kojic Acid", "Arbutin", "Glutathione"],
    cautionTags: ["brightening", "photosensitizing"],
    routineType: "bodySpecific",
    bodyAreas: ["IA"],
    timeOfDay: "PM",
    weekdays: [1, 3], // Mon, Wed - Intimate Area only
    displayOrder: 2,
  },

];

// ========================================
// HELPER: Get products for specific body area, time, and weekday
// ========================================
export const getBodySpecificProducts = (
  area: "UA" | "IT" | "BL" | "IA" | "B&S",
  timeOfDay: "AM" | "PM",
  weekday: number // 0=Sun, 1=Mon, ..., 6=Sat
): Product[] => {
  return bodySpecificProducts
    .filter((p) => {
      return (
        p.bodyAreas?.includes(area) &&
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
  const areas = ["UA", "IT", "BL", "IA", "B&S"] as const;
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
