'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import type { DesignThought } from '@/data/designThoughts';
import { designThoughts } from '@/data/designThoughts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { ContentRenderer } from '@/components/content-renderer';
import { thoughtToContentData } from '@/lib/content-adapters';

function DesignTheologyPageContent() {
  const { data: session, status } = useSession();
  const [selectedThought, setSelectedThought] = useState<DesignThought | null>(null);
  const isAuthenticated = !!session;

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
          <ContentRenderer
            type="pdf-flipbook"
            data={thoughtToContentData(selectedThought)}
            onClose={handleCloseModal}
            layoutVariant="default"
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


