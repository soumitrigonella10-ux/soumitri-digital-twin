"use client";

import { useState, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import {
  CategoryFilter,
  WishlistGrid,
  ItemDetailModal,
  AddItemModal,
} from "@/components/wishlist";

// --- Hooks -------------------------------------------------
function useWishlistFilters(wishlist: WishlistItem[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredItems = useMemo(() => {
    let items = [...wishlist];
    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    items.sort((a, b) => {
      const pA = priorityOrder[a.priority || "Medium"];
      const pB = priorityOrder[b.priority || "Medium"];
      if (pA !== pB) return pB - pA;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
    return items;
  }, [wishlist, selectedCategory]);

  const groupedItems = useMemo(() => {
    if (selectedCategory !== "All") return { [selectedCategory]: filteredItems };
    return filteredItems.reduce(
      (acc, item) => {
        (acc[item.category] ??= []).push(item);
        return acc;
      },
      {} as Record<string, WishlistItem[]>
    );
  }, [filteredItems, selectedCategory]);

  return { selectedCategory, setSelectedCategory, filteredItems, groupedItems };
}

// --- Page Component ----------------------------------------
export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { data, addWishlistItem, removeWishlistItem, markWishlistItemPurchased } = useAppStore();

  const { selectedCategory, setSelectedCategory, filteredItems, groupedItems } =
    useWishlistFilters(data.wishlist);

  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async (email: string) => {
    setSignInError(null);
    setIsSigningIn(true);
    try {
      const result = await signIn("email", { email, callbackUrl: "/", redirect: false });
      if (result?.error) {
        setSignInError("Sign-in failed. Please try again later.");
      } else if (result?.ok) {
        setSignInError("Check your email (or server console in demo mode) for the magic link!");
      }
    } catch {
      setSignInError("Sign-in is currently unavailable. Please try again later.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeWishlistItem(id);
    setSelectedItem(null);
  };

  const handleMarkPurchased = (id: string) => {
    markWishlistItemPurchased(id);
    setSelectedItem(null);
  };

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
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          emptyMessage={
            session
              ? "Add some items to your wishlist to get started!"
              : selectedCategory === "All"
                ? "No wishlist items available yet."
                : `No ${selectedCategory.toLowerCase()} items found.`
          }
        />
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isAuthenticated={!!session}
          onClose={() => setSelectedItem(null)}
          {...(session ? { onMarkPurchased: handleMarkPurchased } : {})}
          {...(session ? { onRemove: handleRemoveItem } : {})}
          {...(!session
            ? {
                onSignInPrompt: () => {
                  const email = prompt("Enter your email to sign in:");
                  if (email) handleSignIn(email);
                },
              }
            : {})}
        />
      )}
    </>
  );

  // Public (unauthenticated) view
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 space-y-6">
          {/* Welcome header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Soumitri Digital Twin
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your personal digital twin for daily routines, fitness, and wardrobe management.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-blue-800 mb-3">
                Sign in to add items to your wishlist and access all features
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get("email") as string;
                  if (email) handleSignIn(email);
                }}
                className="flex gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSigningIn ? "Signing in..." : "Sign In"}
                </button>
              </form>
              {signInError && (
                <p
                  className={`mt-2 text-sm ${signInError.includes("Check your") ? "text-green-600" : "text-red-600"}`}
                >
                  {signInError}
                </p>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Public Wishlist</h2>
              <p className="text-muted-foreground">Browse items - sign in to add your own</p>
            </div>
          </div>

          {sharedContent}
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="text-muted-foreground">Keep track of items you want to buy</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {sharedContent}

        {showAddModal && <AddItemModal onAdd={handleAddItem} onClose={() => setShowAddModal(false)} />}
      </div>
    </AuthenticatedLayout>
  );
}
