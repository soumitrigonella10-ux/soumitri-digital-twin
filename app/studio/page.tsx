'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, FileText, BookOpen } from 'lucide-react';
import Image from 'next/image';
import type { Artifact, StudioCategory } from '@/data/artifacts';
import { artifacts as staticArtifacts } from '@/data/artifacts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { UploadArtifactModal } from '@/components/artifacts/UploadArtifactModal';
import { EditArtifactModal } from '@/components/artifacts/EditArtifactModal';
import { UploadJournalModal } from '@/components/artifacts/UploadJournalModal';
import { ContentRenderer } from '@/components/content-renderer';
import { useCmsPage } from '@/hooks/useCmsPage';
import type { ContentItem } from '@/cms/types';
import type { ContentData } from '@/components/content-renderer/types';

// ─────────────────────────────────────────────
// Convert a CMS ContentItem → Artifact interface
// ─────────────────────────────────────────────
function cmsItemToArtifact(item: ContentItem): Artifact {
  const meta = item.metadata;
  const payload = item.payload;
  const paperNoteText = (payload.paperNoteText as string) || "";
  const paperNotePosition = (payload.paperNotePosition as string) || "";

  const artifact: Artifact = {
    id: item.id,
    title: item.title,
    medium: (meta.medium as string) || "",
    frameType: (meta.frameType as Artifact["frameType"]) || "standard",
    offsetType: "none",
    borderStyle: (meta.borderStyle as Artifact["borderStyle"]) || "shadow",
  };

  // Only set optional properties when they have values
  // (exactOptionalPropertyTypes disallows explicit undefined)
  const desc = (payload.description as string) || "";
  if (desc) artifact.description = desc;

  const bg = (payload.backgroundColor as string) || "";
  if (bg) artifact.backgroundColor = bg;

  const img = (payload.imagePath as string) || "";
  if (img) artifact.imagePath = img;

  if (payload.hasWashiTape) artifact.hasWashiTape = true;

  const cat = (meta.category as string) || "";
  if (cat) artifact.category = cat as StudioCategory;

  if (paperNoteText && paperNotePosition) {
    artifact.paperNote = {
      text: paperNoteText,
      position: paperNotePosition as "top-left" | "top-right" | "bottom-left" | "bottom-right",
    };
  }

  return artifact;
}

const STUDIO_TABS: { id: StudioCategory; label: string }[] = [
  { id: 'paintings-sketches', label: 'Paintings & Sketches' },
  { id: 'journals', label: 'Journals' },
  { id: 'craft', label: 'Craft' },
  { id: 'digital', label: 'Digital' },
];

// ─────────────────────────────────────────────
// Journal item shape (from CMS)
// ─────────────────────────────────────────────
interface JournalItem {
  id: string;
  title: string;
  date: string;
  description: string;
  pdfUrl: string;
  coverUrl: string;
}

function cmsItemToJournal(item: ContentItem): JournalItem {
  const meta = item.metadata;
  const payload = item.payload;
  return {
    id: item.id,
    title: item.title,
    date: (meta.date as string) || "",
    description: (payload.description as string) || "",
    pdfUrl: (payload.pdfUrl as string) || "",
    coverUrl: (payload.coverUrl as string) || item.coverImage || "",
  };
}

function journalToContentData(journal: JournalItem): ContentData {
  return {
    id: journal.id,
    title: journal.title,
    subtitle: journal.date,
    pdfUrl: journal.pdfUrl,
    metadata: [
      { label: "Date", value: journal.date },
    ],
    body: journal.description,
    footerLabel: "Studio Journal",
  };
}

// ─────────────────────────────────────────────
// Main Artifacts Page Content
// ─────────────────────────────────────────────

function ArtifactsPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: allArtifacts, isLoadingCms,
    fetchCmsItems: fetchCmsArtifacts,
    isCmsItem: isCmsArtifact,
    deletingItem: deletingArtifact,
    setDeletingItem: setDeletingArtifact,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: "artifact",
    converter: cmsItemToArtifact,
    staticItems: staticArtifacts,
    dedupeKey: (a) => a.title.toLowerCase(),
  });

  // Journal CMS data
  const {
    items: allJournals, isLoadingCms: isLoadingJournals,
    fetchCmsItems: fetchJournals,
    isCmsItem: isCmsJournal,
    deletingItem: deletingJournal,
    setDeletingItem: setDeletingJournal,
    isDeleting: isDeletingJournal,
    handleDeleteConfirm: handleDeleteJournalConfirm,
  } = useCmsPage({
    contentType: "journal",
    converter: cmsItemToJournal,
    staticItems: [],
  });

  const [activeTab, setActiveTab] = useState<StudioCategory>('paintings-sketches');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [showJournalUpload, setShowJournalUpload] = useState(false);
  const [viewingJournal, setViewingJournal] = useState<JournalItem | null>(null);

  const filteredArtifacts = useMemo(() => {
    return allArtifacts.filter((a) => a.category === activeTab);
  }, [allArtifacts, activeTab]);

  // ── Handlers ──────────────────────────────────────────────
  const handleEdit = useCallback((artifact: Artifact) => {
    setEditingArtifact(artifact);
  }, []);

  // Loading
  if (status === "loading") {
    return (
      <div className="artifacts-page min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="artifacts-page">
      {!isAuthenticated && <EditorialNav currentSlug="art" />}
      
      {/* Hero Section + Admin Add Button */}
      <section className="artifacts-hero relative">
        <div className="hero-content">
          <h1 className="hero-title">Studio</h1>
          <p className="hero-subtitle">A collection of creative experiments and visual studies</p>
          <div className="hero-metadata">
            <span>
              {activeTab === 'journals'
                ? `${allJournals.length} Journals`
                : `${filteredArtifacts.length} Pieces`
              }
            </span>
          </div>
        </div>
        {isAdmin && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
            <button
              onClick={() => activeTab === 'journals' ? setShowJournalUpload(true) : setShowUploadModal(true)}
              className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] px-5 py-2.5 rounded-md shadow-md transition-colors"
            >
              Add Content
            </button>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-6">
        <nav className="flex gap-0.5 border-b border-stone-200">
          {STUDIO_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap font-editorial
                ${activeTab === tab.id
                  ? 'text-[#802626]'
                  : 'text-stone-400 hover:text-stone-600'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="studio-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#802626]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading indicator for CMS data */}
      {(isLoadingCms || (activeTab === 'journals' && isLoadingJournals)) && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm font-editorial">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b border-stone-400" />
            Loading…
          </div>
        </div>
      )}

      {/* Content area — artifacts grid or journals grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'journals' ? (
          <motion.section
            key="journals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-[1200px] mx-auto px-6 md:px-8 py-8"
          >
            {allJournals.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-stone-300 mb-2">No journals yet</p>
                <p className="text-sm text-stone-400">
                  {isAdmin ? 'Upload your first journal PDF to get started.' : 'Check back soon for new journals.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allJournals.map((journal) => (
                  <JournalCard
                    key={journal.id}
                    journal={journal}
                    isAdmin={isAdmin}
                    isCms={isCmsJournal(journal)}
                    onOpen={() => setViewingJournal(journal)}
                    onDelete={() => setDeletingJournal(journal)}
                  />
                ))}
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="artifacts-grid-container"
          >
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-stone-300 mb-2">No artifacts yet</p>
            <p className="text-sm text-stone-400">
              {isAdmin ? 'Add your first artifact to start the collection.' : 'Check back soon for new creations.'}
            </p>
          </div>
        ) : (
          <div className="artifacts-scrapbook-grid">
            {filteredArtifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                isAdmin={isAdmin}
                isCms={isCmsArtifact(artifact)}
                onEdit={handleEdit}
                onDelete={(a) => setDeletingArtifact(a)}
              />
            ))}
          </div>
        )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Upload Artifact Modal (admin only) ── */}
      {showUploadModal && (
        <UploadArtifactModal
          onClose={() => setShowUploadModal(false)}
          onPublished={() => {
            setShowUploadModal(false);
            fetchCmsArtifacts();
          }}
        />
      )}

      {/* ── Edit Artifact Modal (admin only, CMS artifacts) ── */}
      {editingArtifact && (
        <EditArtifactModal
          artifact={editingArtifact}
          onClose={() => setEditingArtifact(null)}
          onSaved={() => {
            setEditingArtifact(null);
            fetchCmsArtifacts();
          }}
        />
      )}

      {/* ── Upload Journal Modal (admin only) ── */}
      {showJournalUpload && (
        <UploadJournalModal
          onClose={() => setShowJournalUpload(false)}
          onPublished={() => {
            setShowJournalUpload(false);
            fetchJournals();
          }}
        />
      )}

      {/* ── Journal PDF Viewer ── */}
      {viewingJournal && (
        <ContentRenderer
          type="pdf-flipbook"
          data={journalToContentData(viewingJournal)}
          onClose={() => setViewingJournal(null)}
          layoutVariant="default"
        />
      )}

      {/* ── Delete Journal Confirmation Modal ── */}
      {deletingJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeletingJournal && setDeletingJournal(null)}
          />
          <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-stone-200">
            <h3 className="font-serif italic text-lg font-bold text-stone-900 mb-2">
              Delete Journal
            </h3>
            <p className="font-editorial text-sm text-stone-600 mb-5">
              Are you sure you want to delete &ldquo;{deletingJournal.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingJournal(null)}
                disabled={isDeletingJournal}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJournalConfirm}
                disabled={isDeletingJournal}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-red-600 hover:bg-red-700 disabled:bg-stone-300 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeletingJournal && (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Artifact Confirmation Modal ── */}
      {deletingArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingArtifact(null)}
          />
          <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-stone-200">
            <h3 className="font-serif italic text-lg font-bold text-stone-900 mb-2">
              Delete Artifact
            </h3>
            <p className="font-editorial text-sm text-stone-600 mb-5">
              Are you sure you want to delete &ldquo;{deletingArtifact.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingArtifact(null)}
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

export default function ArtifactsPage() {
  return <ArtifactsPageContent />;
}

// ─────────────────────────────────────────────
// Artifact Card with admin edit/delete controls
// ─────────────────────────────────────────────

interface ArtifactCardProps {
  artifact: Artifact;
  isAdmin?: boolean;
  isCms?: boolean;
  onEdit?: (artifact: Artifact) => void;
  onDelete?: (artifact: Artifact) => void;
}

function ArtifactCard({ artifact, isAdmin, isCms, onEdit, onDelete }: ArtifactCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const frameClass = `frame-${artifact.frameType}`;
  const borderClass = `border-${artifact.borderStyle}`;
  const isCompact = artifact.frameType === 'mini' || artifact.frameType === 'tiny';
  const isTextCard = artifact.frameType === 'wide' && artifact.description;
  
  return (
    <div 
      className={`artifact-piece ${frameClass} ${borderClass}`}
      style={{
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        zIndex: isHovered ? 100 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin controls — edit / delete (CMS items only) */}
      {isAdmin && isCms && isHovered && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(artifact);
            }}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-telugu-kavi shadow-sm transition-colors"
            title="Edit artifact"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(artifact);
            }}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-red-600 shadow-sm transition-colors"
            title="Delete artifact"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Artifact Content — fills entire bento cell */}
      <div 
        className="artifact-content"
        style={{ backgroundColor: artifact.backgroundColor || '#F9F7F2' }}
      >
        {/* Main Visual Area */}
        <div className="artifact-visual">
          {isTextCard ? (
            <div className="artifact-text-content">
              <h2 className="artifact-large-title">{artifact.title}</h2>
              <p className="artifact-description">{artifact.description}</p>
            </div>
          ) : artifact.imagePath ? (
            <div className="artifact-image-placeholder relative">
              <Image
                src={artifact.imagePath}
                alt={artifact.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="artifact-image-placeholder">
              <span className="placeholder-icon" style={{ fontSize: isCompact ? '28px' : '48px' }}>◈</span>
            </div>
          )}
        </div>

        {/* Metadata Bar — hidden on tiny cards to save space */}
        {artifact.frameType !== 'tiny' && (
          <div className="artifact-metadata">
            <div className="metadata-row">
              <span className="artifact-title">{artifact.title}</span>
            </div>
            {!isCompact && (
              <div className="metadata-row">
                <span className="artifact-medium">{artifact.medium}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Paper Note — only on hero/standard to avoid overcrowding */}
      {artifact.paperNote && !isCompact && (
        <div className={`paper-note paper-note-${artifact.paperNote.position}`}>
          <span className="paper-note-text">{artifact.paperNote.text}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Journal Card — clickable PDF journal card
// ─────────────────────────────────────────────

interface JournalCardProps {
  journal: JournalItem;
  isAdmin?: boolean;
  isCms?: boolean;
  onOpen: () => void;
  onDelete?: (journal: JournalItem) => void;
}

function JournalCard({ journal, isAdmin, isCms, onOpen, onDelete }: JournalCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-stone-200 bg-[#FFF8F0] shadow-sm hover:shadow-lg transition-all cursor-pointer"
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      {/* Admin delete */}
      {isAdmin && isCms && isHovered && (
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(journal);
            }}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-red-600 shadow-sm transition-colors"
            title="Delete journal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Cover / Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center overflow-hidden">
        {journal.coverUrl ? (
          <Image
            src={journal.coverUrl}
            alt={journal.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-stone-300">
            <BookOpen className="h-10 w-10" />
            <FileText className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-base font-bold text-stone-800 mb-1 line-clamp-2">
          {journal.title}
        </h3>
        {journal.date && (
          <p className="font-editorial text-[10px] uppercase tracking-[0.12em] text-stone-400 mb-2">
            {journal.date}
          </p>
        )}
        {journal.description && (
          <p className="font-editorial text-xs text-stone-500 line-clamp-2">
            {journal.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1.5 text-[#802626] font-editorial text-[10px] font-semibold uppercase tracking-[0.12em]">
          <BookOpen className="h-3 w-3" />
          Open Journal
        </div>
      </div>
    </div>
  );
}
