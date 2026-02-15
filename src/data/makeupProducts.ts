import { Product } from "@/types";

// Sample makeup products — in the future these should come from the data store
export const SAMPLE_MAKEUP_PRODUCTS: Product[] = [
  // -------------------- PRIMER --------------------
  {
    id: "primer-elf",
    name: "e.l.f",
    category: "Primer",
    shade: "Clear",
    displayOrder: 1,
    notes: "Hydrating gel-based gripping primer",
  },
  {
    id: "primer-lakme",
    name: "Lakme",
    category: "Primer",
    shade: "Universal",
    displayOrder: 2,
    notes: "Blurring silicone primer",
  },

  // -------------------- CC CREAM --------------------
  {
    id: "cccream-lakme",
    name: "Lakme",
    category: "CC Cream",
    shade: "Beige",
    displayOrder: 3,
    notes: "SPF 30 PA++ skin stylist CC cream",
  },

  // -------------------- FOUNDATION --------------------
  {
    id: "foundation-nykaa",
    name: "Nykaa",
    category: "Foundation",
    shade: "Warm Beige",
    displayOrder: 4,
    notes: "Oil-control matte finish foundation",
  },

  // -------------------- CONCEALER --------------------
  {
    id: "concealer-sugar",
    name: "SUGAR",
    category: "Concealer",
    shade: "Medium",
    displayOrder: 5,
    notes: "Full coverage liquid concealer",
  },
  {
    id: "concealer-lakme",
    name: "Lakme",
    category: "Concealer",
    shade: "Light/Medium",
    displayOrder: 6,
    notes: "Stick concealer for spot correction",
  },

  // -------------------- HIGHLIGHT --------------------
  {
    id: "highlighter-insight",
    name: "Insight Cosmetics",
    category: "Highlight",
    shade: "Golden Glow",
    displayOrder: 7,
    notes: "Pressed powder highlighter",
  },
  {
    id: "highlighter-sugar",
    name: "SUGAR",
    category: "Highlight",
    shade: "Gold",
    displayOrder: 8,
    notes: "Powder highlighter",
  },
  {
    id: "highlighter-swissbeauty",
    name: "Swiss Beauty",
    category: "Highlight",
    shade: "Rose Gold",
    displayOrder: 9,
    notes: "Liquid shimmer highlighter",
  },

  // -------------------- BLUSH --------------------
  {
    id: "blush-benefit",
    name: "Benefit Cosmetics",
    category: "Blush",
    shade: "Rose",
    displayOrder: 10,
    notes: "Liquid cheek and lip tint",
  },
  {
    id: "blush-swissbeauty",
    name: "Swiss Beauty",
    category: "Blush",
    shade: "Pink",
    displayOrder: 11,
    notes: "Creamy blendable blush",
  },
  {
    id: "blush-lakme",
    name: "Lakme",
    category: "Blush",
    shade: "Soft Pink",
    displayOrder: 12,
    notes: "Lightweight mousse blush",
  },

  // -------------------- COMPACT --------------------
  {
    id: "compact-elf",
    name: "e.l.f",
    category: "Compact",
    shade: "Translucent",
    displayOrder: 13,
    notes: "Pressed finishing powder",
  },

  // -------------------- EYELINER --------------------
  {
    id: "eyeliner-sugar",
    name: "SUGAR",
    category: "Eyeliner",
    shade: "Black",
    displayOrder: 14,
    notes: "Matte liquid eyeliner",
  },
  {
    id: "eyeliner-lakme",
    name: "Lakme",
    category: "Eyeliner",
    shade: "Blue",
    displayOrder: 15,
    notes: "Classic liquid liner",
  },
  {
    id: "eyeliner-colorbar",
    name: "Colorbar",
    category: "Eyeliner",
    shade: "Black",
    displayOrder: 16,
    notes: "Precision brush liner",
  },
  {
    id: "eyeliner-elle18",
    name: "Elle 18",
    category: "Eyeliner",
    shade: "Black",
    displayOrder: 17,
    notes: "Affordable liquid liner",
  },
  {
    id: "eyeliner-nyx",
    name: "NYX",
    category: "Eyeliner",
    shade: "Black",
    displayOrder: 18,
    notes: "Precise felt-tip liner",
  },
  {
    id: "eyeliner-maybelline",
    name: "Maybelline",
    category: "Eyeliner",
    shade: "Pitch Black",
    displayOrder: 19,
    notes: "Easy glide felt tip liner",
  },

  // -------------------- KAJAL --------------------
  {
    id: "kajal-faces",
    name: "Faces Canada",
    category: "Kajal",
    shade: "Black",
    displayOrder: 20,
    notes: "Intense kajal for waterline",
  },
  {
    id: "kajal-colorbar",
    name: "Colorbar",
    category: "Kajal",
    shade: "Black",
    displayOrder: 21,
    notes: "Smudge-proof kajal",
  },
  {
    id: "kajal-lakme",
    name: "Lakme",
    category: "Kajal",
    shade: "Black",
    displayOrder: 22,
    notes: "Long-lasting kajal",
  },
  {
    id: "kajal-swissbeauty",
    name: "Swiss Beauty",
    category: "Kajal",
    shade: "Black",
    displayOrder: 23,
    notes: "Retractable kajal pencil",
  },

  // -------------------- MASCARA --------------------
  {
    id: "mascara-maybelline",
    name: "Maybelline",
    category: "Mascara",
    shade: "Waterproof Black",
    displayOrder: 24,
    notes: "Volume and length mascara",
  },

  // -------------------- EYE SHINE --------------------
  {
    id: "eye-shine-copper",
    name: "Pigment Play",
    category: "Eye Shine",
    shade: "Copper Rose",
    displayOrder: 25,
    notes: "Loose shimmer pigment",
  },
  {
    id: "eye-shine-green",
    name: "Pigment Play",
    category: "Eye Shine",
    shade: "Emerald Green",
    displayOrder: 26,
    notes: "Loose shimmer pigment",
  },
  {
    id: "eye-shine-missclaire",
    name: "Miss Claire",
    category: "Eye Shine",
    shade: "Silver Green",
    displayOrder: 27,
    notes: "Pressed shimmer pot",
  },

  // -------------------- EYE SHIMMER --------------------
  {
    id: "eye-shimmer-miniso",
    name: "Miniso",
    category: "Eye Shimmer",
    shade: "Pink Shimmer",
    displayOrder: 28,
    notes: "Cream-to-powder stick",
  },
  {
    id: "eye-shimmer-swissbeauty",
    name: "Swiss Beauty",
    category: "Eye Shimmer",
    shade: "Bronze",
    displayOrder: 29,
    notes: "Liquid shimmer shadow",
  },

  // -------------------- EYE SHADOW --------------------
  {
    id: "eyeshadow-huda-light",
    name: "Huda Beauty",
    category: "Eye Shadow",
    shade: "Light Nude",
    displayOrder: 30,
    notes: "4-shade nude palette",
  },
  {
    id: "eyeshadow-huda-warm",
    name: "Huda Beauty",
    category: "Eye Shadow",
    shade: "Warm Brown",
    displayOrder: 31,
    notes: "4-shade warm palette",
  },
  {
    id: "eyeshadow-nyx",
    name: "NYX",
    category: "Eye Shadow",
    shade: "Brights",
    displayOrder: 32,
    notes: "Colorful palette with brights",
  },

  // ==================== LIPS ====================

  // -------- Lip Glow --------
  {
    id: "lipglow-dior",
    name: "Dior",
    category: "Lip Glow",
    shade: "Pink",
    displayOrder: 33,
    notes: "Color reviving lip balm",
  },

  // -------- Lip Tint --------
  {
    id: "liptint-benefit",
    name: "Benefit Cosmetics",
    category: "Lip Tint",
    shade: "Rose",
    displayOrder: 34,
    notes: "Liquid lip and cheek tint",
  },

  // -------- Lip Stick --------
  {
    id: "lipstick-mac",
    name: "MAC",
    category: "Lip Stick",
    shade: "Red",
    displayOrder: 35,
    notes: "Classic matte bullet lipstick",
  },
  {
    id: "lipstick-dior",
    name: "Dior",
    category: "Lip Stick",
    shade: "Nude Pink",
    displayOrder: 36,
    notes: "Satin finish couture lipstick",
  },

  // -------- Lip Gloss --------
  {
    id: "lipgloss-dior",
    name: "Dior",
    category: "Lip Gloss",
    shade: "Pink Gloss",
    displayOrder: 37,
    notes: "Plumping high-shine gloss",
  },

  // ==================== BODY ====================

  // -------- Body Shimmer --------
  {
    id: "bodyshimmer-mcaffeine",
    name: "mCaffeine",
    category: "Body Shimmer",
    shade: "Gold",
    displayOrder: 38,
    notes: "Shimmering illuminating body oil",
  },
  {
    id: "bodyshimmer-lakme",
    name: "Lakme",
    category: "Body Shimmer",
    shade: "Bronze",
    displayOrder: 39,
    notes: "Illuminating body lotion",
  },

  // -------- Perfume --------
  {
    id: "perfume-layer",
    name: "Layer'r",
    category: "Perfume",
    shade: "Vanilla",
    displayOrder: 40,
    notes: "Light everyday body mist",
  },
  {
    id: "perfume-victoriasecret",
    name: "Victoria's Secret",
    category: "Perfume",
    shade: "Floral Fruity",
    displayOrder: 41,
    notes: "Limited edition fragrance mist",
  },
  {
    id: "perfume-bathandbodyworks",
    name: "Bath & Body Works",
    category: "Perfume",
    shade: "Floral",
    displayOrder: 42,
    notes: "Fine fragrance mist",
  },
  {
    id: "perfume-oud",
    name: "Traditional Attar",
    category: "Perfume",
    shade: "Oud",
    displayOrder: 43,
    notes: "Concentrated oil-based perfume",
  },
];
