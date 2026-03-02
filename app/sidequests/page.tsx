'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { sidequests as staticSidequests, type Sidequest } from '@/data/sidequests';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { QuestCard } from '@/components/sidequests';
import { ContentRenderer } from '@/components/content-renderer';
import { sidequestToContentData } from '@/lib/content-adapters';
import { getContentByType, deleteContent } from '@/cms/actions';
import type { ContentItem } from '@/cms/types';
import { UploadSidequestModal } from '@/components/sidequests/UploadSidequestModal';
import { EditSidequestModal } from '@/components/sidequests/EditSidequestModal';

function cmsItemToSidequest(item: ContentItem): Sidequest {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  return {
    id: item.id,
    entryId: `SQ-${item.slug}`,
    title: item.title,
    description: (payload.description as string) || "",
    category: (meta.category as string) || "",
    difficulty: (meta.difficulty as Sidequest["difficulty"]) || "Medium",
    xp: 0,
    completed: false,
    imageUrl: (payload.imageUrl as string) || item.coverImage || "",
    questLog: (payload.questLog as string) || "",
  };
}

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function ArchivePageContent() {
  const { data: session, status } = useSession();
  const [selectedQuest, setSelectedQuest] = useState<Sidequest | null>(null);

  const isAuthenticated = !!session;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  // CMS state
  const [cmsSidequests, setCmsSidequests] = useState<Sidequest[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Sidequest | null>(null);
  const [deletingQuest, setDeletingQuest] = useState<Sidequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCmsSidequests = useCallback(async () => {
    try {
      const items = await getContentByType("sidequest", { visibility: "published" });
      setCmsSidequests(items.map(cmsItemToSidequest));
    } catch (err) { console.error("Failed to load CMS sidequests:", err); }
  }, []);

  useEffect(() => { fetchCmsSidequests(); }, [fetchCmsSidequests]);

  // Merge static + CMS (CMS wins)
  const allSidequests = useMemo(() => {
    const cmsIds = new Set(cmsSidequests.map((s) => s.id));
    const dedupedStatic = staticSidequests.filter((s) => !cmsIds.has(s.id));
    return [...cmsSidequests, ...dedupedStatic];
  }, [cmsSidequests]);

  const isCmsItem = useCallback((id: string) => id.startsWith("ci_"), []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingQuest) return;
    setIsDeleting(true);
    try {
      const result = await deleteContent(deletingQuest.id);
      if (result.success) { setDeletingQuest(null); fetchCmsSidequests(); }
      else alert(result.error || "Failed to delete sidequest");
    } catch { alert("Failed to delete sidequest"); }
    finally { setIsDeleting(false); }
  }, [deletingQuest, fetchCmsSidequests]);

  // Loading state
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
      {!isAuthenticated && <EditorialNav currentSlug="sidequests" />}
      
      {/* Fixed Watermark - positioned to account for sidebar when authenticated */}
      {!isAuthenticated && (
        <div 
          className="fixed bottom-8 left-4 text-[#4A2C2A] text-sm font-light tracking-[0.3em] opacity-40 z-10"
          style={{ 
            writingMode: 'vertical-rl', 
            transform: 'rotate(-180deg)',
            textOrientation: 'mixed'
          }}
        >
          DIGITAL TWIN // 2026
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {/* Hero Header */}
        <header className="mb-10 lg:mb-16">
          <div className="space-y-2 mb-4">
            <h1 
              className="text-6xl lg:text-8xl font-serif font-normal text-[#4A2C2A] tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Side
            </h1>
            <h1 
              className="text-6xl lg:text-8xl font-serif italic text-[#8A2424] tracking-tight leading-none ml-16 lg:ml-32"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Quests
            </h1>
          </div>
          <p 
            className="max-w-xl text-[#4A2C2A] text-base lg:text-lg font-light tracking-wide leading-relaxed ml-0 lg:ml-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.05em' }}
          >
            I am just a girl standing in front of a hobby asking it to become her whole brand. (knowing damn well this is a three-week phase.)
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 ml-0 lg:ml-8 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#802626] text-white hover:bg-[#6b1f1f] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Sidequest
            </button>
          )}
        </header>

        {/* Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-8">
          {allSidequests.map((quest, index) => (
            <div key={quest.id} className="relative group">
              <QuestCard 
                quest={quest} 
                index={index}
                onClick={() => setSelectedQuest(quest)} 
              />
              {isAdmin && isCmsItem(quest.id) && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={(e) => { e.stopPropagation(); setEditingQuest(quest); }} className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeletingQuest(quest); }} className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <ContentRenderer
            type="split-detail"
            data={sidequestToContentData(selectedQuest)}
            onClose={() => setSelectedQuest(null)} 
            layoutVariant="default"
          />
        )}
      </AnimatePresence>

      {/* Admin: Upload/Edit/Delete Sidequest Modals */}
      {showUploadModal && (
        <UploadSidequestModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => { setShowUploadModal(false); fetchCmsSidequests(); }}
        />
      )}
      {editingQuest && (
        <EditSidequestModal
          sidequest={editingQuest}
          onClose={() => setEditingQuest(null)}
          onSuccess={() => { setEditingQuest(null); fetchCmsSidequests(); }}
        />
      )}
      {deletingQuest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Delete Sidequest</h3>
            <p className="text-sm text-gray-600">Are you sure you want to delete &ldquo;{deletingQuest.title}&rdquo;? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeletingQuest(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
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

export default function ArchivePage() {
  return <ArchivePageContent />;
}
