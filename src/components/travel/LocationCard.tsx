import Image from "next/image";
import type { TravelLocation } from "@/data/travel";

interface LocationCardProps {
  location: TravelLocation;
  onOpen: (location: TravelLocation) => void;
}

export function LocationCard({ location, onOpen }: LocationCardProps) {
  const isHero = location.isHeroTile;
  const tileClass = isHero ? "travel-hero-tile" : "travel-standard-tile";

  return (
    <div className={tileClass} onClick={() => onOpen(location)}>
      {/* Background Image */}
      <Image
        src={location.imageUrl}
        alt={location.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="travel-card-image object-cover"
      />

      {/* Overlay Content */}
      <div className="travel-card-overlay">
        <div className="travel-card-coordinates">{location.coordinates}</div>
        <h2 className="travel-card-location">
          {location.name}
          <br />
          <span style={{ fontSize: "0.6em", fontWeight: 400, opacity: 0.8 }}>
            {location.country}
          </span>
        </h2>
        <p className="travel-card-date">{location.dateVisited}</p>
        <div className="travel-view-label">View PDF →</div>
      </div>
    </div>
  );
}
