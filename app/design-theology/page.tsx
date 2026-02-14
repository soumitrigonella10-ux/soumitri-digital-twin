'use client';

import { designThoughts, DesignThought } from '@/data/designThoughts';
import { EditorialNav } from '@/components/EditorialNav';

export default function DesignTheologyPage() {

  return (
    <div className="design-theology-page">
      <EditorialNav />
      
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
            <ThoughtCard key={thought.id} thought={thought} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================
// THOUGHT CARD COMPONENT
// ============================================

interface ThoughtCardProps {
  thought: DesignThought;
}

function ThoughtCard({ thought }: ThoughtCardProps) {
  // Construct card type class
  const cardTypeClass = `thought-card-${thought.cardType}`;
  const patternClass = thought.hasTechnicalPattern ? 'has-technical-pattern' : '';

  return (
    <div
      className={`thought-card ${cardTypeClass} ${patternClass}`}
    >
      {/* Technical Pattern Background */}
      {thought.hasTechnicalPattern && (
        <div className="technical-pattern-bg" />
      )}

      {/* Measurement Annotation */}
      {thought.annotationType === 'measurement' && thought.measurement && (
        <div className={`measurement-line measurement-${thought.measurement.position}`}>
          <span className="measurement-label">{thought.measurement.label}</span>
        </div>
      )}

      {/* Redline Annotation */}
      {thought.annotationType === 'redline' && thought.redlineText && (
        <div className="redline-label">
          {thought.redlineText}
        </div>
      )}

      {/* Stamp Annotation */}
      {thought.annotationType === 'stamp' && thought.stampText && (
        <div className="stamp-label">
          {thought.stampText}
        </div>
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

          <div className="thought-content">
            {thought.content.map((paragraph, index) => (
              <p key={index} className="thought-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
