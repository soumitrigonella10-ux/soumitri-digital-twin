'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { DesignThought } from '@/data/designThoughts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { ContentRenderer } from '@/components/content-renderer';
import { thoughtToContentData } from '@/lib/content-adapters';
import { AddDesignThoughtModal } from '@/components/design-thoughts/AddDesignThoughtModal';
import { EditDesignThoughtModal } from '@/components/design-thoughts/EditDesignThoughtModal';
import { useCmsPage } from '@/hooks/useCmsPage';
import type { ContentItem as CmsContentItem } from '@/cms/types';
import { Pencil, Trash2 } from 'lucide-react';

function cmsToDesignThought(item: CmsContentItem): DesignThought {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  const result: DesignThought = {
    id: item.id,
    title: item.title,
    category: (meta.category as string) || 'UX Philosophy',
    date: (meta.date as string) || new Date().toISOString().slice(0, 10),
    cardType: (meta.cardType as DesignThought['cardType']) || 'standard',
    annotationType: (meta.annotationType as DesignThought['annotationType']) || 'none',
  };
  const subtitle = payload.subtitle as string;
  if (subtitle) result.subtitle = subtitle;
  if (payload.hasTechnicalPattern === true) result.hasTechnicalPattern = true;
  const pdfUrl = payload.pdfUrl as string;
  if (pdfUrl) result.pdfUrl = pdfUrl;
  return result;
}

function DesignTheologyPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: designThoughts,
    fetchCmsItems,
    isCmsItem,
    deletingItem, setDeletingItem,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: 'design-thought',
    converter: cmsToDesignThought,
    staticItems: [],
    dedupeKey: (i) => i.title.toLowerCase(),
  });

  const [selectedThought, setSelectedThought] = useState<DesignThought | null>(null);

  // CMS CRUD state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DesignThought | null>(null);

  const handleOpenModal = (thought: DesignThought) => {
    if (thought.pdfUrl) setSelectedThought(thought);
  };

  const handleCloseModal = () => setSelectedThought(null);

  // Loading state
  if (status === "loading") {
    return (
      <div className="design-theology-page min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="design-theology-page">
      {!isAuthenticated && <EditorialNav currentSlug="design-thoughts" />}
      
      {/* Grid Paper Background */}
      <div className="grid-paper-overlay" />

      {/* Hero Section */}
      <section className="theology-hero relative">
        <div className="hero-content">
          <h1 className="theology-title">
            Design <span className="theology-title-italic">Theology</span>
          </h1>
          <p className="theology-subtitle">
            A working document of principles, beliefs, and process notes from the drafting table
          </p>
          <div className="theology-metadata">
            <span>Blueprint Rev. 2.4</span>
            <span className="divider">•</span>
            <span>{designThoughts.length} Thoughts</span>
            <span className="divider">•</span>
            <span>Updated Feb 2026</span>
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
      </section>

      {/* Thought Cards Grid */}
      <section className="theology-grid-container">
        {designThoughts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-300 mb-2">No design thoughts yet</p>
            <p className="text-sm text-gray-400">
              {isAdmin ? 'Add your first design thought to start the collection.' : 'Check back soon for design reflections.'}
            </p>
          </div>
        ) : (
          <div className="theology-thought-grid">
            {designThoughts.map((thought) => (
              <ThoughtCard
                key={thought.id}
                thought={thought}
                onClick={() => handleOpenModal(thought)}
                isAdmin={isAdmin}
                isCms={isCmsItem(thought)}
                onEdit={setEditingItem}
                onDelete={setDeletingItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* PDF Modal */}
      <AnimatePresence>
        {selectedThought && selectedThought.pdfUrl && (
          <ContentRenderer
            type="pdf-flipbook"
            data={thoughtToContentData(selectedThought)}
            onClose={handleCloseModal}
            layoutVariant="default"
          />
        )}
      </AnimatePresence>



      {showAddModal && (
        <AddDesignThoughtModal
          onClose={() => setShowAddModal(false)}
          onPublished={() => { setShowAddModal(false); fetchCmsItems(); }}
        />
      )}

      {editingItem && (
        <EditDesignThoughtModal
          thought={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); fetchCmsItems(); }}
        />
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-lg text-gray-900 mb-2">Delete &ldquo;{deletingItem.title}&rdquo;?</h3>
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

export default function DesignTheologyPage() {
  return <DesignTheologyPageContent />;
}

// ============================================
// THOUGHT CARD COMPONENT
// ============================================

interface ThoughtCardProps {
  thought: DesignThought;
  onClick?: () => void;
  isAdmin?: boolean;
  isCms?: boolean;
  onEdit?: (item: DesignThought) => void;
  onDelete?: (item: DesignThought) => void;
}

function ThoughtCard({ thought, onClick, isAdmin, isCms, onEdit, onDelete }: ThoughtCardProps) {
  // Construct card type class
  const cardTypeClass = `thought-card-${thought.cardType}`;
  const patternClass = thought.hasTechnicalPattern ? 'has-technical-pattern' : '';
  const clickableClass = thought.pdfUrl ? 'clickable' : '';

  return (
    <div
      className={`thought-card ${cardTypeClass} ${patternClass} ${clickableClass} relative group`}
      onClick={onClick}
      style={{ cursor: thought.pdfUrl ? 'pointer' : 'default' }}
    >
      {/* Admin controls */}
      {isAdmin && isCms && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <button onClick={(e) => { e.stopPropagation(); onEdit?.(thought); }} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete?.(thought); }} className="p-1.5 bg-white/90 rounded-full shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
        </div>
      )}
      {/* Technical Pattern Background */}
      {thought.hasTechnicalPattern && (
        <div className="technical-pattern-bg" />
      )}

      {/* Card Content */}
      <div className="thought-card-content">
        <div className="thought-card-header">
          <div className="thought-category">{thought.category}</div>
          <div className="thought-date">{thought.date}</div>
        </div>

        <div className="thought-card-body">
          <h3 className="thought-title">
            {thought.title}
            {thought.subtitle && (
              <span className="thought-subtitle">{thought.subtitle}</span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}


