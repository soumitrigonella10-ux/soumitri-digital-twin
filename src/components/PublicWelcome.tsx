"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Filter, ExternalLink, Check, Mail, Heart, Tag, Eye, Brain, Lock, Key } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { WishlistCategory } from "@/types"
import { cn } from "@/lib/utils"

export function PublicWelcome() {
  const isDemoMode = process.env.NODE_ENV === 'development'
  const { data } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  
  const categories: (WishlistCategory | "All")[] = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Jewellery"]
  
  // Filter items
  const filteredItems = useMemo(() => {
    let items = [...data.wishlist]

    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory)
    }

    // Sort by priority and date added
    items.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      const priorityA = priorityOrder[a.priority || "Medium"]
      const priorityB = priorityOrder[b.priority || "Medium"]
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    })

    return items
  }, [data.wishlist, selectedCategory])

  // Group by category for display
  const groupedItems = useMemo(() => {
    if (selectedCategory !== "All") {
      return { [selectedCategory]: filteredItems }
    }
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, typeof filteredItems>)
  }, [filteredItems, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
              Welcome to Soumitri Digital Twin
            </h1>
          </div>

          {isDemoMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Magic links will be printed to the server console instead of being emailed.</p>
                    <p className="mt-1">After clicking "Sign In", check your terminal for the magic link URL.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left Side - Info Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* What Are You Seeing Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Eye className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What Are You Seeing?</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Only the wishlist.</p>
                  <p className="text-sm text-gray-600">So you know what I like.</p>
                  <p className="text-sm text-gray-600">Not how I operate.</p>
                </div>
              </div>

              {/* What's Inside Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Brain className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What's Inside</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Routines. Inventory.</p>
                  <p className="text-sm text-gray-600">Calculated.</p>
                  <p className="text-sm text-gray-600">Curated. Controlled.</p>
                </div>
              </div>

              {/* Why It's Hidden Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Why It's Hidden</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Private systems aren't</p>
                  <p className="text-sm text-gray-600">public displays.</p>
                </div>
              </div>

              {/* Access Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Key className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Access</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Access is intentional.</p>
                  <p className="text-sm text-gray-600">Reach out if you qualify.</p>
                </div>
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Have access?
                </h2>
                
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const email = formData.get('email') as string
                    if (email) {
                      try {
                        await signIn('email', { email, callbackUrl: '/inventory/wishlist', redirect: false })
                      } catch {
                        // Silently handle auth errors — user can retry
                        console.warn('Sign-in request failed')
                      }
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg"
                  >
                    Sign In with Email
                  </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 tracking-wide font-medium">
                    ACCESS YOUR WISHLIST • WARDROBE • ROUTINES
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Public Wishlist Section */}
          {data.wishlist.length > 0 && (
            <div className="mt-16 space-y-6">
              {/* Wishlist Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Public Wishlist</h2>
                <p className="text-gray-600">
                  Browse items - sign in to add your own
                </p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="space-y-6">
                {selectedCategory === "All" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all",
                          item.purchased && "opacity-75"
                        )}
                      >
                        {/* Image area with priority badge */}
                        <div className="relative bg-gray-200">
                          {item.priority && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-sm border",
                                item.priority === "High" && "bg-rose-50/90 text-rose-700 border-rose-200",
                                item.priority === "Medium" && "bg-amber-50/90 text-amber-700 border-amber-200",
                                item.priority === "Low" && "bg-slate-50/90 text-slate-600 border-slate-200"
                              )}>
                                {item.priority} Priority
                              </span>
                            </div>
                          )}

                          {item.imageUrl ? (
                            <div className="aspect-square relative">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-contain"
                                quality={90}
                              />
                            </div>
                          ) : (
                            <div className="aspect-square flex items-center justify-center">
                              <Heart className="h-12 w-12 text-gray-400" />
                            </div>
                          )}

                          {item.purchased && (
                            <div className="absolute top-4 right-4 z-10">
                              <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-0.5 shadow" />
                            </div>
                          )}
                        </div>

                        {/* Details area */}
                        <div className="px-3 pt-3 pb-2 space-y-2">
                          {/* Brand + Name/Price row */}
                          <div>
                            {item.brand && (
                              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
                            )}
                            <div className="flex items-baseline justify-between gap-3">
                              <h3 className="font-semibold text-sm text-gray-900 leading-tight">{item.name}</h3>
                              {item.price != null && (
                                <span className="text-base font-bold text-gray-900 whitespace-nowrap">₹{item.price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>

                          {/* Tags + external link */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                              {item.tags && item.tags[0] && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                  {item.tags[0]}
                                </span>
                              )}
                              {item.tags && item.tags[1] && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 inline-flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {item.tags[1]}
                                </span>
                              )}
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  Object.entries(groupedItems).length > 0 ? (
                    Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category} className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all",
                                item.purchased && "opacity-75"
                              )}
                            >
                              {/* Image area with priority badge */}
                              <div className="relative bg-gray-200">
                                {item.priority && (
                                  <div className="absolute top-4 left-4 z-10">
                                    <span className={cn(
                                      "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-sm border",
                                      item.priority === "High" && "bg-rose-50/90 text-rose-700 border-rose-200",
                                      item.priority === "Medium" && "bg-amber-50/90 text-amber-700 border-amber-200",
                                      item.priority === "Low" && "bg-slate-50/90 text-slate-600 border-slate-200"
                                    )}>
                                      {item.priority} Priority
                                    </span>
                                  </div>
                                )}

                                {item.imageUrl ? (
                                  <div className="aspect-square relative">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                      className="object-contain"
                                      quality={90}
                                    />
                                  </div>
                                ) : (
                                    <div className="aspect-square flex items-center justify-center">
                                    <Heart className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}

                                {item.purchased && (
                                  <div className="absolute top-4 right-4 z-10">
                                    <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-0.5 shadow" />
                                  </div>
                                )}
                              </div>

                              {/* Details area */}
                              <div className="px-3 pt-3 pb-2 space-y-2">
                                {/* Brand + Name/Price row */}
                                <div>
                                  {item.brand && (
                                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
                                  )}
                                  <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">{item.name}</h3>
                                    {item.price != null && (
                                      <span className="text-base font-bold text-gray-900 whitespace-nowrap">₹{item.price.toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Tags + external link */}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-2">
                                    {item.tags && item.tags[0] && (
                                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                        {item.tags[0]}
                                      </span>
                                    )}
                                    {item.tags && item.tags[1] && (
                                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 inline-flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        {item.tags[1]}
                                      </span>
                                    )}
                                  </div>
                                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No items in this category yet</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}