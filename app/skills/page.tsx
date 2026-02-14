"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { skillExperiments, type SkillExperiment } from "@/data/skills";

// ─────────────────────────────────────────────
// Experiment Card Component
// ─────────────────────────────────────────────

interface ExperimentCardProps {
  experiment: SkillExperiment;
}

function ExperimentCard({ experiment }: ExperimentCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cardClass = experiment.isInverted
    ? "experiment-card inverted"
    : "experiment-card";

  return (
    <div ref={cardRef} className={cardClass}>
      {/* Header */}
      <div className="experiment-card-header">
        <div className="experiment-pill">
          Experiment {String(experiment.experimentNumber).padStart(2, "0")}
        </div>
        <div className="experiment-index">
          {String(experiment.experimentNumber).padStart(2, "0")}
        </div>
      </div>

      {/* Body */}
      <div className="experiment-card-body">
        <h3 className="experiment-name">{experiment.name}</h3>

        <div className="experiment-tools">
          {experiment.tools.map((tool, idx) => (
            <span key={idx} className="experiment-tool">
              {tool}
              {idx < experiment.tools.length - 1 && " · "}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="experiment-card-footer">
        {/* Proficiency */}
        <div className="experiment-proficiency">
          <div className="proficiency-header">
            <span className="proficiency-label">Proficiency</span>
            <span className="proficiency-value">{experiment.proficiency}%</span>
          </div>

          <div className="proficiency-bar-container">
            <div
              className={`proficiency-bar-fill ${isVisible ? "animated" : ""}`}
              style={
                {
                  "--target-width": `${experiment.proficiency}%`,
                  width: isVisible ? `${experiment.proficiency}%` : "0%",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Description */}
        <p className="experiment-description">{experiment.description}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="skills-hero-container pt-32 pb-16 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Rotating Dashed Circle */}
      <div className="skills-rotating-decoration" />

      {/* Content */}
      <div className="skills-hero-content">
        <p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-4"
          style={{ color: "#802626" }}
        >
          The Laboratory
        </p>
        <h1 className="skills-hero-title">
          Skill
          <span className="word-acquisition">Acquisition</span>
        </h1>
        <p
          className="font-sans text-lg leading-relaxed mt-6 max-w-2xl"
          style={{ color: "#2D2424", opacity: 0.8 }}
        >
          Learning framed as scientific inquiry. Each skill is an experiment with
          measurable progress, documented tools, and a hypothesis about what
          mastery looks like. Some are complete. Others are ongoing. All are
          intentional.
        </p>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function SkillsPageContent() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;

  // Loading state
  if (status === "loading") {
    return (
      <div className="skills-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#802626]" />
      </div>
    );
  }

  const pageContent = (
    <div className="skills-bg min-h-screen">
      {/* Fixed Navigation */}
      {!isAuthenticated && <EditorialNav currentSlug="skilling" />}

      {/* Hero Section */}
      <HeroSection />

      {/* Experiments Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        <div className="skills-grid">
          {skillExperiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-sm text-gray-400">
            Soumitri Digital Twin
          </span>
          <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} &middot; Learning with intention
          </p>
        </div>
      </footer>
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

export default function SkillsPage() {
  return <SkillsPageContent />;
}
