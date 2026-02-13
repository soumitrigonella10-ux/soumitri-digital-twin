"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  ArrowLeft,
  Lock,
  Globe,
  ExternalLink,
} from "lucide-react";
import { getTopicBySlug } from "@/data/topics";
import { getItemsByTopic, getPublicItemsByTopic, CurationItem } from "@/data/items";
import { cn } from "@/lib/utils";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

function TopicPageContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = params.slug as string;

  const topic = getTopicBySlug(slug);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Set initial active tab
  useEffect(() => {
    if (topic?.subTabs && topic.subTabs.length > 0 && !activeTab) {
      const firstTab = topic.subTabs[0];
      if (firstTab) setActiveTab(firstTab.id);
    }
  }, [topic, activeTab]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // 404 — topic not found
  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Not Found</h1>
          <p className="text-sm text-gray-500">This page does not exist.</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // Access control: private topic + not logged in → preview mode
  const isAuthenticated = !!session;
  const showPreview = !topic.isPublic && !isAuthenticated;
  const canViewFull = topic.isPublic || isAuthenticated;

  // Get items based on access
  const getVisibleItems = (subTabId?: string): CurationItem[] => {
    if (canViewFull) {
      return getItemsByTopic(slug, subTabId);
    }
    // Preview: show public items only (limited)
    return getPublicItemsByTopic(slug, subTabId).slice(0, 3);
  };

  const currentItems = getVisibleItems(activeTab || undefined);

  const pageContent = (
    <div className={cn(isAuthenticated ? "bg-gray-50" : "min-h-screen bg-gray-50")}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back nav — only show for unauthenticated users (authenticated have sidebar) */}
        {!isAuthenticated && (
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {topic.title}
            </h1>
            {/* Layer badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                topic.isPublic
                  ? "bg-gray-50 text-gray-600 border-gray-200"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              )}
            >
              {topic.isPublic ? (
                <>
                  <Globe className="w-3 h-3" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Private
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-gray-500">{topic.description}</p>
        </div>

        {/* Sub-tabs (if present) */}
        {topic.subTabs && topic.subTabs.length > 0 && (
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex gap-6 -mb-px">
              {topic.subTabs
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-3 text-sm font-medium border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
            </nav>
          </div>
        )}

        {/* Preview lock banner */}
        {showPreview && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-center space-y-3">
            <Lock className="w-5 h-5 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              This content requires access. Sign in to view the full page.
            </p>
            <button
              onClick={() => signIn("email", { callbackUrl: `/${slug}` })}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Sign in to access
            </button>
          </div>
        )}

        {/* Content grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "bg-white rounded-2xl border border-gray-200 shadow-sm p-5",
                  "transition-all duration-200 hover:shadow-md hover:border-gray-300"
                )}
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                )}
                {item.date && (
                  <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">No items yet.</p>
          </div>
        )}

        {/* Preview truncation notice */}
        {showPreview && currentItems.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
              Showing limited preview. Sign in for full access.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Wrap in AuthenticatedLayout when logged in (provides sidebar),
  // otherwise render standalone for public visitors
  if (isAuthenticated) {
    return <AuthenticatedLayout>{pageContent}</AuthenticatedLayout>;
  }

  return pageContent;
}

export default function TopicPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <TopicPageContent />
    </Suspense>
  );
}