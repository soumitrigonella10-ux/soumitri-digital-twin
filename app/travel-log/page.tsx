"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { LocationCard, TravelHeroSection, AddTravelModal, EditTravelModal } from "@/components/travel";
import { ContentRenderer } from "@/components/content-renderer";
import { locationToContentData } from "@/lib/content-adapters";
import { getContentByType, deleteContent } from "@/cms/actions";
import type { ContentItem } from "@/cms/types";
import {
  travelLocations as staticLocations,
  type TravelLocation,
} from "@/data/travel";

// ─────────────────────────────────────────────
// Convert a CMS ContentItem → TravelLocation
// ─────────────────────────────────────────────
function cmsItemToLocation(item: ContentItem): TravelLocation {
  const meta = item.metadata;
  const payload = item.payload;

  return {
    id: item.id,
    name: item.title,
    country: (meta.country as string) || "",
    coordinates: (meta.coordinates as string) || "",
    dateVisited: (meta.dateVisited as string) || "",
    climate: (meta.climate as string) || "",
    duration: (meta.duration as string) || "",
    description: (payload.description as string) || "",
    notes: (payload.notes as string) || "",
    imageUrl: (payload.imageUrl as string) || item.coverImage || "",
    pdfUrl: (payload.pdfUrl as string) || "",
    isHeroTile: (payload.isHeroTile as boolean) || false,
    inventory: typeof payload.inventory === "string"
      ? (payload.inventory as string).split("\n").filter(Boolean)
      : [],
  };
}

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function TravelLogPageContent() {
  const { data: session, status } = useSession();
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TravelLocation | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<TravelLocation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // CMS data
  const [cmsLocations, setCmsLocations] = useState<TravelLocation[]>([]);
  const [isLoadingCms, setIsLoadingCms] = useState(true);

  const isAuthenticated = !!session;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  // ── Fetch CMS travel locations ────────────────────────────
  const fetchCmsLocations = useCallback(async () => {
    try {
      const items = await getContentByType("travel", { visibility: "published" });
      setCmsLocations(items.map(cmsItemToLocation));
    } catch (err) {
      console.error("Failed to load CMS travel locations:", err);
    } finally {
      setIsLoadingCms(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsLocations();
  }, [fetchCmsLocations]);

  // ── Merge static + CMS locations (CMS wins on name conflict) ─
  const allLocations = useMemo(() => {
    const cmsNames = new Set(cmsLocations.map((l) => l.name.toLowerCase()));
    const dedupedStatic = staticLocations.filter(
      (l) => !cmsNames.has(l.name.toLowerCase())
    );
    return [...cmsLocations, ...dedupedStatic];
  }, [cmsLocations]);

  // Check if a location came from the CMS (editable / deletable)
  const isCmsLocation = useCallback(
    (location: TravelLocation) => location.id.startsWith("ci_"),
    []
  );

  // ── Handlers ──────────────────────────────────────────────
  const handleOpenJournal = (location: TravelLocation) => {
    setSelectedLocation(location);
  };

  const handleCloseJournal = () => {
    setSelectedLocation(null);
  };

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingLocation) return;
    setIsDeleting(true);
    try {
      const result = await deleteContent(deletingLocation.id);
      if (result.success) {
        setDeletingLocation(null);
        fetchCmsLocations();
      } else {
        alert(result.error || "Failed to delete location");
      }
    } catch {
      alert("Failed to delete location");
    } finally {
      setIsDeleting(false);
    }
  }, [deletingLocation, fetchCmsLocations]);

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

      {/* Hero Section with Add Button */}
      <div className="relative">
        <TravelHeroSection />
        {isAdmin && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
            <button
              onClick={() => setShowAddModal(true)}
              className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] px-5 py-2.5 rounded-md shadow-md transition-colors"
            >
              Add Content
            </button>
          </div>
        )}
      </div>

      {/* Loading indicator for CMS data */}
      {isLoadingCms && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm font-editorial">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b border-stone-400" />
            Loading locations…
          </div>
        </div>
      )}

      {/* Travel Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        {allLocations.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-300 mb-2">No locations yet</p>
            <p className="text-sm text-gray-400">
              {isAdmin ? 'Add your first travel location to get started.' : 'Check back soon for travel stories.'}
            </p>
          </div>
        ) : (
          <div className="travel-grid">
            {allLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onOpen={handleOpenJournal}
                isAdmin={isAdmin}
                isCms={isCmsLocation(location)}
                onEdit={(loc) => setEditingLocation(loc)}
                onDelete={(loc) => setDeletingLocation(loc)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-sm text-gray-400">
            Soumitri Digital Twin
          </span>
          <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} &middot; Photo or it didn't happen.
          </p>
        </div>
      </footer>

      {/* Journal Modal */}
      {selectedLocation && (
        <ContentRenderer
          type="pdf-flipbook"
          data={locationToContentData(selectedLocation)}
          onClose={handleCloseJournal}
          layoutVariant="default"
        />
      )}

      {/* ── Add Travel Modal (admin only) ── */}
      {showAddModal && (
        <AddTravelModal
          onClose={() => setShowAddModal(false)}
          onPublished={() => {
            setShowAddModal(false);
            fetchCmsLocations();
          }}
        />
      )}

      {/* ── Edit Travel Modal (admin only, CMS locations) ── */}
      {editingLocation && (
        <EditTravelModal
          location={editingLocation}
          onClose={() => setEditingLocation(null)}
          onSaved={() => {
            setEditingLocation(null);
            fetchCmsLocations();
          }}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingLocation(null)}
          />
          <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-stone-200">
            <h3 className="font-serif italic text-lg font-bold text-stone-900 mb-2">
              Delete Location
            </h3>
            <p className="font-editorial text-sm text-stone-600 mb-5">
              Are you sure you want to delete &ldquo;{deletingLocation.name}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingLocation(null)}
                disabled={isDeleting}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-red-600 hover:bg-red-700 disabled:bg-stone-300 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
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
