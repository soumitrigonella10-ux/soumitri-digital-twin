// ========================================
// Travel Locations — Types, Data & Helpers
// ========================================

import type { TravelLocation } from "@/types/editorial";
export type { TravelLocation };

// ── Location Data ────────────────────────
// All travel locations are now managed via CMS

export const travelLocations: TravelLocation[] = [];

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
