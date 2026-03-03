"use client";

import { useState, useMemo } from "react";
import { Play, Film, BookOpen, ChevronDown, Star, Search, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { AddConsumptionModal } from "@/components/consumption/AddConsumptionModal";
import { EditConsumptionModal } from "@/components/consumption/EditConsumptionModal";
import { useCmsPage } from "@/hooks/useCmsPage";
import type { ContentItem as CmsContentItem } from "@/cms/types";
import {
  CONTENT_TYPES,
  SUB_CHIPS,
  type ContentItem,
  type ContentFilter,
  type ContentSubChip,
} from "@/data/consumption";

// Convert CMS item → editorial ContentItem
function cmsToContentItem(item: CmsContentItem): ContentItem {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  const result: ContentItem = {
    id: item.id,
    type: (meta.contentType as ContentItem["type"]) || "book",
    title: item.title,
    author: (payload.author as string) || "",
    description: (payload.description as string) || "",
    metadata: (meta.metadataText as string) || "",
    status: (meta.status as ContentItem["status"]) || "QUEUED",
    aspectRatio: (payload.aspectRatio as ContentItem["aspectRatio"]) || "3/4",
  };
  const imageUrl = (payload.imageUrl as string) || (item.coverImage as string);
  if (imageUrl) result.imageUrl = imageUrl;
  const language = meta.language as string;
  if (language) result.language = language;
  const genre = meta.genre as string;
  if (genre) result.genre = genre;
  const comment = payload.comment as string;
  if (comment) result.comment = comment;
  const watchUrl = payload.watchUrl as string;
  if (watchUrl) result.watchUrl = watchUrl;
  if (meta.topPick === true) result.topPick = true;
  return result;
}

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
            Media
            <span className="accent">Diet</span>
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
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-0">
      <div className="flex items-center justify-between border-b border-gray-200">
        {/* Tabs */}
        <div className="flex gap-8">
          {SUB_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onChange(chip)}
              className={`pb-3 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all relative ${
                active === chip
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {chip}
              {active === chip && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
        {/* Decorative icons */}
        <div className="flex items-center gap-3 pb-3 text-gray-300">
          <Search className="w-3.5 h-3.5" />
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
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

function ContentCard({ item, isAdmin, isCms, onEdit, onDelete }: {
  item: ContentItem;
  isAdmin?: boolean;
  isCms?: boolean;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (item: ContentItem) => void;
}) {
  if (item.type === "essay") {
    return (
      <div className="relative group">
        <EssayCard item={item} />
        {isAdmin && isCms && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={() => onEdit?.(item)} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
            <button onClick={() => onDelete?.(item)} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <article className="consumption-card relative group">
      {/* Visual Container with Status Badge */}
      <div className="relative">
        <ContentCardVisual item={item} />
        <div className="consumption-badge">{item.status}</div>
      </div>

      {/* Admin hover controls */}
      {isAdmin && isCms && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <button onClick={() => onEdit?.(item)} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
          <button onClick={() => onDelete?.(item)} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
        </div>
      )}

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
// Library — filterable list (all non-queued items)
// ─────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-4 h-4" />,
  essay: <BookOpen className="w-4 h-4" />,
  movie: <Film className="w-4 h-4" />,
  series: <Film className="w-4 h-4" />,
  video: <Play className="w-4 h-4" />,
  playlist: <Play className="w-4 h-4" />,
};

const STATUS_LABEL: Partial<Record<string, string>> = {
  "CURRENTLY READING": "Reading",
  "CURRENTLY WATCHING": "Watching",
  "LISTENING": "Listening",
};

function LibraryListView({ activeFilter, cmsItems }: { activeFilter: ContentFilter; cmsItems: ContentItem[] }) {
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const typeMap: Record<ContentFilter, string[]> = {
    Books: ["book"], Essays: ["essay"], Movies: ["movie"], Series: ["series"], Videos: ["video"], Playlists: ["playlist"],
  };
  const libraryStatuses: ContentItem["status"][] = ["CURRENTLY READING", "CURRENTLY WATCHING", "LISTENING", "COMPLETED"];

  const targets = typeMap[activeFilter] || [];
  const libraryItems = useMemo(
    () => cmsItems.filter(i => targets.includes(i.type) && libraryStatuses.includes(i.status)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cmsItems, activeFilter]
  );

  const languages = useMemo(() => {
    const langs = new Set(libraryItems.filter(i => i.language).map(i => i.language!));
    return Array.from(langs).sort();
  }, [libraryItems]);

  const genres = useMemo(() => {
    const gs = new Set(libraryItems.filter(i => i.genre).map(i => i.genre!));
    return Array.from(gs).sort();
  }, [libraryItems]);

  const items = useMemo(() => {
    let filtered = libraryItems;
    if (langFilter) filtered = filtered.filter(i => i.language === langFilter);
    if (genreFilter) filtered = filtered.filter(i => i.genre === genreFilter);
    return filtered;
  }, [libraryItems, langFilter, genreFilter]);

  const showLangDropdown = activeFilter !== "Books" && activeFilter !== "Essays";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20 pt-6">
      {/* Filter controls */}
      <div className="flex items-center justify-end gap-3 mb-8">
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

      {items.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => {
            const inProgress = STATUS_LABEL[item.status];
            return (
              <li key={item.id} className="flex items-start gap-5 py-5 group">
                {/* Icon tile */}
                <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  item.topPick
                    ? "bg-[#802626] text-white"
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                }`}>
                  {item.topPick
                    ? <Star className="w-3.5 h-3.5" fill="currentColor" />
                    : (TYPE_ICON[item.type] ?? <BookOpen className="w-4 h-4" />)
                  }
                </div>

                {/* Title + author */}
                <div className="flex-shrink-0 w-52">
                  <p className="font-serif text-base text-gray-900 leading-snug">{item.title}</p>
                  <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase mt-0.5">{item.author}</p>
                </div>

                {/* Separator */}
                <div className="self-stretch w-px bg-gray-200 flex-shrink-0 mx-1" />

                {/* Quote */}
                <div className="flex-1 min-w-0">
                  {item.comment ? (
                    <p className="font-serif italic text-sm text-gray-500 leading-relaxed">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  ) : (
                    <p className="font-serif italic text-sm text-gray-300 leading-relaxed">
                      {item.description.slice(0, 90)}&hellip;
                    </p>
                  )}
                </div>

                {/* Right badges */}
                <div className="flex flex-shrink-0 items-center gap-2 flex-wrap justify-end">
                  {item.topPick && (
                    <span className="bg-[#802626] text-white text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-sm">
                      Top Pick
                    </span>
                  )}
                  {inProgress && (
                    <span className="border border-[#802626] text-[#802626] text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm">
                      {inProgress}
                    </span>
                  )}
                  {item.genre && (
                    <span className="border border-gray-300 text-gray-500 text-[9px] font-medium tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm">
                      {item.genre}
                    </span>
                  )}
                  {item.language && (
                    <span className="border border-gray-200 text-gray-400 text-[9px] font-medium tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm">
                      {item.language}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-lg text-gray-500 italic">Nothing here yet.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function ConsumptionPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    cmsItems, fetchCmsItems, isCmsItem,
    deletingItem, setDeletingItem,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: "consumption",
    converter: cmsToContentItem,
    staticItems: [],
  });

  const [activeFilter, setActiveFilter] = useState<ContentFilter>("Books");
  const [activeSubChip, setActiveSubChip] = useState<ContentSubChip>("Looking Forward");

  // CMS CRUD state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Filter CMS items by active content type
  const allItems = useMemo(() => {
    const typeMap: Record<ContentFilter, string[]> = {
      Books: ["book"], Essays: ["essay"], Movies: ["movie"], Series: ["series"], Videos: ["video"], Playlists: ["playlist"],
    };
    const targets = typeMap[activeFilter] || [];
    return cmsItems.filter(i => targets.includes(i.type));
  }, [cmsItems, activeFilter]);

  const filteredItems = useMemo(
    () => {
      if (activeFilter === "Playlists") return allItems;
      const libraryStatuses: ContentItem["status"][] = ["CURRENTLY READING", "CURRENTLY WATCHING", "LISTENING", "COMPLETED"];
      const subChipStatuses: Record<ContentSubChip, ContentItem["status"][]> = {
        "Looking Forward": ["QUEUED"],
        "Library": libraryStatuses,
      };
      const allowed = subChipStatuses[activeSubChip];
      return allItems.filter(i => allowed.includes(i.status));
    },
    [activeFilter, activeSubChip, allItems]
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
      <div className="relative">
        <HeroSection />
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

      {/* Filter Bar */}
      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {/* Sub-Chip Bar — hidden for Playlists */}
      {activeFilter !== "Playlists" && (
        <SubChipBar active={activeSubChip} onChange={setActiveSubChip} />
      )}

      {/* Content area */}
      {activeSubChip === "Library" && activeFilter !== "Playlists" ? (
        <LibraryListView activeFilter={activeFilter} cmsItems={cmsItems} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
          {filteredItems.length > 0 ? (
            <div className="consumption-grid">
              {filteredItems.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  isAdmin={isAdmin}
                  isCms={isCmsItem(item)}
                  onEdit={setEditingItem}
                  onDelete={setDeletingItem}
                />
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



      {/* Add Modal */}
      {showAddModal && (
        <AddConsumptionModal
          onClose={() => setShowAddModal(false)}
          onPublished={() => { setShowAddModal(false); fetchCmsItems(); }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditConsumptionModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); fetchCmsItems(); }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-lg text-gray-900 mb-2">Delete &ldquo;{deletingItem.title}&rdquo;?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
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

export default function ConsumptionPage() {
  return <ConsumptionPageContent />;
}
