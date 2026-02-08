"use client";

import { useState, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { Heart, Plus, Filter, X, ShoppingBag, ExternalLink, Trash2, Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WishlistItem, WishlistCategory } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { data, addWishlistItem, updateWishlistItem, removeWishlistItem, markWishlistItemPurchased } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
    name: "",
    category: "Tops",
    imageUrl: "",
    websiteUrl: "",
    price: undefined,
    currency: "INR",
    notes: "",
    priority: "Medium",
  });

  const categories: (WishlistCategory | "All")[] = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Jewellery"];

  // Filter items
  const filteredItems = useMemo(() => {
    let items = [...data.wishlist];

    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Sort by priority and date added
    items.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority || "Medium"];
      const priorityB = priorityOrder[b.priority || "Medium"];
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(); // Newest first
    });

    return items;
  }, [data.wishlist, selectedCategory]);

  // Group by category for display
  const groupedItems = useMemo(() => {
    if (selectedCategory !== "All") {
      return { [selectedCategory]: filteredItems };
    }
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, WishlistItem[]>);
  }, [filteredItems, selectedCategory]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) return;
    
    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category as WishlistCategory,
      imageUrl: newItem.imageUrl || undefined,
      websiteUrl: newItem.websiteUrl || undefined,
      price: newItem.price || undefined,
      currency: newItem.currency || "INR",
      notes: newItem.notes || undefined,
      priority: newItem.priority || "Medium",
      dateAdded: new Date().toISOString(),
      purchased: false,
    };
    
    addWishlistItem(item);
    setNewItem({
      name: "",
      category: "Tops",
      imageUrl: "",
      websiteUrl: "",
      price: undefined,
      currency: "INR",
      notes: "",
      priority: "Medium",
    });
    setShowAddModal(false);
  };

  const handleRemoveItem = (id: string) => {
    removeWishlistItem(id);
    setSelectedItem(null);
  };

  const handleMarkPurchased = (id: string) => {
    markWishlistItemPurchased(id);
    setSelectedItem(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    // Show wishlist without authentication - public access
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 space-y-6">
          {/* Header with welcome message for unauthenticated users */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Soumitri Digital Twin
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your personal digital twin for daily routines, fitness, and wardrobe management.
            </p>
            
            {/* Sign in prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-blue-800 mb-3">
                Sign in to add items to your wishlist and access all features
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const email = formData.get('email') as string
                  if (email) {
                    signIn('email', { email, callbackUrl: '/' })
                  }
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          {/* Wishlist Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Public Wishlist</h2>
              <p className="text-muted-foreground">
                Browse items - sign in to add your own
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        item.purchased && "opacity-75 bg-green-50",
                        selectedItem?.id === item.id && "ring-2 ring-blue-500"
                      )}
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4">
                        {item.imageUrl && (
                          <div className="aspect-square mb-3 rounded-md overflow-hidden bg-gray-100 relative">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                              quality={90}
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                            {item.purchased && (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority || "Medium"}
                            </Badge>
                            {item.price && (
                              <Badge variant="outline">
                                ₹{item.price}
                              </Badge>
                            )}
                          </div>
                          {item.websiteUrl && (
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <ExternalLink className="h-3 w-3" />
                              <span className="truncate">Visit Site</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    {selectedCategory === "All" 
                      ? "No wishlist items available yet."
                      : `No ${selectedCategory.toLowerCase()} items found.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Limited Item Detail Modal for unauthenticated users */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedItem.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedItem(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedItem.imageUrl && (
                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                      <Image
                        src={selectedItem.imageUrl}
                        alt={selectedItem.name}
                        fill
                        className="object-cover"
                        quality={95}
                        priority
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div><strong>Category:</strong> {selectedItem.category}</div>
                    {selectedItem.price && (
                      <div><strong>Price:</strong> ₹{selectedItem.price}</div>
                    )}
                    <div><strong>Priority:</strong> {selectedItem.priority}</div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <strong>Notes:</strong>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedItem.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    {selectedItem.websiteUrl && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(selectedItem.websiteUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Site
                      </Button>
                    )}
                    
                    {/* Sign in prompt for actions */}
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => signIn('email', { callbackUrl: '/' })}
                    >
                      Sign In to Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show authenticated wishlist with sidebar
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="text-muted-foreground">
              Keep track of items you want to buy
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Items */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      item.purchased && "opacity-75 bg-green-50",
                      selectedItem?.id === item.id && "ring-2 ring-blue-500"
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-4">
                      {item.imageUrl && (
                        <div className="aspect-square mb-3 rounded-md overflow-hidden bg-gray-100 relative">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                            quality={90}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                          {item.purchased && (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority || "Medium"}
                          </Badge>
                          {item.price && (
                            <Badge variant="outline">
                              ₹{item.price}
                            </Badge>
                          )}
                        </div>
                        {item.websiteUrl && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate">
                              {item.websiteUrl.includes('levi.com') ? 'Levi\'s' :
                               item.websiteUrl.includes('everlane.com') ? 'Everlane' :
                               item.websiteUrl.includes('stories.com') ? '& Other Stories' :
                               item.websiteUrl.includes('bluer.com') ? 'Bluer' :
                               item.websiteUrl.includes('zara.com') ? 'Zara' :
                               item.websiteUrl.includes('hm.com') ? 'H&M' :
                               item.websiteUrl.includes('uniqlo.com') ? 'Uniqlo' :
                               item.websiteUrl.includes('nike.com') ? 'Nike' :
                               item.websiteUrl.includes('adidas.com') ? 'Adidas' :
                               'Brand'}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  Add some items to your wishlist to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedItem.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedItem(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItem.imageUrl && (
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                    <Image
                      src={selectedItem.imageUrl}
                      alt={selectedItem.name}
                      fill
                      className="object-cover"
                      quality={95}
                      priority
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div><strong>Category:</strong> {selectedItem.category}</div>
                  {selectedItem.price && (
                    <div><strong>Price:</strong> ₹{selectedItem.price}</div>
                  )}
                  <div><strong>Priority:</strong> {selectedItem.priority}</div>
                  <div><strong>Added:</strong> {new Date(selectedItem.dateAdded).toLocaleDateString()}</div>
                  {selectedItem.purchased && selectedItem.purchaseDate && (
                    <div><strong>Purchased:</strong> {new Date(selectedItem.purchaseDate).toLocaleDateString()}</div>
                  )}
                </div>

                {selectedItem.notes && (
                  <div>
                    <strong>Notes:</strong>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedItem.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedItem.websiteUrl && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(selectedItem.websiteUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Site
                    </Button>
                  )}
                  
                  {!selectedItem.purchased && (
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => handleMarkPurchased(selectedItem.id)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Mark Purchased
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRemoveItem(selectedItem.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Wishlist Item</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as WishlistCategory })}
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Jewellery">Jewellery</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Website URL</label>
                  <Input
                    value={newItem.websiteUrl}
                    onChange={(e) => setNewItem({ ...newItem, websiteUrl: e.target.value })}
                    placeholder="https://example.com/product"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      type="number"
                      value={newItem.price || ""}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newItem.priority}
                      onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Additional notes about this item..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} className="flex-1" disabled={!newItem.name || !newItem.category}>
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}