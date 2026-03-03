"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import type { Sidequest } from "@/data/sidequests";
import { SkillCard } from "@/components/skills";
import { QuestCard } from "@/components/sidequests";
import { ContentRenderer } from "@/components/content-renderer";
import { sidequestToContentData } from "@/lib/content-adapters";
import { useCmsPage } from "@/hooks/useCmsPage";
import type { ContentItem } from "@/cms/types";
import type { SkillExperiment } from "@/types/editorial";
import { UploadSkillModal } from "@/components/skills/UploadSkillModal";
import { EditSkillModal } from "@/components/skills/EditSkillModal";
import { UploadSidequestModal } from "@/components/sidequests/UploadSidequestModal";
import { EditSidequestModal } from "@/components/sidequests/EditSidequestModal";


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
          <span className="word-acquisition">/SideQuests</span>
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

function cmsItemToSkill(item: ContentItem, index: number): SkillExperiment {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  return {
    id: item.id,
    experimentNumber: index + 1,
    name: item.title,
    tools: (meta.tags as string[]) || [],
    proficiency: (payload.proficiency as number) ?? 0,
    description: (payload.description as string) || "",
    category: (meta.category as string as SkillExperiment["category"]) || "Strategy",
  };
}

function cmsItemToSidequest(item: ContentItem): Sidequest {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  return {
    id: item.id,
    entryId: `SQ-${item.slug}`,
    title: item.title,
    description: (payload.description as string) || "",
    category: (meta.category as string) || "",
    difficulty: (meta.difficulty as Sidequest["difficulty"]) || "Medium",
    xp: 0,
    completed: false,
    imageUrl: (payload.imageUrl as string) || item.coverImage || "",
    questLog: (payload.questLog as string) || "",
  };
}

function SkillsPageContent() {
  const {
    status, isAuthenticated, isAdmin,
    items: allSkills,
    fetchCmsItems: fetchCmsSkills,
    isCmsItem: isCmsSkill,
    deletingItem: deletingSkill,
    setDeletingItem: setDeletingSkill,
    isDeleting: isDeletingSkill,
    handleDeleteConfirm: handleDeleteSkillConfirm,
  } = useCmsPage({
    contentType: "skill",
    converter: cmsItemToSkill,
    staticItems: [],
    dedupeKey: (s) => s.id,
  });

  const {
    items: allSidequests,
    fetchCmsItems: fetchCmsSidequests,
    isCmsItem: isCmsSidequest,
    deletingItem: deletingSidequest,
    setDeletingItem: setDeletingSidequest,
    isDeleting: isDeletingSidequest,
    handleDeleteConfirm: handleDeleteSidequestConfirm,
  } = useCmsPage({
    contentType: "sidequest",
    converter: cmsItemToSidequest,
    staticItems: [],
    dedupeKey: (s) => s.id,
  });

  const [activeTab, setActiveTab] = useState<QuestType>("sidequest");
  const [selectedQuest, setSelectedQuest] = useState<Sidequest | null>(null);

  // CMS state — Skills
  const [showUploadSkill, setShowUploadSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillExperiment | null>(null);

  // CMS state — Sidequests
  const [showUploadSidequest, setShowUploadSidequest] = useState(false);
  const [editingSidequest, setEditingSidequest] = useState<Sidequest | null>(null);

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
      <div className="relative">
        <HeroSection />
        {isAdmin && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
            <button
              onClick={() => activeTab === "skill" ? setShowUploadSkill(true) : setShowUploadSidequest(true)}
              className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] px-5 py-2.5 rounded-md shadow-md transition-colors"
            >
              Add Content
            </button>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-20">
        
        {/* Filter Pills */}
        <div className="flex gap-3 mb-10 border-b border-gray-200 pb-6">
          <FilterPill
            active={activeTab === "sidequest"}
            onClick={() => setActiveTab("sidequest")}
            label="Sidequests"
            count={allSidequests.length}
          />
          <FilterPill
            active={activeTab === "skill"}
            onClick={() => setActiveTab("skill")}
            label="Skill Quests"
            count={allSkills.length}
          />
          {/* Removed inline admin button — now at top right */}
        </div>

        {/* Skill Quest Grid */}
        {activeTab === "skill" && (
          <div>
            {allSkills.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-gray-300 mb-2">No skill experiments yet</p>
                <p className="text-sm text-gray-400">
                  {isAdmin ? 'Add your first skill experiment to start tracking.' : 'Check back soon for skill experiments.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {allSkills.map((skill) => (
                  <div key={skill.id} className="relative group">
                    <SkillCard skill={skill} />
                    {isAdmin && isCmsSkill(skill) && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => setEditingSkill(skill)} className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeletingSkill(skill)} className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sidequest Grid */}
        {activeTab === "sidequest" && (
          <div>
            {allSidequests.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-gray-300 mb-2">No sidequests yet</p>
                <p className="text-sm text-gray-400">
                  {isAdmin ? 'Add your first sidequest to begin.' : 'Check back soon for new quests.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-8">
                {allSidequests.map((quest, index) => (
                  <div key={quest.id} className="relative group">
                    <QuestCard 
                      quest={quest} 
                      index={index}
                      onClick={() => setSelectedQuest(quest)} 
                    />
                    {isAdmin && isCmsSidequest(quest) && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => setEditingSidequest(quest)} className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeletingSidequest(quest)} className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

      {/* Detail Modal */}
      {selectedQuest && (
        <ContentRenderer
          type="split-detail"
          data={sidequestToContentData(selectedQuest)}
          onClose={() => setSelectedQuest(null)}
          layoutVariant="default"
        />
      )}

      {/* Admin: Upload/Edit/Delete Skill Modals */}
      {showUploadSkill && (
        <UploadSkillModal
          onClose={() => setShowUploadSkill(false)}
          onSuccess={() => { setShowUploadSkill(false); fetchCmsSkills(); }}
        />
      )}
      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSuccess={() => { setEditingSkill(null); fetchCmsSkills(); }}
        />
      )}
      {deletingSkill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Delete Skill Quest</h3>
            <p className="text-sm text-gray-600">Are you sure you want to delete &ldquo;{deletingSkill.name}&rdquo;? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeletingSkill(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteSkillConfirm} disabled={isDeletingSkill} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {isDeletingSkill ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin: Upload/Edit/Delete Sidequest Modals */}
      {showUploadSidequest && (
        <UploadSidequestModal
          onClose={() => setShowUploadSidequest(false)}
          onSuccess={() => { setShowUploadSidequest(false); fetchCmsSidequests(); }}
        />
      )}
      {editingSidequest && (
        <EditSidequestModal
          sidequest={editingSidequest}
          onClose={() => setEditingSidequest(null)}
          onSuccess={() => { setEditingSidequest(null); fetchCmsSidequests(); }}
        />
      )}
      {deletingSidequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Delete Sidequest</h3>
            <p className="text-sm text-gray-600">Are you sure you want to delete &ldquo;{deletingSidequest.title}&rdquo;? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeletingSidequest(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteSidequestConfirm} disabled={isDeletingSidequest} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {isDeletingSidequest ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
