import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { TravelLocation } from "@/data/travel";

interface LocationCardProps {
  location: TravelLocation;
  onOpen: (location: TravelLocation) => void;
  isAdmin?: boolean;
  isCms?: boolean;
  onEdit?: (location: TravelLocation) => void;
  onDelete?: (location: TravelLocation) => void;
}

export function LocationCard({ location, onOpen, isAdmin, isCms, onEdit, onDelete }: LocationCardProps) {
  const isHero = location.isHeroTile;
  const tileClass = isHero ? "travel-hero-tile" : "travel-standard-tile";

  return (
    <div className={`${tileClass} group`} onClick={() => onOpen(location)}>
      {/* Background Image */}
      <Image
        src={location.imageUrl}
        alt={location.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="travel-card-image object-cover"
      />

      {/* Admin Edit/Delete buttons */}
      {isAdmin && isCms && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(location); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm transition-all"
            title="Edit location"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(location); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-white shadow-sm transition-all"
            title="Delete location"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
