"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useCmsPage } from "@/hooks/useCmsPage";
import { EditorialNav } from "@/components/EditorialNav";
import { ContentRenderer } from "@/components/content-renderer";
import { essayToContentData } from "@/lib/content-adapters";
import {
  EssaysHeroSection,
  CategoryFilter,
  FeaturedEssay,
  EssayCard,
  SubscribeCTA,
  EditorialFooter,
} from "@/components/essays";
import { UploadEssayModal } from "@/components/essays/UploadEssayModal";
import { EditEssayModal } from "@/components/essays/EditEssayModal";
import type { ContentItem } from "@/cms/types";
import type { Essay, EssayCategory } from "@/types/editorial";

// ─────────────────────────────────────────────
// Convert a CMS ContentItem → Essay interface
// (same logic as cmsEssayToEssay in queries.ts,
//  duplicated here to avoid server-only imports)
// ─────────────────────────────────────────────
function cmsItemToEssay(item: ContentItem): Essay {
  const meta = item.metadata;
  const payload = item.payload;
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: (payload.excerpt as string) || "",
    category: (meta.category as string) || "",
    date: (meta.date as string) || "",
    readingTime: (payload.readingTime as string) || "",
    imageUrl: item.coverImage || "",
    isFeatured: item.isFeatured,
    tags: (meta.tags as string[]) || [],
    pdfUrl: (payload.pdfUrl as string) || "",
    media: (payload.media as Essay["media"]) ?? [],
    contentMeta: (payload.contentMeta as Essay["contentMeta"]) ?? [],
  };
}

// ─────────────────────────────────────────────
// Main Essays Page Content
// ─────────────────────────────────────────────

function EssaysPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: allEssays, isLoadingCms,
    fetchCmsItems: fetchCmsEssays,
    isCmsItem: isCmsEssay,
    deletingItem: deletingEssay,
    setDeletingItem: setDeletingEssay,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: "essay",
    converter: cmsItemToEssay,
    staticItems: [],
    dedupeKey: (e) => e.slug,
  });

  const [activeCategory, setActiveCategory] = useState<EssayCategory>("All");
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);

  // ── Derived data ──────────────────────────────────────────
  const featured = useMemo(
    () => allEssays.filter((e) => e.isFeatured),
    [allEssays]
  );

  const filteredEssays = useMemo(() => {
    if (activeCategory === "All") return allEssays;
    return allEssays.filter((e) => e.category === activeCategory);
  }, [allEssays, activeCategory]);

  // Remove featured from the secondary grid to avoid duplication
  const secondaryEssays = useMemo(() => {
    const featuredIds = new Set(featured.map((f) => f.id));
    return filteredEssays.filter((e) => !featuredIds.has(e.id));
  }, [filteredEssays, featured]);

  // ── Handlers ──────────────────────────────────────────────
  const handleOpenEssay = useCallback((essay: Essay) => {
    setSelectedEssay(essay);
  }, []);

  const handleCloseEssay = useCallback(() => {
    setSelectedEssay(null);
  }, []);

  const handleEdit = useCallback((essay: Essay) => {
    setEditingEssay(essay);
  }, []);

  // Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen editorial-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400" />
      </div>
    );
  }

  // Full editorial page — accessible to everyone
  const pageContent = (
    <div className="muggu-bg min-h-screen font-editorial">
      {!isAuthenticated && <EditorialNav currentSlug="essays" />}

      {/* Hero + Admin Add Button */}
      <div className="relative">
        <EssaysHeroSection />
        {isAdmin && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
            <button
              onClick={() => setShowUploadModal(true)}
              className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] px-5 py-2.5 rounded-md shadow-md transition-colors"
            >
              Add Content
            </button>
          </div>
        )}
      </div>

      <hr className="editorial-rule max-w-[1200px] mx-auto" />

      {/* Category filter */}
      <div className="pt-8">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Loading indicator for CMS data */}
      {isLoadingCms && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm font-editorial">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b border-stone-400" />
            Loading essays…
          </div>
        </div>
      )}

      {/* Featured section — only show when "All" or when featured matches category */}
      {activeCategory === "All" && featured.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 mb-12">
          <div className="space-y-8">
            {featured.map((essay) => (
              <FeaturedEssay
                key={essay.id}
                essay={essay}
                onOpen={handleOpenEssay}
                isAdmin={isAdmin}
                isCmsEssay={isCmsEssay(essay)}
                onEdit={handleEdit}
                onDelete={(e) => setDeletingEssay(e)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Divider between featured and grid */}
      {activeCategory === "All" && featured.length > 0 && secondaryEssays.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 mb-12">
          <hr className="editorial-rule" />
          <div className="flex items-center justify-between mt-6">
            <h2 className="font-serif italic text-xl font-bold text-stone-800">
              More Essays
            </h2>
            <span className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-400">
              {secondaryEssays.length} {secondaryEssays.length === 1 ? "essay" : "essays"}
            </span>
          </div>
        </div>
      )}

      {/* Secondary grid */}
      {(activeCategory !== "All" ? filteredEssays : secondaryEssays).length >
        0 && (
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            {(activeCategory !== "All" ? filteredEssays : secondaryEssays).map(
              (essay, i) => (
                <EssayCard
                  key={essay.id}
                  essay={essay}
                  index={i}
                  onOpen={handleOpenEssay}
                  isAdmin={isAdmin}
                  isCmsEssay={isCmsEssay(essay)}
                  onEdit={handleEdit}
                  onDelete={(e) => setDeletingEssay(e)}
                />
              )
            )}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(activeCategory !== "All" ? filteredEssays : secondaryEssays).length === 0 &&
        !(activeCategory === "All" && featured.length > 0) &&
        !isLoadingCms && (
          <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 text-center">
            <p className="font-editorial text-sm text-stone-400">
              No essays in this category yet.
            </p>
          </section>
        )}

      <SubscribeCTA />
      <EditorialFooter />

      {/* ── Immersive Essay Modal ── */}
      {selectedEssay && (
        <ContentRenderer
          type="pdf-single"
          data={essayToContentData(selectedEssay)}
          onClose={handleCloseEssay}
          layoutVariant="default"
        />
      )}

      {/* ── Upload Essay Modal (admin only) ── */}
      {showUploadModal && (
        <UploadEssayModal
          onClose={() => setShowUploadModal(false)}
          onPublished={() => {
            setShowUploadModal(false);
            fetchCmsEssays();
          }}
        />
      )}

      {/* ── Edit Essay Modal (admin only, CMS essays) ── */}
      {editingEssay && (
        <EditEssayModal
          essay={editingEssay}
          onClose={() => setEditingEssay(null)}
          onSaved={() => {
            setEditingEssay(null);
            fetchCmsEssays();
          }}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingEssay(null)}
          />
          <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-stone-200">
            <h3 className="font-serif italic text-lg font-bold text-stone-900 mb-2">
              Delete Essay
            </h3>
            <p className="font-editorial text-sm text-stone-600 mb-5">
              Are you sure you want to delete &ldquo;{deletingEssay.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingEssay(null)}
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

export default function EssaysPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen editorial-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400" />
        </div>
      }
    >
      <EssaysPageContent />
    </Suspense>
  );
}
