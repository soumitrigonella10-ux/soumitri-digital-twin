'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DesignThought } from '@/data/designThoughts';
import { designThoughts } from '@/data/designThoughts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { PdfBookViewer } from '@/components/PdfBookViewer';

function DesignTheologyPageContent() {
  const { data: session, status } = useSession();
  const [selectedThought, setSelectedThought] = useState<DesignThought | null>(null);
  const isAuthenticated = !!session;

  const handleOpenModal = (thought: DesignThought) => {
    if (thought.pdfUrl) {
      setSelectedThought(thought);
      document.body.style.overflow = "hidden";
    }
  };

  const handleCloseModal = () => {
    setSelectedThought(null);
    document.body.style.overflow = "";
  };

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
      <section className="theology-hero">
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
      </section>

      {/* Thought Cards Grid */}
      <section className="theology-grid-container">
        <div className="theology-thought-grid">
          {designThoughts.map((thought) => (
            <ThoughtCard 
              key={thought.id} 
              thought={thought} 
              onClick={() => handleOpenModal(thought)}
            />
          ))}
        </div>
      </section>

      {/* PDF Modal */}
      <AnimatePresence>
        {selectedThought && selectedThought.pdfUrl && (
          <DesignPdfModal 
            thought={selectedThought} 
            onClose={handleCloseModal} 
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

export default function DesignTheologyPage() {
  return <DesignTheologyPageContent />;
}

// ============================================
// THOUGHT CARD COMPONENT
// ============================================

interface ThoughtCardProps {
  thought: DesignThought;
  onClick?: () => void;
}

function ThoughtCard({ thought, onClick }: ThoughtCardProps) {
  // Construct card type class
  const cardTypeClass = `thought-card-${thought.cardType}`;
  const patternClass = thought.hasTechnicalPattern ? 'has-technical-pattern' : '';
  const clickableClass = thought.pdfUrl ? 'clickable' : '';

  return (
    <div
      className={`thought-card ${cardTypeClass} ${patternClass} ${clickableClass}`}
      onClick={onClick}
      style={{ cursor: thought.pdfUrl ? 'pointer' : 'default' }}
    >
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

// ============================================
// DESIGN PDF MODAL COMPONENT
// ============================================

interface DesignPdfModalProps {
  thought: DesignThought;
  onClose: () => void;
}

function DesignPdfModal({ thought, onClose }: DesignPdfModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#F9F7F2] rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C4B6A6]/30">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2D2424] mb-1">
              {thought.title}
              {thought.subtitle && (
                <span className="font-light italic"> {thought.subtitle}</span>
              )}
            </h2>
            <div className="flex items-center gap-3 text-sm text-[#802626]">
              <span className="font-medium">{thought.category}</span>
              <span className="text-[#C4B6A6]">•</span>
              <span>{thought.date}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#802626]/10 hover:bg-[#802626]/20 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-[#802626]" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-6">
          {thought.pdfUrl && (
            <div className="w-full h-full">
              <PdfBookViewer
                pdfUrl={thought.pdfUrl}
                title={`${thought.title} - Design Document`}
                className="rounded-lg overflow-hidden"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
