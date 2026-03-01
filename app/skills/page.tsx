"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { skillExperiments } from "@/data/skills";
import { sidequests } from "@/data/sidequests";
import { SkillCard } from "@/components/skills";
import { QuestCard } from "@/components/sidequests";


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
          <span className="word-acquisition">/ Side Quests</span>
        </h1>
        <p
          className="font-sans text-lg leading-relaxed mt-6 max-w-2xl"
          style={{ color: "#2D2424", opacity: 0.8 }}
        >
          Master of all trades, jack of none.
        </p>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Filter Pills Component
// ─────────────────────────────────────────────

type QuestType = "skill" | "sidequest";

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

function FilterPill({ active, onClick, label, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-amber-900 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}


// ─────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────

function SkillsPageContent() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const [activeTab, setActiveTab] = useState<QuestType>("sidequest");

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900" />
      </div>
    );
  }

  const pageContent = (
    <div className="skills-bg min-h-screen">
      {/* Fixed Navigation */}
      {!isAuthenticated && <EditorialNav currentSlug="skilling" />}

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        
        {/* Filter Pills */}
        <div className="flex gap-3 mb-10 border-b border-gray-200 pb-6">
          <FilterPill
            active={activeTab === "sidequest"}
            onClick={() => setActiveTab("sidequest")}
            label="Sidequests"
            count={sidequests.length}
          />
          <FilterPill
            active={activeTab === "skill"}
            onClick={() => setActiveTab("skill")}
            label="Skill Quests"
            count={skillExperiments.length}
          />
        </div>

        {/* Skill Quest Grid */}
        {activeTab === "skill" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {skillExperiments.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Sidequest Grid */}
        {activeTab === "sidequest" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-8">
              {sidequests.map((quest, index) => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  index={index}
                  onClick={() => {}} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-sm text-gray-400">
            Soumitri Digital Twin
          </span>
          <p className="font-sans text-[11px] text-gray-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} &middot; Master of all trades, jack of none.
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
