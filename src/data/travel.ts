// ========================================
// Travel Locations — Types, Data & Helpers
// ========================================

// ── Types ────────────────────────────────

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  coordinates: string;
  dateVisited: string;
  description: string;
  imageUrl: string;
  isHeroTile?: boolean;
  climate: string;
  duration: string;
  inventory: string[];
  notes: string;
  /** Path to PDF journal in public/pdfs/travel/ */
  pdfUrl: string;
}

// ── Location Data ────────────────────────

export const kyotoLocation: TravelLocation = {
  id: "kyoto-2025",
  name: "Kyoto",
  country: "Japan",
  coordinates: "35.0116° N, 135.7681° E",
  dateVisited: "November 2025",
  description: "Ancient temples, minimalist aesthetics, and the quiet art of tea ceremony. A city where tradition and modernity exist in deliberate tension.",
  imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=80",
  isHeroTile: true,
  climate: "Mild autumn, 12-18°C",
  duration: "9 days",
  inventory: [
    "Leica M10 with 35mm Summicron",
    "Moleskine watercolor journal",
    "Minimalist wardrobe (neutrals only)",
    "Portable tea set",
  ],
  notes: "The concept of 'ma' (間) — negative space as active element. Everything here is an argument for restraint.",
  pdfUrl: "/pdfs/travel/kyoto-2025.pdf",
};

export const lisbonLocation: TravelLocation = {
  id: "lisbon-2024",
  name: "Lisbon",
  country: "Portugal",
  coordinates: "38.7223° N, 9.1393° W",
  dateVisited: "March 2024",
  description: "Hills, azulejos, and fado. A city of beautiful decay where every surface tells a layered story of empire, earthquake, and reinvention.",
  imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
  climate: "Spring warmth, 15-22°C",
  duration: "6 days",
  inventory: [
    "35mm film camera (Kodak Portra 400)",
    "Portuguese phrasebook",
    "Linen shirts and walking shoes",
    "Portable wine opener",
  ],
  notes: "The light here is different. Golden, angled, slightly melancholic. Every photographer mentions it.",
  pdfUrl: "/pdfs/travel/lisbon-2024.pdf",
};

export const reykjavikLocation: TravelLocation = {
  id: "reykjavik-2023",
  name: "Reykjavík",
  country: "Iceland",
  coordinates: "64.1466° N, 21.9426° W",
  dateVisited: "September 2023",
  description: "Minimalism meets nature. A city on the edge of the world where the light never quite settles and the landscape feels alive.",
  imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",
  climate: "Cool and unpredictable, 8-12°C",
  duration: "5 days",
  inventory: [
    "Waterproof camera (GoPro)",
    "Merino wool layers",
    "Headlamp for glacier walks",
    "Instant coffee sachets",
  ],
  notes: "The silence here is profound. Even in the city, there's an absence of noise that's almost tangible.",
  pdfUrl: "/pdfs/travel/reykjavik-2023.pdf",
};

export const marrakechLocation: TravelLocation = {
  id: "marrakech-2022",
  name: "Marrakech",
  country: "Morocco",
  coordinates: "31.6295° N, 7.9811° W",
  dateVisited: "April 2022",
  description: "Sensory overload in the best way. Souks, riads, tagines, and the call to prayer echoing across rooftops at sunset.",
  imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80",
  climate: "Hot and dry, 25-32°C",
  duration: "7 days",
  inventory: [
    "Linen pants and cotton scarves",
    "Electrolyte tablets",
    "Moroccan dirham cash",
    "Sunscreen (SPF 50)",
  ],
  notes: "Get lost in the medina. Seriously. It's the only way to find anything real.",
  pdfUrl: "/pdfs/travel/marrakech-2022.pdf",
};

export const osakaLocation: TravelLocation = {
  id: "osaka-2021",
  name: "Osaka",
  country: "Japan",
  coordinates: "34.6937° N, 135.5023° E",
  dateVisited: "October 2021",
  description: "Kyoto's rowdy sibling. Street food, neon-lit Dotonbori, and a local energy that feels more working-class, less precious.",
  imageUrl: "https://images.unsplash.com/photo-1589452271712-64fa89a25d3d?w=1200&q=80",
  climate: "Warm autumn, 18-24°C",
  duration: "4 days",
  inventory: [
    "Appetite (bring it)",
    "Comfortable walking shoes",
    "Portable phone charger",
    "Empty suitcase (for snacks)",
  ],
  notes: "Osaka's motto: 'Kuidaore' — eat until you drop. I took this literally.",
  pdfUrl: "/pdfs/travel/osaka-2021.pdf",
};

// ── Combined Array ───────────────────────

export const travelLocations: TravelLocation[] = [
  kyotoLocation,
  lisbonLocation,
  reykjavikLocation,
  marrakechLocation,
  osakaLocation,
];

// ── Helpers ──────────────────────────────

export function getLocationById(id: string): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.id === id);
}

export function getHeroLocation(): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.isHeroTile);
}

export function getStandardLocations(): TravelLocation[] {
  return travelLocations.filter((loc) => !loc.isHeroTile);
}
