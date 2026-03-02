"use client";

// ─────────────────────────────────────────────────────────────
// Content Manager — Main CMS admin UI
//
// Orchestrates the content management workflow:
//   1. Type selector (tabs for each registered content type)
//   2. Content list with search/filter
//   3. Create/Edit form with type-specific fields
//   4. Preview before publish
//
// All mutations go through server actions (src/cms/actions.ts)
// which independently validate auth + schema on every call.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { BookOpen, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentList } from "./ContentList";
import { ContentForm } from "./ContentForm";
import { useToast } from "@/components/ToastProvider";
// Import content type registrations (side-effect: registers "essay" etc.)
import "@/cms/content-types";
import { getAllContentTypes } from "@/cms/registry";
import type { ContentItem } from "@/cms/types";
import {
  createContent,
  updateContent,
  deleteContent,
  listAllContent,
  getContentStats,
} from "@/cms/actions";
import { cn } from "@/lib/utils";

type View = "list" | "create" | "edit";

interface ContentStats {
  type: string;
  total: number;
  published: number;
  drafts: number;
}

export function ContentManager() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("list");
  const [activeType, setActiveType] = useState<string>("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ContentStats[]>([]);
  const [contentTypes] = useState(() => getAllContentTypes());

  // Set initial active type
  useEffect(() => {
    if (contentTypes.length > 0 && !activeType) {
      const first = contentTypes[0];
      if (first) setActiveType(first.type);
    }
  }, [contentTypes, activeType]);

  // ── Fetch data ──────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    if (!activeType) return;
    setIsLoading(true);
    try {
      const [itemsResult, statsResult] = await Promise.all([
        listAllContent({ type: activeType }),
        getContentStats(),
      ]);
      setItems(itemsResult ?? []);
      setStats(statsResult ?? []);
    } catch (err) {
      toast({
        title: "Failed to load content",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeType, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Get active type config ──────────────────────────────────
  const activeTypeConfig = contentTypes.find((t) => t.type === activeType);

  // ── Handlers ────────────────────────────────────────────────
  const handleCreateNew = useCallback(() => {
    setEditingItem(null);
    setView("create");
  }, []);

  const handleEdit = useCallback((item: ContentItem) => {
    setEditingItem(item);
    setView("edit");
  }, []);

  const handleDelete = useCallback(
    async (item: ContentItem) => {
      const result = await deleteContent(item.id);
      if (result.success) {
        toast({
          title: "Deleted",
          description: `"${item.title}" has been removed`,
          variant: "success",
        });
        fetchItems();
      } else {
        toast({
          title: "Delete failed",
          description: result.error || "Something went wrong",
          variant: "error",
        });
      }
    },
    [fetchItems, toast]
  );

  const handleSave = useCallback(
    async (data: Record<string, unknown>) => {
      const isEdit = !!data.id;
      const result = isEdit
        ? await updateContent(data)
        : await createContent(data);

      if (result.success) {
        setView("list");
        fetchItems();
      }

      return result;
    },
    [fetchItems]
  );

  const handleBack = useCallback(() => {
    setView("list");
    setEditingItem(null);
  }, []);

  // ── Render ──────────────────────────────────────────────────

  if (contentTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">
            No content types registered. Add types in{" "}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
              src/cms/content-types/
            </code>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats Overview ── */}
      {view === "list" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentTypes.map((ct) => {
            const ctStats = stats.find((s) => s.type === ct.type);
            return (
              <Card
                key={ct.type}
                className={cn(
                  "cursor-pointer transition-all",
                  activeType === ct.type
                    ? "border-gray-900 ring-1 ring-gray-900"
                    : "hover:border-gray-300"
                )}
                onClick={() => setActiveType(ct.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {ct.pluralLabel}
                    </span>
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {ctStats?.total ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {ctStats?.published ?? 0} published · {ctStats?.drafts ?? 0}{" "}
                    drafts
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Content Type Tabs (visible only on list view) ── */}
      {view === "list" && contentTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {contentTypes.map((ct) => (
            <Button
              key={ct.type}
              variant={activeType === ct.type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(ct.type)}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {ct.pluralLabel}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchItems}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ── Main Content Area ── */}
      {activeTypeConfig && view === "list" && (
        <ContentList
          items={items}
          typeConfig={activeTypeConfig}
          isLoading={isLoading}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {activeTypeConfig && (view === "create" || view === "edit") && (
        <ContentForm
          typeConfig={activeTypeConfig}
          existingItem={view === "edit" ? editingItem : null}
          onSave={handleSave}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
