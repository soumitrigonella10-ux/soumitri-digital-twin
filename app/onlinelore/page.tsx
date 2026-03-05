'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { LoreCard, UploadLoreModal, EditLoreModal } from '@/components/internet-lore';
import type { LoreCategory, LoreItem } from '@/data/internetLore';
import { useCmsPage } from '@/hooks/useCmsPage';
import { cmsItemToLoreItem } from '@/cms/queries';

// ─────────────────────────────────────────────
// Internet Lore — chaotic scrapbook archive
// ─────────────────────────────────────────────

const TABS: { id: LoreCategory; label: string }[] = [
  { id: 'pop-internet-core', label: 'Pop Internet Core' },
  { id: 'lobotomy-core', label: 'Lobotomy Core' },
  { id: 'hood-classics', label: 'Hood Classics' },
];

const EMPTY_MESSAGES: Record<LoreCategory, { title: string; subtitle: string }> = {
  'pop-internet-core': { title: 'Pop Internet Core', subtitle: 'The lore is being gathered.' },
  'lobotomy-core': { title: 'Lobotomy Core', subtitle: 'Brain cells not found.' },
  'hood-classics': { title: 'Hood Classics', subtitle: 'If you know, you know.' },
};

function InternetLorePageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: allLoreItems,
    fetchCmsItems,
    isCmsItem: _isCmsItem,
    deletingItem, setDeletingItem,
    isDeleting, handleDeleteConfirm,
  } = useCmsPage({
    contentType: 'internet-lore',
    converter: cmsItemToLoreItem,
    staticItems: [], // All lore now lives in content_items DB table
  });

  const [activeTab, setActiveTab] = useState<LoreCategory>('pop-internet-core');

  // CMS state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LoreItem | null>(null);

  // Filter by active tab
  const filteredItems = useMemo(() => {
    return allLoreItems.filter((item) => item.category === activeTab);
  }, [allLoreItems, activeTab]);

  if (status === "loading") {
    return (
      <div className="muggu-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="muggu-bg min-h-screen relative">
      {/* Fixed Navigation for public users */}
      {!isAuthenticated && <EditorialNav currentSlug="internet-lore" />}

      {/* Fixed Watermark */}
      {!isAuthenticated && (
        <div
          className="fixed bottom-8 left-4 text-[#4A2C2A] text-sm font-light tracking-[0.3em] opacity-40 z-10"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(-180deg)',
            textOrientation: 'mixed',
          }}
        >
          DIGITAL TWIN // 2026
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {/* Hero Header */}
        <header className="mb-10 lg:mb-16">
          <div className="space-y-0 mb-5">
            <h1
              className="text-7xl lg:text-9xl font-normal text-[#3A2018] tracking-tight leading-[0.9]"
              style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
            >
              Online
            </h1>
            <h1
              className="text-6xl lg:text-8xl italic text-[#8A2424] tracking-tight leading-[0.95] ml-4 lg:ml-8 -mt-1"
              style={{ fontFamily: "var(--font-script), 'Mrs Saint Delafield', cursive" }}
            >
              Lore
            </h1>
          </div>
          <p
            className="max-w-md text-[#4A2C2A]/70 text-sm lg:text-base font-light italic leading-relaxed ml-0 lg:ml-2"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", letterSpacing: '0.02em' }}
          >
            A digital archive of things we shouldn&apos;t remember,<br />
            but can&apos;t forget.
          </p>
        </header>

        {/* Toolbar: Tabs + Admin add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Tabs */}
          <nav className="flex gap-0.5 border-b border-[#4A2C2A]/10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-[#802626]'
                    : 'text-[#4A2C2A]/35 hover:text-[#4A2C2A]/60'
                  }
                `}
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="lore-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#802626]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Admin: Add Content */}
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] bg-[#802626] text-white hover:bg-[#6b1f1f] transition-colors shadow-sm"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Lore
            </button>
          )}
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p
                className="text-2xl text-[#4A2C2A]/25 mb-2"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
              >
                {EMPTY_MESSAGES[activeTab].title}
              </p>
              <p className="text-sm text-[#4A2C2A]/30">
                {EMPTY_MESSAGES[activeTab].subtitle}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-4 lg:gap-5"
            >
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative group/card">
                  <LoreCard
                    item={item}
                    index={index}
                    chaosMode={false}
                  />
                  {/* Admin edit/delete overlay */}
                  {isAdmin && (
                    <div className="absolute top-3 left-3 z-20 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingItem(item); }}
                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-[#D4C4B0]/30 hover:bg-[#802626] hover:text-white text-[#4A2C2A]/60 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingItem(item); }}
                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-[#D4C4B0]/30 hover:bg-red-600 hover:text-white text-[#4A2C2A]/60 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer count */}
        {filteredItems.length > 0 && (
          <div className="mt-12 text-center">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#4A2C2A]/25"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {filteredItems.length} artifact{filteredItems.length !== 1 ? 's' : ''} catalogued
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadLoreModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchCmsItems}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditLoreModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={fetchCmsItems}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeletingItem(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lore Entry?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. The entry will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
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

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────

export default function InternetLorePage() {
  return <InternetLorePageContent />;
}
