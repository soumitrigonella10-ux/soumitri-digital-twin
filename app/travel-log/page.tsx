"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { LocationCard, JournalModal, TravelHeroSection } from "@/components/travel";
import {
  travelLocations,
  type TravelLocation,
} from "@/data/travel";

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function TravelLogPageContent() {
  const { data: session, status } = useSession();
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);

  const isAuthenticated = !!session;

  const handleOpenJournal = (location: TravelLocation) => {
    setSelectedLocation(location);
    document.body.style.overflow = "hidden";
  };

  const handleCloseJournal = () => {
    setSelectedLocation(null);
    document.body.style.overflow = "";
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="travel-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="travel-bg min-h-screen">
      {/* Fixed Navigation */}
      {!isAuthenticated && <EditorialNav currentSlug="travel-log" />}

      {/* Hero Section */}
      <TravelHeroSection />

      {/* Travel Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        <div className="travel-grid">
          {travelLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onOpen={handleOpenJournal}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-sm text-gray-400">
            Soumitri Digital Twin
          </span>
          <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} &middot; Fly bro, fly.
          </p>
        </div>
      </footer>

      {/* Journal Modal */}
      {selectedLocation && (
        <JournalModal location={selectedLocation} onClose={handleCloseJournal} />
      )}
    </div>
  );

  if (isAuthenticated) {
    return <AuthenticatedLayout>{pageContent}</AuthenticatedLayout>;
  }

  return pageContent;
}

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────

export default function TravelLogPage() {
  return <TravelLogPageContent />;
}
