// ========================================
// Travel Locations — Types, Data & Helpers
// ========================================

import type { TravelLocation } from "@/types/editorial";
export type { TravelLocation };

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

export const travelLocations: TravelLocation[] = [
  kyotoLocation,
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
