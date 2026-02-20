'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { sidequests, type Sidequest } from '@/data/sidequests';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { QuestCard, QuestModal } from '@/components/sidequests';

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function ArchivePageContent() {
  const { data: session, status } = useSession();
  const [selectedQuest, setSelectedQuest] = useState<Sidequest | null>(null);

  const isAuthenticated = !!session;

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedQuest) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedQuest]);

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
        </header>

        {/* Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-8">
          {sidequests.map((quest, index) => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              index={index}
              onClick={() => setSelectedQuest(quest)} 
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <QuestModal 
            quest={selectedQuest} 
            onClose={() => setSelectedQuest(null)} 
          />
        )}
      </AnimatePresence>
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
