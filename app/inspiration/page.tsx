'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { inspirations, InspirationFragment } from '@/data/artifacts';
import { EditorialNav } from '@/components/EditorialNav';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { Play } from 'lucide-react';

function InspirationPageContent() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

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
      <section className="inspiration-section">
        <div className="inspiration-header">
          <h2 className="inspiration-title">Inspiration Board</h2>
          <p className="inspiration-subtitle">Small fragments of influence—tacked on, torn out, and treasured</p>
          <div className="inspiration-metadata">
            <span>{inspirations.length} Fragments</span>
          </div>
        </div>
        
        <div className="inspiration-masonry">
          {inspirations.map((inspiration) => (
            <InspirationCard key={inspiration.id} inspiration={inspiration} />
          ))}
        </div>
      </section>
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
}

function InspirationCard({ inspiration }: InspirationCardProps) {
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
      {renderContent()}
    </div>
  );
}
