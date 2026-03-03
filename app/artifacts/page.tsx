'use client';

import { useState, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Artifact } from '@/data/artifacts';
import { artifacts as staticArtifacts } from '@/data/artifacts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { UploadArtifactModal } from '@/components/artifacts/UploadArtifactModal';
import { EditArtifactModal } from '@/components/artifacts/EditArtifactModal';
import { useCmsPage } from '@/hooks/useCmsPage';
import type { ContentItem } from '@/cms/types';

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
    date: (meta.date as string) || "",
    frameType: (meta.frameType as Artifact["frameType"]) || "standard",
    offsetType: "none",
    borderStyle: (meta.borderStyle as Artifact["borderStyle"]) || "shadow",
  };

  // Only set optional properties when they have values
  // (exactOptionalPropertyTypes disallows explicit undefined)
  const dims = (payload.dimensions as string) || "";
  if (dims) artifact.dimensions = dims;

  const desc = (payload.description as string) || "";
  if (desc) artifact.description = desc;

  const bg = (payload.backgroundColor as string) || "";
  if (bg) artifact.backgroundColor = bg;

  const img = (payload.imagePath as string) || "";
  if (img) artifact.imagePath = img;

  if (payload.hasWashiTape) artifact.hasWashiTape = true;

  if (paperNoteText && paperNotePosition) {
    artifact.paperNote = {
      text: paperNoteText,
      position: paperNotePosition as "top-left" | "top-right" | "bottom-left" | "bottom-right",
    };
  }

  return artifact;
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

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);

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
          <h1 className="hero-title">The Studio</h1>
          <p className="hero-subtitle">A collection of creative experiments and visual studies</p>
          <div className="hero-metadata">
            <span>{allArtifacts.length} Pieces</span>
          </div>
        </div>
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
      </section>

      {/* Loading indicator for CMS data */}
      {isLoadingCms && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm font-editorial">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b border-stone-400" />
            Loading artifacts…
          </div>
        </div>
      )}

      {/* Scrapbook Grid */}
      <section className="artifacts-grid-container">
        {allArtifacts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-stone-300 mb-2">No artifacts yet</p>
            <p className="text-sm text-stone-400">
              {isAdmin ? 'Add your first artifact to start the collection.' : 'Check back soon for new creations.'}
            </p>
          </div>
        ) : (
          <div className="artifacts-scrapbook-grid">
            {allArtifacts.map((artifact) => (
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
      </section>

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

      {/* ── Delete Confirmation Modal ── */}
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
              {!isCompact && <span className="artifact-date">{artifact.date}</span>}
            </div>
            {!isCompact && (
              <div className="metadata-row">
                <span className="artifact-medium">{artifact.medium}</span>
                {artifact.dimensions && (
                  <span className="artifact-dimensions">{artifact.dimensions}</span>
                )}
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
