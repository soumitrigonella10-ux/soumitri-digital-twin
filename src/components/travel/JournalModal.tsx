"use client";

import { X } from "lucide-react";
import { PdfBookViewer } from "@/components/PdfBookViewer";
import type { TravelLocation } from "@/data/travel";

interface JournalModalProps {
  location: TravelLocation;
  onClose: () => void;
}

export function JournalModal({ location, onClose }: JournalModalProps) {
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

        {/* PDF Viewer */}
        <div className="journal-viewer">
          <div className="w-full h-full" style={{ minHeight: "calc(100vh - 5rem)" }}>
            <PdfBookViewer
              pdfUrl={location.pdfUrl}
              title={`${location.name} Travel Journal`}
              className="rounded-lg overflow-hidden h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
