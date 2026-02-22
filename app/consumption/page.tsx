"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Play, Film, BookOpen, ChevronDown } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import {
  getItemsBySubChip,
  getItemsByType,
  getCompletedItems,
  getCompletedLanguages,
  getCompletedGenres,
  CONTENT_TYPES,
  SUB_CHIPS,
  type ContentItem,
  type ContentType,
  type ContentFilter,
  type ContentSubChip,
} from "@/data/consumption";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="pt-20 pb-8 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        {/* Main Title */}
        <div className="flex-1">
          <h1 className="consumption-hero-title">
            Content
            <span className="accent">Consumption</span>
          </h1>
        </div>

        {/* Summary */}
        <div className="consumption-hero-summary">
          <p>
            An archive of cultural intake.
          </p>
        </div>
      </div>
    </header>
  );
}

function FilterBar({
  active,
  onChange,
}: {
  active: ContentFilter;
  onChange: (filter: ContentFilter) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-6">
      <div className="flex flex-wrap gap-3">
        {CONTENT_TYPES.map((filter) => (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`consumption-filter-pill ${
              active === filter ? "active" : ""
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

function SubChipBar({
  active,
  onChange,
}: {
  active: ContentSubChip;
  onChange: (chip: ContentSubChip) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-4">
      <div className="flex flex-wrap gap-2">
        {SUB_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onChange(chip)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all border ${
              active === chip
                ? "bg-[#802626] text-white border-[#802626]"
                : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContentCardVisual({ item }: { item: ContentItem }) {
  const aspectRatioStyle = { aspectRatio: item.aspectRatio };

  // Book visual
  if (item.type === "book") {
    return (
      <div
        className="consumption-card-image content-visual-book"
        style={aspectRatioStyle}
      >
        <h3 className="content-visual-book-title">{item.title}</h3>
      </div>
    );
  }

  // Playlist visual
  if (item.type === "playlist") {
    return (
      <div
        className="consumption-card-image content-visual-playlist"
        style={aspectRatioStyle}
      >
        <div className="content-visual-playlist-icon">
          <Play className="w-6 h-6" fill="currentColor" />
        </div>
      </div>
    );
  }

  // Essay visual
  if (item.type === "essay") {
    return (
      <div
        className="consumption-card-image content-visual-essay"
        style={aspectRatioStyle}
      >
        <p className="content-visual-essay-quote">
          &ldquo;{item.description.slice(0, 60)}...&rdquo;
        </p>
        <span className="content-visual-essay-author">{item.author}</span>
      </div>
    );
  }

  // Video/Movie/Series visual
  if (item.type === "video" || item.type === "movie" || item.type === "series") {
    return (
      <div
        className="consumption-card-image content-visual-video"
        style={aspectRatioStyle}
      >
        <Film className="w-12 h-12 content-visual-video-icon" />
      </div>
    );
  }

  // Fallback
  return (
    <div
      className="consumption-card-image"
      style={{ ...aspectRatioStyle, background: "#E5E0DB" }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <BookOpen className="w-10 h-10 text-gray-400" />
      </div>
    </div>
  );
}

function EssayCard({ item }: { item: ContentItem }) {
  return (
    <article className="consumption-essay-card">
      <div className="consumption-essay-card-accent" />
      <div className="consumption-essay-card-body">
        <div className="flex items-start justify-between gap-2">
          <h2 className="consumption-essay-card-title">{item.title}</h2>
          <span className="consumption-essay-badge">{item.status}</span>
        </div>
        <p className="consumption-essay-card-author">{item.author} · {item.metadata}</p>
        <p className="consumption-essay-card-desc">{item.description}</p>
      </div>
    </article>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  if (item.type === "essay") {
    return <EssayCard item={item} />;
  }

  return (
    <article className="consumption-card">
      {/* Visual Container with Status Badge */}
      <div className="relative">
        <ContentCardVisual item={item} />
        <div className="consumption-badge">{item.status}</div>
      </div>

      {/* Typography Section */}
      <div>
        <h2 className="consumption-card-author">{item.author}</h2>
        <p className="consumption-card-metadata">{item.metadata}</p>
        <div className="consumption-card-separator" />
        <p className="consumption-card-description">{item.description}</p>
      </div>
    </article>
  );
}

function SideDecoration() {
  return <div className="consumption-deco">DIGITAL TWIN // 2026</div>;
}

// ─────────────────────────────────────────────
// Completed — compact filterable list view
// ─────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-3.5 h-3.5" />,
  essay: <BookOpen className="w-3.5 h-3.5" />,
  movie: <Film className="w-3.5 h-3.5" />,
  series: <Film className="w-3.5 h-3.5" />,
  video: <Play className="w-3.5 h-3.5" />,
  playlist: <Play className="w-3.5 h-3.5" />,
};

function CompletedListView({ activeFilter }: { activeFilter: ContentFilter }) {
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [subTypeFilter, setSubTypeFilter] = useState<ContentType | null>(null);

  const filterType = activeFilter === "Playlists" ? undefined : activeFilter;

  const languages = useMemo(() => getCompletedLanguages(filterType), [filterType]);
  const genres = useMemo(() => getCompletedGenres(filterType), [filterType]);
  const items = useMemo(
    () => getCompletedItems(
      filterType,
      langFilter ?? undefined,
      genreFilter ?? undefined,
      subTypeFilter ?? undefined
    ),
    [filterType, langFilter, genreFilter, subTypeFilter]
  );

  // Determine which dropdowns to show based on active tab
  const showTypeDropdown = activeFilter === "Books & Essays" || activeFilter === "Movies & Series";
  const showLangDropdown = activeFilter !== "Books & Essays"; // hide lang for Books & Essays

  // Type dropdown options per tab
  const typeOptions: { value: ContentType; label: string }[] = useMemo(() => {
    if (activeFilter === "Books & Essays") return [
      { value: "book", label: "Books" },
      { value: "essay", label: "Essays" },
    ];
    if (activeFilter === "Movies & Series") return [
      { value: "movie", label: "Movies" },
      { value: "series", label: "Series" },
    ];
    return [];
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
      {/* Filter bar: dropdowns right-aligned */}
      <div className="flex items-center justify-end gap-3 mb-5">
        {/* Type dropdown (Books & Essays / Movies & Series) */}
        {showTypeDropdown && (
          <div className="relative">
            <select
              value={subTypeFilter ?? ""}
              onChange={(e) => setSubTypeFilter((e.target.value || null) as ContentType | null)}
              className="completed-dropdown"
            >
              <option value="">All Types</option>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="completed-dropdown-icon" />
          </div>
        )}

        {/* Language dropdown (hidden for Books & Essays) */}
        {showLangDropdown && (
          <div className="relative">
            <select
              value={langFilter ?? ""}
              onChange={(e) => setLangFilter(e.target.value || null)}
              className="completed-dropdown"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="completed-dropdown-icon" />
          </div>
        )}

        {/* Genre dropdown */}
        <div className="relative">
          <select
            value={genreFilter ?? ""}
            onChange={(e) => setGenreFilter(e.target.value || null)}
            className="completed-dropdown"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <ChevronDown className="completed-dropdown-icon" />
        </div>
      </div>

      {/* Compact list */}
      {items.length > 0 ? (
        <ul className="completed-list">
          {items.map((item) => (
            <li key={item.id} className="completed-row">
              {/* Tiny type icon tile */}
              <span className="completed-tile">
                {TYPE_ICON[item.type] ?? <BookOpen className="w-3.5 h-3.5" />}
              </span>

              {/* Title + author */}
              <div className="completed-info">
                <span className="completed-title">{item.title}</span>
                <span className="completed-author">{item.author}</span>
              </div>

              {/* One-liner comment */}
              {item.comment && (
                <span className="completed-comment">{item.comment}</span>
              )}

              {/* Right-side badges */}
              <div className="completed-badges">
                {item.genre && (
                  <span className="completed-genre-badge">{item.genre}</span>
                )}
                {item.language && (
                  <span className="completed-lang-badge">{item.language}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-lg text-gray-500 italic">
            Nothing completed here yet.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function ConsumptionPageContent() {
  const { data: session, status } = useSession();
  const [activeFilter, setActiveFilter] = useState<ContentFilter>("Books & Essays");
  const [activeSubChip, setActiveSubChip] = useState<ContentSubChip>("Looking Forward");

  const isAuthenticated = !!session;

  const filteredItems = useMemo(
    () => activeFilter === "Playlists"
      ? getItemsByType(activeFilter)
      : getItemsBySubChip(activeFilter, activeSubChip),
    [activeFilter, activeSubChip]
  );

  // Loading state
  if (status === "loading") {
    return (
      <div className="consumption-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="consumption-bg min-h-screen">
      {/* Fixed Navigation */}
      {!isAuthenticated && <EditorialNav currentSlug="content-consumption" />}
      
      {/* Side Decoration */}
      <SideDecoration />

      {/* Hero Section */}
      <HeroSection />

      {/* Filter Bar */}
      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {/* Sub-Chip Bar — hidden for Playlists */}
      {activeFilter !== "Playlists" && (
        <SubChipBar active={activeSubChip} onChange={setActiveSubChip} />
      )}

      {/* Content area */}
      {activeSubChip === "Completed" && activeFilter !== "Playlists" ? (
        <CompletedListView activeFilter={activeFilter} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
          {filteredItems.length > 0 ? (
            <div className="consumption-grid">
              {filteredItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-serif text-lg text-gray-500 italic">
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-sm text-gray-400">
            Soumitri Digital Twin
          </span>
          <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} &middot;  An archive of cultural intake.
          </p>
        </div>
      </footer>
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

export default function ConsumptionPage() {
  return <ConsumptionPageContent />;
}
