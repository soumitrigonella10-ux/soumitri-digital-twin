"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/useAppStore";
import type { WishlistItem } from "@/types";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import { AddWishlistModal } from "@/components/wishlist/AddWishlistModal";
import { EditWishlistModal } from "@/components/wishlist/EditWishlistModal";
import { getContentByType, deleteContent } from "@/cms/actions";
import type { ContentItem as CmsContentItem } from "@/cms/types";
import {
  CategoryFilter,
  WishlistGrid,
} from "@/components/wishlist";

function cmsToWishlistItem(item: CmsContentItem): WishlistItem {
  const meta = item.metadata as Record<string, unknown>;
  const payload = item.payload as Record<string, unknown>;
  const result: WishlistItem = {
    id: item.id,
    name: item.title,
    category: (meta.category as WishlistItem["category"]) || "Other",
  };
  const brand = payload.brand as string;
  if (brand) result.brand = brand;
  const tags = meta.tags as string[];
  if (tags?.length) result.tags = tags;
  const imageUrl = (payload.imageUrl as string) || (item.coverImage as string);
  if (imageUrl) result.imageUrl = imageUrl;
  const websiteUrl = payload.websiteUrl as string;
  if (websiteUrl) result.websiteUrl = websiteUrl;
  const price = payload.price as number;
  if (price != null) result.price = price;
  const currency = payload.currency as string;
  if (currency) result.currency = currency;
  const priority = meta.priority as WishlistItem["priority"];
  if (priority) result.priority = priority;
  if (meta.purchased === true) result.purchased = true;
  return result;
}

// --- Hooks -------------------------------------------------
function useWishlistFilters(wishlist: WishlistItem[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tops");

  const filteredItems = useMemo(() => {
    const items = wishlist.filter((item) => item.category === selectedCategory);
    const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
    items.sort((a, b) => {
      const pA = priorityOrder[a.priority || "Medium"] ?? 0;
      const pB = priorityOrder[b.priority || "Medium"] ?? 0;
      return pB - pA;
    });
    return items;
  }, [wishlist, selectedCategory]);

  const groupedItems = useMemo(() => {
    return { [selectedCategory]: filteredItems };
  }, [filteredItems, selectedCategory]);

  return { selectedCategory, setSelectedCategory, filteredItems, groupedItems };
}

// --- Page Component ----------------------------------------
export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { data } = useAppStore();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  // CMS CRUD state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<WishlistItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cmsItems, setCmsItems] = useState<WishlistItem[]>([]);

  const isCmsItem = useCallback((item: WishlistItem) => item.id.startsWith("ci_"), []);

  const fetchCmsItems = useCallback(async () => {
    try {
      const items = await getContentByType("wishlist-item", { visibility: "published" });
      setCmsItems(items.map(cmsToWishlistItem));
    } catch (err) {
      console.error("Failed to load CMS wishlist items:", err);
    }
  }, []);

  useEffect(() => { fetchCmsItems(); }, [fetchCmsItems]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const result = await deleteContent(deletingItem.id);
      if (result.success) { setDeletingItem(null); fetchCmsItems(); }
      else { alert(result.error || "Failed to delete"); }
    } catch { alert("Failed to delete"); } finally { setIsDeleting(false); }
  }, [deletingItem, fetchCmsItems]);

  // Merge store + CMS wishlist items
  const mergedWishlist = useMemo(() => {
    const cmsNames = new Set(cmsItems.map(i => i.name.toLowerCase()));
    const storeFiltered = data.wishlist.filter(i => !cmsNames.has(i.name.toLowerCase()));
    return [...cmsItems, ...storeFiltered];
  }, [cmsItems, data.wishlist]);

  const { selectedCategory, setSelectedCategory, filteredItems, groupedItems } =
    useWishlistFilters(mergedWishlist);

  // Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600" />
      </div>
    );
  }

  // Shared grid + filter used by both views
  const sharedContent = (
    <>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="space-y-6">
        <WishlistGrid
          filteredItems={filteredItems}
          groupedItems={groupedItems}
          selectedCategory={selectedCategory}
          selectedItem={null}
          onSelectItem={() => {}}
          emptyMessage={
            session
              ? "No items in your wishlist yet."
              : `No ${selectedCategory.toLowerCase()} items found.`
          }
          isAdmin={isAdmin}
          isCmsItem={isCmsItem}
          onEditItem={setEditingItem}
          onDeleteItem={setDeletingItem}
        />
      </div>
    </>
  );

  // Public (unauthenticated) view
  if (!session) {
    return (
      <div className="min-h-screen muggu-bg">
        <EditorialNav currentSlug="wishlist" />
        <div className="container mx-auto py-8 space-y-6">
          {/* Header */}
          <header className="pt-20 pb-8 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
            <p
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-2"
              style={{ color: "#802626" }}
            >
              Inventory
            </p>
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-3"
              style={{ color: "#2D2424" }}
            >
              Wishlist
            </h1>
            <p
              className="font-sans text-base leading-relaxed max-w-xl"
              style={{ color: "#2D2424", opacity: 0.8 }}
            >
              A running list of objects I&apos;m considering
            </p>
          </header>

          {sharedContent}
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="pt-20 pb-8 relative">
            {isAdmin && (
              <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-[#802626] hover:bg-[#6b1f1f] px-5 py-2.5 rounded-md shadow-md transition-colors"
                >
                  Add Content
                </button>
              </div>
            )}
            <div>
              <p
                className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-2"
                style={{ color: "#802626" }}
              >
                Inventory
              </p>
              <h1
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-3"
                style={{ color: "#2D2424" }}
              >
                Wishlist
              </h1>
              <p
                className="font-sans text-base leading-relaxed max-w-xl"
                style={{ color: "#2D2424", opacity: 0.8 }}
              >
                A running list of objects I&apos;m considering
              </p>
            </div>
          </header>

          {sharedContent}
        </div>
      </div>



      {showAddModal && (
        <AddWishlistModal
          onClose={() => setShowAddModal(false)}
          onPublished={() => { setShowAddModal(false); fetchCmsItems(); }}
        />
      )}

      {editingItem && (
        <EditWishlistModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); fetchCmsItems(); }}
        />
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-lg text-gray-900 mb-2">Delete &ldquo;{deletingItem.name}&rdquo;?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
