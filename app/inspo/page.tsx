'use client';

import { useState, useMemo } from 'react';
import type { InspirationFragment } from '@/data/artifacts';
import { inspirations as staticInspirations } from '@/data/artifacts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { AddInspirationModal } from '@/components/inspiration/AddInspirationModal';
import { EditInspirationModal } from '@/components/inspiration/EditInspirationModal';
import { useCmsPage } from '@/hooks/useCmsPage';
import type { ContentItem as CmsContentItem } from '@/cms/types';
import { Play, Pencil, Trash2 } from 'lucide-react';

function cmsToInspiration(item: CmsContentItem): InspirationFragment {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  const result: InspirationFragment = {
    id: item.id,
    type: (meta.inspirationType as InspirationFragment['type']) || 'image',
    content: (payload.content as string) || item.title,
  };
  const source = payload.source as string;
  if (source) result.source = source;
  const subtitle = payload.subtitle as string;
  if (subtitle) result.subtitle = subtitle;
  const bg = payload.backgroundColor as string;
  if (bg) result.backgroundColor = bg;
  const accent = payload.accentColor as string;
  if (accent) result.accentColor = accent;
  return result;
}

function InspirationPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: inspirations,
    fetchCmsItems,
    isCmsItem,
    deletingItem: deletingItem,
    setDeletingItem: setDeletingItem,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: 'inspiration',
    converter: cmsToInspiration,
    staticItems: staticInspirations,
    dedupeKey: (i) => i.content.toLowerCase(),
  });

  // CMS CRUD state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InspirationFragment | null>(null);

  // Loading state
  if (status === "loading") {
    return (
      <div className="inspiration-page min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="inspiration-page">
      {!isAuthenticated && <EditorialNav currentSlug="inspiration" />}
      
      {/* Inspiration Board Section */}
      <section className="inspiration-section relative">
        <div className="inspiration-header">
          <h2 className="inspiration-title">Inspo</h2>
          <p className="inspiration-subtitle">Small fragments of influence—tacked on, torn out, and treasured</p>
          <div className="inspiration-metadata">
            <span>{inspirations.length} Fragments</span>
          </div>
        </div>
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
        
        <div className="inspiration-masonry">
          {inspirations.length === 0 ? (
            <div className="col-span-full w-full text-center py-20" style={{ columnSpan: 'all' }}>
              <p className="font-serif text-2xl text-[#802626]/40 mb-2">No fragments yet</p>
              <p className="text-sm text-[#C4B6A6]">
                {isAdmin ? 'Tap "Add Content" to pin your first inspiration.' : 'Check back soon for curated inspirations.'}
              </p>
            </div>
          ) : (
            inspirations.map((inspiration) => (
              <InspirationCard
                key={inspiration.id}
                inspiration={inspiration}
                isAdmin={isAdmin}
                isCms={isCmsItem(inspiration)}
                onEdit={setEditingItem}
                onDelete={setDeletingItem}
              />
            ))
          )}
        </div>
      </section>



      {showAddModal && (
        <AddInspirationModal
          onClose={() => setShowAddModal(false)}
          onPublished={() => { setShowAddModal(false); fetchCmsItems(); }}
        />
      )}

      {editingItem && (
        <EditInspirationModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); fetchCmsItems(); }}
        />
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-lg text-gray-900 mb-2">Delete this inspiration?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
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

export default function InspirationPage() {
  return <InspirationPageContent />;
}

// ============================================
// INSPIRATION CARD COMPONENT
// ============================================

interface InspirationCardProps {
  inspiration: InspirationFragment;
  isAdmin?: boolean;
  isCms?: boolean;
  onEdit?: (item: InspirationFragment) => void;
  onDelete?: (item: InspirationFragment) => void;
}

function InspirationCard({ inspiration, isAdmin, isCms, onEdit, onDelete }: InspirationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate semi-random rotation based on ID for consistency
  const rotation = useMemo(() => {
    const seed = inspiration.id.split('-')[1] || '0';
    const num = parseInt(seed, 10);
    return ((num % 7) - 3) * 0.8; // Range: -2.4deg to +2.4deg
  }, [inspiration.id]);

  const hoverRotation = rotation + (rotation > 0 ? 1 : -1);

  // Render based on template type
  const renderContent = () => {
    switch (inspiration.type) {
      case 'image':
        return (
          <div className="inspiration-card inspiration-image-fragment">
            <div className="washi-tape-small" />
            <div 
              className="image-fragment-visual"
              style={{ backgroundColor: inspiration.backgroundColor }}
            >
              <span className="fragment-icon">◈</span>
            </div>
            <div className="image-fragment-caption">
              <p className="fragment-content">{inspiration.content}</p>
              {inspiration.source && (
                <span className="fragment-source">{inspiration.source}</span>
              )}
            </div>
          </div>
        );

      case 'music':
        return (
          <div 
            className="inspiration-card inspiration-music-snippet"
            style={{ backgroundColor: inspiration.backgroundColor }}
          >
            <div className="music-icon-container">
              <Play size={16} fill={inspiration.accentColor} color={inspiration.accentColor} />
            </div>
            <div className="music-content">
              <p className="music-track">{inspiration.content}</p>
              <span className="music-artist">{inspiration.source}</span>
              {inspiration.subtitle && (
                <span className="music-duration">{inspiration.subtitle}</span>
              )}
            </div>
          </div>
        );

      case 'quote':
        return (
          <div 
            className="inspiration-card inspiration-quote-fragment"
            style={{ backgroundColor: inspiration.backgroundColor }}
          >
            <div className="quote-content">
              <p className="quote-text">{inspiration.content}</p>
              {inspiration.source && (
                <span className="quote-source">— {inspiration.source}</span>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="inspiration-card inspiration-video-fragment">
            <div 
              className="video-fragment-visual"
              style={{ backgroundColor: inspiration.backgroundColor }}
            >
              <div className="video-play-overlay">
                <Play size={24} fill="rgba(255,255,255,0.9)" color="rgba(255,255,255,0.9)" />
              </div>
            </div>
            <div className="video-fragment-info">
              <p className="video-title">{inspiration.content}</p>
              <div className="video-meta">
                <span className="video-source">{inspiration.source}</span>
                {inspiration.subtitle && (
                  <span className="video-duration">{inspiration.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="inspiration-piece"
      style={{
        transform: isHovered
          ? `scale(1.02) rotate(${hoverRotation}deg)`
          : `rotate(${rotation}deg)`,
        zIndex: isHovered ? 50 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin controls */}
      {isAdmin && isCms && isHovered && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onEdit?.(inspiration); }} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete?.(inspiration); }} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
