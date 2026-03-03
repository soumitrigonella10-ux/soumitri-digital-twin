// ========================================
// Custom Hook: useCmsPage
//
// Extracts the common CMS editorial page lifecycle shared
// across essay, artifact, inspiration, design-theology,
// travel-log, consumption, skill, sidequest, and lore pages:
//
//   • Session / auth state (useSession → isAuthenticated, isAdmin)
//   • CMS data fetching   (getContentByType → cmsItems)
//   • Static + CMS merge   (deduplication by key, CMS wins)
//   • CMS item detection   (ci_ id prefix)
//   • Delete confirmation   (deleteContent + optimistic UI)
// ========================================

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { getContentByType, deleteContent } from "@/cms/actions";
import type { ContentItem } from "@/cms/types";

// ── Options ──────────────────────────────────────────────────

export interface UseCmsPageOptions<T extends { id: string }> {
  /** CMS content type key, e.g. "essay", "artifact" */
  contentType: string;
  /** Convert a CMS ContentItem → domain type. Index is the position in the result set. */
  converter: (item: ContentItem, index: number) => T;
  /** Static / seed-data items to merge with CMS items */
  staticItems: T[];
  /**
   * Key extractor for deduplication (CMS wins on conflict).
   * If omitted the two arrays are simply concatenated.
   */
  dedupeKey?: (item: T) => string;
}

// ── Return value ─────────────────────────────────────────────

export interface UseCmsPageReturn<T extends { id: string }> {
  /** Raw next-auth session object */
  session: ReturnType<typeof useSession>["data"];
  /** next-auth loading status */
  status: ReturnType<typeof useSession>["status"];
  isAuthenticated: boolean;
  isAdmin: boolean;

  /** Merged static + CMS items (deduplicated when dedupeKey is set) */
  items: T[];
  /** Raw CMS-sourced items (before merge) */
  cmsItems: T[];
  /** True until the first CMS fetch completes */
  isLoadingCms: boolean;
  /** Trigger a re-fetch of CMS items */
  fetchCmsItems: () => Promise<void>;
  /** Returns true when the item was created through the CMS */
  isCmsItem: (item: T) => boolean;

  /** The item currently pending delete-confirmation (null = dialog closed) */
  deletingItem: T | null;
  setDeletingItem: (item: T | null) => void;
  /** True while the delete request is in-flight */
  isDeleting: boolean;
  /** Execute the delete, refresh CMS items, and close the dialog on success */
  handleDeleteConfirm: () => Promise<void>;
}

// ── Hook ─────────────────────────────────────────────────────

export function useCmsPage<T extends { id: string }>({
  contentType,
  converter,
  staticItems,
  dedupeKey,
}: UseCmsPageOptions<T>): UseCmsPageReturn<T> {
  const { data: session, status } = useSession();
  const [cmsItems, setCmsItems] = useState<T[]>([]);
  const [isLoadingCms, setIsLoadingCms] = useState(true);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthenticated = !!session;
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "admin";

  // Keep converter in a ref so fetchCmsItems has a stable identity even when
  // the caller passes an inline function.
  const converterRef = useRef(converter);
  converterRef.current = converter;

  const fetchCmsItems = useCallback(async () => {
    try {
      const { items } = await getContentByType(contentType, {
        visibility: "published",
      });
      setCmsItems(items.map((item, i) => converterRef.current(item, i)));
    } catch (err) {
      console.error(`Failed to load CMS ${contentType} items:`, err);
    } finally {
      setIsLoadingCms(false);
    }
  }, [contentType]);

  useEffect(() => {
    fetchCmsItems();
  }, [fetchCmsItems]);

  // Merge static + CMS, deduplicating by key (CMS wins)
  const items = useMemo(() => {
    if (!dedupeKey) {
      return [...cmsItems, ...staticItems];
    }
    const cmsKeys = new Set(cmsItems.map(dedupeKey));
    const dedupedStatic = staticItems.filter(
      (item) => !cmsKeys.has(dedupeKey(item)),
    );
    return [...cmsItems, ...dedupedStatic];
  }, [cmsItems, staticItems, dedupeKey]);

  // Check if an item was created through the CMS
  const isCmsItem = useCallback((item: T) => item.id.startsWith("ci_"), []);

  // Delete confirmation handler
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const result = await deleteContent(deletingItem.id);
      if (result.success) {
        setDeletingItem(null);
        fetchCmsItems();
      } else {
        alert(result.error || "Failed to delete");
      }
    } catch {
      alert("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  }, [deletingItem, fetchCmsItems]);

  return {
    session,
    status,
    isAuthenticated,
    isAdmin,
    items,
    cmsItems,
    isLoadingCms,
    fetchCmsItems,
    isCmsItem,
    deletingItem,
    setDeletingItem,
    isDeleting,
    handleDeleteConfirm,
  };
}
