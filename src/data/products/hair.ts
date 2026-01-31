import { Product } from "@/types";

// ========================================
// HAIRCARE PRODUCTS
// ========================================
// Hair Phases: oiling, washing, postWash (includes styling), daily
// Display Order: Sequential steps within each phase

export const hairProducts: Product[] = [
  // ========================================
  // 🧴 OILING (Pre-Wash) - Phase 1
  // ========================================
  {
    id: "p-parachute-almond-oil",
    name: "Parachute Almond Hair Oil",
    category: "Pre-wash Oil",
    actives: ["Almond Oil"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "oiling",
    timeOfDay: "ANY",
    displayOrder: 1,
  },
  {
    id: "p-ogx-rosemary-mint-oil",
    name: "OGX Rosemary Mint Oil",
    category: "Pre-wash Oil",
    actives: ["Rosemary", "Mint"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "oiling",
    timeOfDay: "ANY",
    displayOrder: 2,
  },
  {
    id: "p-ogx-coconut-miracle-oil",
    name: "OGX Coconut Miracle Oil",
    category: "Pre-wash Oil",
    actives: ["Coconut Oil"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "oiling",
    timeOfDay: "ANY",
    displayOrder: 3,
  },
  {
    id: "p-cliganic-jojoba-oil",
    name: "Cliganic Jojoba Oil",
    category: "Pre-wash Oil",
    actives: ["Jojoba Oil"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "oiling",
    timeOfDay: "ANY",
    displayOrder: 4,
  },
  {
    id: "p-diy-herb-infused-oil",
    name: "DIY Herb-Infused Oil",
    category: "Pre-wash Oil",
    actives: ["Herbs", "Carrier Oil"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "oiling",
    timeOfDay: "ANY",
    displayOrder: 5,
  },

  // ========================================
  // 🚿 WASHING - Phase 2
  // ========================================
  {
    id: "p-blue-cap-shampoo",
    name: "Blue Cap Anti-Dandruff Shampoo",
    category: "Anti-Dandruff Shampoo",
    actives: ["Zinc Pyrithione"],
    cautionTags: ["medicated"],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 1,
  },
  {
    id: "p-olaplex-no4-shampoo",
    name: "Olaplex No.4 Bond Maintenance Shampoo",
    category: "Shampoo",
    actives: ["Bis-Aminopropyl Diglycol Dimaleate"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 2,
  },
  {
    id: "p-olaplex-no3",
    name: "Olaplex No.3 Hair Perfector",
    category: "Protein Treatment",
    actives: ["Bis-Aminopropyl Diglycol Dimaleate"],
    cautionTags: ["protein"],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 3,
  },
  {
    id: "p-elizavecca-cer100-treatment",
    name: "Elizavecca CER-100 Collagen Coating Protein Treatment",
    category: "Protein Treatment",
    actives: ["Collagen", "Ceramides"],
    cautionTags: ["protein"],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 4,
  },
  {
    id: "p-dove-bond-mask",
    name: "Dove 10-in-1 Bond Strength Mask",
    category: "Hair Mask",
    actives: ["Bond Building Complex"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 5,
  },
  {
    id: "p-dfabulo-leave-in",
    name: "D'Fabulo Leave-In Conditioner",
    category: "Rinse-Out Conditioner",
    actives: ["Conditioning agents"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 6,
  },
  {
    id: "p-loreal-dream-lengths-conditioner",
    name: "L'Oréal Elvive Dream Lengths Shine Sealing Conditioner",
    category: "Rinse-Out Conditioner",
    actives: ["Castor Oil", "Vitamins"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 7,
  },
  {
    id: "p-loreal-glycolic-gloss",
    name: "L'Oréal Elvive Glycolic Gloss",
    category: "Hair Gloss",
    actives: ["Glycolic Acid"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "washing",
    timeOfDay: "ANY",
    displayOrder: 8,
  },

  // ========================================
  // 🌿 POST-WASH CARE & STYLING - Phase 3
  // ========================================
  {
    id: "p-elizavecca-cer100-postwash",
    name: "Elizavecca CER-100 Collagen Coating Protein Treatment",
    category: "Light Protein",
    actives: ["Collagen", "Ceramides"],
    cautionTags: ["protein"],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 1,
  },
  {
    id: "p-pantene-collagen-repair",
    name: "Pantene Pro-V Collagen Repair Conditioner",
    category: "Leave-In Conditioner",
    actives: ["Collagen", "Panthenol"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 2,
  },
  {
    id: "p-elizavecca-essence-oil",
    name: "Elizavecca CER-100 Hair Essence Oil",
    category: "Serum",
    actives: ["Ceramides", "Oils"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 3,
  },
  {
    id: "p-tresemme-keratin-serum",
    name: "TRESemmé Keratin Smooth Serum",
    category: "Serum",
    actives: ["Keratin", "Marula Oil"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 4,
  },
  {
    id: "p-tresemme-heat-defence",
    name: "TRESemmé Heat Defence Spray",
    category: "Heat Protectant",
    actives: ["Silicones", "UV filters"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 5,
  },
  {
    id: "p-hairpure-mousse",
    name: "Hair Pure Extra Hold Styling Mousse",
    category: "Mousse",
    actives: ["Styling polymers"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 6,
  },
  {
    id: "p-loreal-fix-style-spray",
    name: "L'Oréal Studio Line Fix & Style Spray",
    category: "Setting Spray",
    actives: ["Styling polymers"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 7,
  },
  {
    id: "p-blowdry-brush",
    name: "Blow-Dry Brush (Purple)",
    category: "Tool",
    actives: [],
    cautionTags: ["heat"],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "ANY",
    displayOrder: 8,
  },
  {
    id: "p-heatless-curling-ribbon",
    name: "Heatless Curling Ribbon (Pink)",
    category: "Tool",
    actives: [],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "postWash",
    timeOfDay: "PM",
    displayOrder: 9,
  },

  // ========================================
  // 💨 DAILY CARE - Phase 4
  // ========================================
  {
    id: "p-monday-dry-shampoo",
    name: "Monday Dry Shampoo",
    category: "Dry Shampoo",
    actives: ["Starch"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "daily",
    timeOfDay: "AM",
    displayOrder: 1,
  },
  {
    id: "p-mielle-rosemary-oil",
    name: "Mielle Rosemary Mint Scalp & Hair Strengthening Oil",
    category: "Growth Oil",
    actives: ["Rosemary", "Mint", "Biotin"],
    cautionTags: [],
    routineType: "hair",
    hairPhase: "daily",
    timeOfDay: "PM",
    displayOrder: 2,
  },
];

// ========================================
// HELPER: Get hair products by phase
// ========================================
export const getHairProductsByPhase = (
  phase: "oiling" | "washing" | "postWash" | "daily"
): Product[] => {
  return hairProducts
    .filter((p) => p.hairPhase === phase)
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
};
