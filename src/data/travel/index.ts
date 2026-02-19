// ========================================
// Travel Locations — Barrel Export
// ========================================
import type { TravelLocation } from "./types";
import { kyotoLocation } from "./kyoto";
import { lisbonLocation } from "./lisbon";
import { reykjavikLocation } from "./reykjavik";
import { marrakechLocation } from "./marrakech";
import { osakaLocation } from "./osaka";

/** Combined array of all travel locations */
export const travelLocations: TravelLocation[] = [
  kyotoLocation,
  lisbonLocation,
  reykjavikLocation,
  marrakechLocation,
  osakaLocation,
];

// Re-export types and helpers
export type { JournalPage, TravelLocation } from "./types";
export { kyotoLocation } from "./kyoto";
export { lisbonLocation } from "./lisbon";
export { reykjavikLocation } from "./reykjavik";
export { marrakechLocation } from "./marrakech";
export { osakaLocation } from "./osaka";
export { getLocationById, getHeroLocation, getStandardLocations } from "./helpers";
