"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PdfBookViewer } from "@/components/PdfBookViewer";
import type { TravelLocation } from "@/data/travel/types";

interface JournalModalProps {
  location: TravelLocation;
  onClose: () => void;
}

export function JournalModal({ location, onClose }: JournalModalProps) {
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

          <div className="journal-sidebar-divider" />

          <div className="journal-sidebar-section">
            <div className="journal-sidebar-label">Notes</div>
            <p className="journal-sidebar-value" style={{ fontStyle: "italic" }}>
              &quot;{location.notes}&quot;
            </p>
          </div>
        </aside>

        {/* Viewer Area */}
        <div className="journal-viewer">
          {location.pdfUrl ? (
            <div className="w-full h-full" style={{ minHeight: "calc(100vh - 5rem)" }}>
              <PdfBookViewer
                pdfUrl={location.pdfUrl}
                title={`${location.name} Travel Journal`}
                className="rounded-lg overflow-hidden h-full"
              />
            </div>
          ) : (
          <>
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

          <p className="text-xs text-gray-400 mt-4 text-center">
            Click left/right edges of the journal to turn pages
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
