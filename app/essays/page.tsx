"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EssayModal } from "@/components/EssayModal";
import { EditorialNav } from "@/components/EditorialNav";
import {
  EssaysHeroSection,
  CategoryFilter,
  FeaturedEssay,
  EssayCard,
  SubscribeCTA,
  EditorialFooter,
} from "@/components/essays";
import {
  getEssaysByCategory,
  getFeaturedEssays,
  type Essay,
  type EssayCategory,
} from "@/data/essays";

// ─────────────────────────────────────────────
// Main Essays Page Content
// ─────────────────────────────────────────────

function EssaysPageContent() {
  const { data: session, status } = useSession();
  const [activeCategory, setActiveCategory] = useState<EssayCategory>("All");
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  const isAuthenticated = !!session;

  const handleOpenEssay = useCallback((essay: Essay) => {
    setSelectedEssay(essay);
  }, []);

  const handleCloseEssay = useCallback(() => {
    setSelectedEssay(null);
  }, []);

  const featured = useMemo(() => getFeaturedEssays(), []);
  const filteredEssays = useMemo(
    () => getEssaysByCategory(activeCategory),
    [activeCategory]
  );

  // Remove featured from the secondary grid to avoid duplication
  const secondaryEssays = useMemo(() => {
    const featuredIds = new Set(featured.map((f) => f.id));
    return filteredEssays.filter((e) => !featuredIds.has(e.id));
  }, [filteredEssays, featured]);

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
      <EssaysHeroSection />

      <hr className="editorial-rule max-w-[1200px] mx-auto" />

      {/* Category filter */}
      <div className="pt-8">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Featured section — only show when "All" or when featured matches category */}
      {activeCategory === "All" && featured.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 mb-12">
          <div className="space-y-8">
            {featured.map((essay) => (
              <FeaturedEssay key={essay.id} essay={essay} onOpen={handleOpenEssay} />
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
                <EssayCard key={essay.id} essay={essay} index={i} onOpen={handleOpenEssay} />
              )
            )}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(activeCategory !== "All" ? filteredEssays : secondaryEssays).length === 0 &&
        !(activeCategory === "All" && featured.length > 0) && (
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
        <EssayModal essay={selectedEssay} onClose={handleCloseEssay} />
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
