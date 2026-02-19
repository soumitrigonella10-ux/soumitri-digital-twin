"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { EditorialNav } from "@/components/EditorialNav";
import {
  CategoryFilter,
  WishlistGrid,
  AddItemModal,
} from "@/components/wishlist";

// --- Hooks -------------------------------------------------
function useWishlistFilters(wishlist: WishlistItem[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tops");

  const filteredItems = useMemo(() => {
    let items = wishlist.filter((item) => item.category === selectedCategory);
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    items.sort((a, b) => {
      const pA = priorityOrder[a.priority || "Medium"];
      const pB = priorityOrder[b.priority || "Medium"];
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
  const { data, addWishlistItem } = useAppStore();

  const { selectedCategory, setSelectedCategory, filteredItems, groupedItems } =
    useWishlistFilters(data.wishlist);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddItem = (item: WishlistItem) => {
    addWishlistItem(item);
    setShowAddModal(false);
  };

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
              ? "Add some items to your wishlist to get started!"
              : `No ${selectedCategory.toLowerCase()} items found.`
          }
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
          <header className="pt-20 pb-8">
            <div className="flex items-center justify-between">
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
              <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </header>

          {sharedContent}

          {showAddModal && <AddItemModal onAdd={handleAddItem} onClose={() => setShowAddModal(false)} />}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
