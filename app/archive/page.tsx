'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, CheckCircle2 } from 'lucide-react';
import { sidequests, type Sidequest } from '@/data/sidequests';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

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
      {!isAuthenticated && <EditorialNav currentSlug="archive" />}
      
      {/* Fixed Watermark */}
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

      {/* Main Content */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        {/* Hero Header */}
        <header className="mb-20 lg:mb-32">
          <div className="space-y-2 mb-8">
            <h1 
              className="text-7xl lg:text-9xl font-serif font-normal text-[#4A2C2A] tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Side
            </h1>
            <h1 
              className="text-7xl lg:text-9xl font-serif italic text-[#8A2424] tracking-tight leading-none ml-16 lg:ml-32"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Quests
            </h1>
          </div>
          <p 
            className="max-w-xl text-[#4A2C2A] text-base lg:text-lg font-light tracking-wide leading-relaxed ml-0 lg:ml-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.05em' }}
          >
            A curated archive of intentional pursuits—each one a deliberate step 
            toward becoming. These are the quests that shape identity, build character, 
            and transform daily life into something meaningful.
          </p>
        </header>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-16">
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
// Quest Card Component
// ─────────────────────────────────────────────

interface QuestCardProps {
  quest: Sidequest;
  index: number;
  onClick: () => void;
}

function QuestCard({ quest, index, onClick }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/5] bg-[#EBDCCB] rounded-sm overflow-hidden mb-4">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EBDCCB] via-[#D4C4B0] to-[#BFAF9B]" />
        
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 bg-[#4A2C2A] transition-opacity duration-300"
          style={{ opacity: isHovered ? 0 : 0.15 }}
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-[#8A2424] tracking-wider uppercase">
            {quest.category}
          </span>
        </div>

        {/* Completion Indicator */}
        {quest.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-4 right-4 w-10 h-10 bg-[#8A2424] rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="text-2xl lg:text-3xl font-serif text-[#4A2C2A] leading-tight flex-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {quest.title}
          </h3>
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="w-6 h-6 text-[#8A2424] flex-shrink-0" />
          </motion.div>
        </div>

        <p 
          className="text-[#4A2C2A]/70 text-sm leading-relaxed line-clamp-2 font-light"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.02em' }}
        >
          {quest.description}
        </p>

        {quest.completed && (
          <div className="pt-2">
            <span 
              className="text-xs font-bold text-[#8A2424] tracking-widest uppercase"
              style={{ letterSpacing: '0.15em' }}
            >
              +{quest.xp} XP Earned
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface QuestModalProps {
  quest: Sidequest;
  onClose: () => void;
}

function QuestModal({ quest, onClose }: QuestModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#8A2424]/80 editorial-backdrop"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-7xl h-[90vh] lg:h-[85vh] bg-[#F9F5F0] flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column - Media */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full bg-gradient-to-br from-[#EBDCCB] via-[#D4C4B0] to-[#BFAF9B] flex-shrink-0" />

        {/* Right Column - Content */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto modal-scroll p-8 lg:p-12 relative flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 lg:top-8 lg:right-8 w-10 h-10 flex items-center justify-center text-[#4A2C2A] hover:text-[#8A2424] transition-all duration-300 hover:rotate-90 group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="space-y-6 lg:space-y-8 flex-1">
            {/* Entry ID */}
            <div>
              <span 
                className="text-xs text-[#8A2424] tracking-[0.3em] uppercase font-medium"
              >
                Entry {quest.entryId}
              </span>
            </div>

            {/* Title */}
            <h2 
              className="text-4xl lg:text-6xl font-serif italic text-[#4A2C2A] leading-tight pr-12"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {quest.title}
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-[#EBDCCB] text-[#4A2C2A] text-sm font-medium rounded-full">
                {quest.category}
              </span>
              <span className="px-4 py-2 bg-[#EBDCCB] text-[#4A2C2A] text-sm font-medium rounded-full">
                {quest.difficulty}
              </span>
              {quest.completed && (
                <span className="px-4 py-2 bg-[#8A2424] text-white text-sm font-medium rounded-full flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>

            {/* Quest Log */}
            <div className="space-y-4">
              <h3 
                className="text-sm text-[#8A2424] tracking-[0.2em] uppercase font-bold"
              >
                Quest Log
              </h3>
              <p 
                className="text-[#4A2C2A]/80 text-base leading-loose font-light"
                style={{ 
                  fontFamily: "'Inter', system-ui, sans-serif", 
                  lineHeight: '1.9',
                  letterSpacing: '0.01em'
                }}
              >
                {quest.questLog}
              </p>
            </div>

            {/* Reward Section */}
            <div className="pt-6 border-t border-[#EBDCCB]">
              <h3 
                className="text-sm text-[#8A2424] tracking-[0.2em] uppercase font-bold mb-3"
              >
                {quest.completed ? 'Reward Claimed' : 'Potential Reward'}
              </h3>
              <p 
                className="text-5xl lg:text-6xl font-serif italic text-[#8A2424]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                +{quest.xp} XP
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 mt-auto">
            <button
              onClick={onClose}
              className="w-full py-4 px-6 bg-[#4A2C2A] text-[#F9F5F0] font-medium tracking-wider uppercase transition-all duration-300 hover:bg-[#8A2424] text-sm"
            >
              Return to Archive
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────

export default function ArchivePage() {
  return <ArchivePageContent />;
}
