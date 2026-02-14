'use client';

import { useState } from 'react';
import { artifacts, Artifact } from '@/data/artifacts';
import { EditorialNav } from '@/components/EditorialNav';

export default function ArtifactsPage() {
  return (
    <div className="artifacts-page">
      <EditorialNav />
      
      {/* Hero Section */}
      <section className="artifacts-hero">
        <div className="hero-content">
          <h1 className="hero-title">Visual Artifacts</h1>
          <p className="hero-subtitle">A curated collection of creative experiments, field notes, and visual studies</p>
          <div className="hero-metadata">
            <span>Archive Est. 2024</span>
            <span className="divider">•</span>
            <span>{artifacts.length} Pieces</span>
          </div>
        </div>
      </section>

      {/* Scrapbook Grid */}
      <section className="artifacts-grid-container">
        <div className="artifacts-scrapbook-grid">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface ArtifactCardProps {
  artifact: Artifact;
}

function ArtifactCard({ artifact }: ArtifactCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Construct CSS classes
  const frameClass = `artifact-frame frame-${artifact.frameType}`;
  const offsetClass = artifact.offsetType !== 'none' ? artifact.offsetType : '';
  const borderClass = `border-${artifact.borderStyle}`;
  
  return (
    <div 
      className={`artifact-piece ${frameClass} ${offsetClass} ${borderClass}`}
      style={{
        transform: isHovered 
          ? `scale(1.02) rotate(${parseFloat(artifact.rotation || '0') + 0.5}deg)`
          : `rotate(${artifact.rotation || '0deg'})`,
        zIndex: isHovered ? 100 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Washi Tape Detail */}
      {artifact.hasWashiTape && (
        <div className="washi-tape" />
      )}

      {/* Artifact Content */}
      <div 
        className="artifact-content"
        style={{ backgroundColor: artifact.backgroundColor || '#F9F7F2' }}
      >
        {/* Main Visual Area */}
        <div className="artifact-visual">
          {artifact.frameType === 'wide' && artifact.description ? (
            // Text-based wide format pieces
            <div className="artifact-text-content">
              <h2 className="artifact-large-title">{artifact.title}</h2>
              <p className="artifact-description">{artifact.description}</p>
            </div>
          ) : (
            // Image-based pieces (placeholder for now)
            <div className="artifact-image-placeholder">
              <span className="placeholder-icon">◈</span>
            </div>
          )}
        </div>

        {/* Metadata Bar */}
        <div className="artifact-metadata">
          <div className="metadata-row">
            <span className="artifact-title">{artifact.title}</span>
            <span className="artifact-date">{artifact.date}</span>
          </div>
          <div className="metadata-row">
            <span className="artifact-medium">{artifact.medium}</span>
            {artifact.dimensions && (
              <span className="artifact-dimensions">{artifact.dimensions}</span>
            )}
          </div>
        </div>
      </div>

      {/* Paper Note */}
      {artifact.paperNote && (
        <div className={`paper-note paper-note-${artifact.paperNote.position}`}>
          <span className="paper-note-text">{artifact.paperNote.text}</span>
        </div>
      )}
    </div>
  );
}
