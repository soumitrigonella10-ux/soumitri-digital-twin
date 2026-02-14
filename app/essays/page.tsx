"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Clock,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EssayModal } from "@/components/EssayModal";
import { EditorialNav } from "@/components/EditorialNav";
import {
  ESSAY_CATEGORIES,
  getEssaysByCategory,
  getFeaturedEssays,
  type Essay,
  type EssayCategory,
} from "@/data/essays";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <p className="font-editorial text-[11px] font-semibold uppercase tracking-[0.2em] text-telugu-marigold mb-4">
          Long-Form Thinking
        </p>
        <h1 className="font-serif italic text-4xl md:text-6xl lg:text-7xl font-bold text-telugu-kavi leading-[0.95] tracking-tight max-w-3xl">
          Essays &amp;&nbsp;Reflections
        </h1>
        <p className="mt-6 font-editorial text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
          On things that matter to me — taste, systems, clothing, friction,
          and the quiet architecture of a deliberately lived life.
        </p>
      </div>
    </header>
  );
}

function CategoryFilter({
  active,
  onChange,
}: {
  active: EssayCategory;
  onChange: (cat: EssayCategory) => void;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-8 mb-10">
      <div className="flex flex-wrap gap-2">
        {ESSAY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-2 rounded-full border-2 transition-all duration-200",
              active === cat
                ? "bg-telugu-kavi text-white border-telugu-kavi"
                : "bg-transparent text-gray-700 border-telugu-marigold hover:border-telugu-turmeric hover:text-telugu-kavi"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedEssay({ essay, onOpen }: { essay: Essay; onOpen: (essay: Essay) => void }) {
  return (
    <article
      className="editorial-card editorial-image-wrapper group cursor-pointer rounded-sm overflow-hidden"
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
        {/* Image — takes 3 of 5 cols */}
        <div className="md:col-span-3 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-stone-100">
          <div className="absolute inset-0 bg-stone-200 editorial-image flex items-center justify-center">
            {/* Placeholder pattern when no real image */}
            <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-stone-400/50" />
            </div>
          </div>
        </div>

        {/* Text — takes 2 of 5 cols */}
        <div className="md:col-span-2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white border border-stone-100">
          {/* Category label */}
          <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.2em] editorial-accent mb-3">
            {essay.category}
          </span>

          {/* Title */}
          <h2 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-amber-800 transition-colors duration-300">
            {essay.title}
          </h2>

          {/* Excerpt */}
          <p className="font-editorial text-sm text-stone-500 leading-relaxed mb-5 line-clamp-3">
            {essay.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-stone-400">
            <span className="font-editorial text-xs font-medium">{essay.date}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="font-editorial text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {essay.readingTime}
            </span>
          </div>

          {/* Read arrow */}
          <div className="mt-6 flex items-center gap-1 text-stone-400 group-hover:text-amber-700 transition-colors duration-300">
            <span className="font-editorial text-xs font-semibold uppercase tracking-[0.12em]">
              Read Essay
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}

function EssayCard({ essay, index, onOpen }: { essay: Essay; index: number; onOpen: (essay: Essay) => void }) {
  return (
    <article
      className="editorial-card editorial-image-wrapper editorial-fade-up group cursor-pointer"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-100 mb-4">
        <div className="absolute inset-0 bg-stone-200 editorial-image flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-stone-400/50" />
          </div>
        </div>
      </div>

      {/* Category */}
      <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.2em] editorial-accent">
        {essay.category}
      </span>

      {/* Title */}
      <h3 className="font-serif italic text-xl font-bold text-stone-900 leading-snug mt-2 mb-2 group-hover:text-amber-800 transition-colors duration-300">
        {essay.title}
      </h3>

      {/* Excerpt */}
      <p className="font-editorial text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
        {essay.excerpt}
      </p>

      {/* Tags */}
      {essay.tags && essay.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {essay.tags.map((tag) => (
            <span
              key={tag}
              className="font-editorial text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-stone-400 mt-auto pt-2">
        <span className="font-editorial text-xs font-medium">{essay.date}</span>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="font-editorial text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {essay.readingTime}
        </span>
      </div>
    </article>
  );
}

function SubscribeCTA() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20">
      <div className="text-center space-y-5">
        <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900">
          Stay in the conversation
        </h3>
        <p className="font-editorial text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          New essays published occasionally — when there&apos;s something worth
          saying. No schedule, no spam, no algorithms.
        </p>
        <button className="editorial-pill font-editorial text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 px-8 py-3 rounded-full">
          Subscribe
        </button>
      </div>
    </section>
  );
}

function EditorialFooter() {
  return (
    <footer className="max-w-[1200px] mx-auto px-6 md:px-8 py-8">
      <hr className="editorial-rule mb-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif italic text-sm text-stone-400">
          Soumitri Digital Twin
        </span>
        <p className="font-editorial text-[11px] text-stone-400 tracking-wide">
          &copy; {new Date().getFullYear()} &middot; Long-form thinking, quietly published.
        </p>
      </div>
    </footer>
  );
}

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
      <HeroSection />

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
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
