import type { TravelLocation } from "./types";
import { travelLocations } from "./index";

export function getLocationById(id: string): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.id === id);
}

export function getHeroLocation(): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.isHeroTile);
}

export function getStandardLocations(): TravelLocation[] {
  return travelLocations.filter((loc) => !loc.isHeroTile);
}
