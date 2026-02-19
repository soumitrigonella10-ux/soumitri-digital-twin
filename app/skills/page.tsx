"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { getCurrentSkills, getAchievedSkills, type SkillExperiment } from "@/data/skills";

// ─────────────────────────────────────────────
// Skill Card Component
// ─────────────────────────────────────────────

interface SkillCardProps {
  skill: SkillExperiment;
}

function SkillCard({ skill }: SkillCardProps) {
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

  const cardClass = skill.isInverted
    ? "skill-card inverted"
    : "skill-card";

  return (
    <div ref={cardRef} className={cardClass}>
      {/* Header */}
      <div className="skill-card-header">
        <div className="skill-category">
          {skill.category}
        </div>
      </div>

      {/* Body */}
      <div className="skill-card-body">
        <h3 className="skill-name">{skill.name}</h3>

        <div className="skill-tools">
          {skill.tools.slice(0, 2).map((tool, idx) => (
            <span key={idx} className="skill-tool">
              {tool}
              {idx < Math.min(skill.tools.length - 1, 1) && " · "}
            </span>
          ))}
          {skill.tools.length > 2 && (
            <span className="skill-tool">+{skill.tools.length - 2} more</span>
          )}
        </div>

        {/* Proficiency */}
        <div className="skill-proficiency">
          <div className="proficiency-header">
            <span className="proficiency-value">{skill.proficiency}%</span>
          </div>

          <div className="proficiency-bar-container">
            <div
              className={`proficiency-bar-fill ${isVisible ? "animated" : ""}`}
              style={
                {
                  "--target-width": `${skill.proficiency}%`,
                  width: isVisible ? `${skill.proficiency}%` : "0%",
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function HeroSection() {
  return (
    <header className="skills-hero-container pt-20 pb-8 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Rotating Dashed Circle */}
      <div className="skills-rotating-decoration" />

      {/* Content */}
      <div className="skills-hero-content">
        <p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-2"
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
  const [activeTab, setActiveTab] = useState<'current' | 'achieved'>('current');

  const currentSkills = getCurrentSkills();
  const achievedSkills = getAchievedSkills();

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

      {/* Skills Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        
        {/* Tab Navigation */}
        <div className="skills-tabs-container">
          <div className="skills-tabs">
            <button
              onClick={() => setActiveTab('current')}
              className={`skills-filter-pill ${activeTab === 'current' ? 'active' : ''}`}
            >
              Current ({currentSkills.length})
            </button>
            <button
              onClick={() => setActiveTab('achieved')}
              className={`skills-filter-pill ${activeTab === 'achieved' ? 'active' : ''}`}
            >
              Achieved ({achievedSkills.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="skills-tab-content">
          {activeTab === 'current' && (
            <div className="skills-grid">
              {currentSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
          
          {activeTab === 'achieved' && (
            <div className="skills-grid">
              {achievedSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
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
