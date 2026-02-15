"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import {
  travelLocations,
  type TravelLocation,
} from "@/data/travelLocations";

// ─────────────────────────────────────────────
// Location Card Component
// ─────────────────────────────────────────────

interface LocationCardProps {
  location: TravelLocation;
  onOpen: (location: TravelLocation) => void;
}

function LocationCard({ location, onOpen }: LocationCardProps) {
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
        <div className="travel-view-label">View Journal →</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Journal Modal Component
// ─────────────────────────────────────────────

interface JournalModalProps {
  location: TravelLocation;
  onClose: () => void;
}

function JournalModal({ location, onClose }: JournalModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward" | null>(null);

  const currentPage = location.journalPages[currentPageIndex];
  const totalPages = location.journalPages.length;

  const goToNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setFlipDirection("forward");
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setFlipDirection(null);
      }, 400);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setFlipDirection("backward");
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setFlipDirection(null);
      }, 400);
    }
  };

  // Handle click zones (left 20% / right 20% of book)
  const handleBookClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.2) {
      goToPrevPage();
    } else if (clickX > width * 0.8) {
      goToNextPage();
    }
  };

  return (
    <div className="journal-modal-overlay">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="journal-close-btn"
        aria-label="Close journal"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="journal-modal-container">
        {/* Left Sidebar */}
        <aside className="journal-sidebar">
          <div className="journal-sidebar-section">
            <h1
              className="font-serif text-4xl font-bold mb-2"
              style={{ color: "#2D2424" }}
            >
              {location.name}
            </h1>
            <p
              className="font-sans text-sm"
              style={{ color: "#802626", letterSpacing: "0.1em" }}
            >
              {location.country}
            </p>
          </div>

          <div className="journal-sidebar-divider" />

          <div className="journal-sidebar-section">
            <div className="journal-sidebar-label">Climate</div>
            <div className="journal-sidebar-value">{location.climate}</div>
          </div>

          <div className="journal-sidebar-section">
            <div className="journal-sidebar-label">Duration</div>
            <div className="journal-sidebar-value">{location.duration}</div>
          </div>

          <div className="journal-sidebar-section">
            <div className="journal-sidebar-label">Inventory</div>
            <ul className="journal-sidebar-list">
              {location.inventory.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="journal-sidebar-divider" />

          <div className="journal-sidebar-section">
            <div className="journal-sidebar-label">Notes</div>
            <p className="journal-sidebar-value" style={{ fontStyle: "italic" }}>
              "{location.notes}"
            </p>
          </div>
        </aside>

        {/* Viewer Area */}
        <div className="journal-viewer">
          {/* Journal Book */}
          <div
            className="journal-book-container"
            onClick={handleBookClick}
            style={{ cursor: "pointer" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`journal-page ${
                  flipDirection === "forward"
                    ? "flipping-forward"
                    : flipDirection === "backward"
                    ? "flipping-backward"
                    : ""
                }`}
              >
                <div className="journal-page-number">
                  PAGE {String(currentPage?.pageNumber).padStart(2, "0")}
                </div>

                {currentPage?.title && (
                  <h2 className="journal-page-title">{currentPage.title}</h2>
                )}

                <div className="journal-page-content">{currentPage?.content}</div>

                {currentPage?.images && currentPage.images.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 italic">
                      [ Images: {currentPage.images.join(", ")} ]
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="journal-controls">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className="journal-nav-btn"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="journal-page-counter">
              {String(currentPageIndex + 1).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === totalPages - 1}
              className="journal-nav-btn"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Hint Text */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            Click left/right edges of the journal to turn pages
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="pt-32 pb-16 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-4"
          style={{ color: "#802626" }}
        >
          Field Journals
        </p>
        <h1
          className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
          style={{ color: "#2D2424" }}
        >
          Travel Log
        </h1>
        <p
          className="font-sans text-lg leading-relaxed"
          style={{ color: "#2D2424", opacity: 0.8 }}
        >
          Places I&apos;ve been, places I&apos;m going. This is not a bucket list —
          it&apos;s an archive of attention. Each location comes with a field journal:
          unfiltered notes, sketches, and observations written on-site.
        </p>
      </div>
    </header>
  );
}

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
      <HeroSection />

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
            &copy; {new Date().getFullYear()} &middot; Traveling with intention
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
