"use client";

// ─────────────────────────────────────────────────────────────
// Content List — Lists all content items with type filter & actions
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  FileEdit,
  Star,
  Archive,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem, ContentTypeConfig } from "@/cms/types";
import { cn } from "@/lib/utils";

interface ContentListProps {
  items: ContentItem[];
  typeConfig: ContentTypeConfig;
  isLoading: boolean;
  onCreateNew: () => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
}

const VISIBILITY_ICON = {
  draft: FileEdit,
  published: Globe,
  archived: Archive,
} as const;

const VISIBILITY_BADGE: Record<string, "warning" | "success" | "secondary"> = {
  draft: "warning",
  published: "success",
  archived: "secondary",
};

export function ContentList({
  items,
  typeConfig,
  isLoading,
  onCreateNew,
  onEdit,
  onDelete,
}: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisibility, setFilterVisibility] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Filter items ────────────────────────────────────────────
  const filtered = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVisibility =
      filterVisibility === "all" || item.visibility === filterVisibility;

    return matchesSearch && matchesVisibility;
  });

  // ── Stats ───────────────────────────────────────────────────
  const stats = {
    total: items.length,
    published: items.filter((i) => i.visibility === "published").length,
    drafts: items.filter((i) => i.visibility === "draft").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {typeConfig.pluralLabel}
          </h2>
          <p className="text-sm text-gray-500">
            {stats.total} total · {stats.published} published · {stats.drafts}{" "}
            drafts
          </p>
        </div>
        <Button size="sm" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New {typeConfig.label}
        </Button>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "published", "draft", "archived"].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVisibility(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                filterVisibility === v
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? `No ${typeConfig.pluralLabel.toLowerCase()} yet`
                : "No items match your filters"}
            </p>
            {items.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onCreateNew}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first {typeConfig.label.toLowerCase()}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const VisibilityIcon =
              VISIBILITY_ICON[item.visibility as keyof typeof VISIBILITY_ICON] ||
              FileEdit;
            const isDeleting = deleteConfirm === item.id;
            const metadata = item.metadata as Record<string, string>;

            return (
              <Card
                key={item.id}
                className={cn(
                  "transition-colors hover:border-gray-300",
                  isDeleting && "border-red-200 bg-red-50"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Cover thumbnail */}
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <BookOpen className="h-6 w-6 text-gray-300" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {item.isFeatured && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Badge variant={VISIBILITY_BADGE[item.visibility] || "secondary"} className="text-[10px] px-1.5 py-0">
                          <VisibilityIcon className="h-2.5 w-2.5 mr-0.5" />
                          {item.visibility}
                        </Badge>
                        {metadata.category && (
                          <span className="truncate">{String(metadata.category)}</span>
                        )}
                        <span className="text-gray-300">·</span>
                        <span>/{item.slug}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isDeleting ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              onDelete(item);
                              setDeleteConfirm(null);
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(item.id)}
                            title="Delete"
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
