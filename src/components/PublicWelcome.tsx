"use client"

import { signIn } from "next-auth/react"
import { Eye, Brain, Lock, Key } from "lucide-react"
import { CurationGrid } from "@/components/CurationGrid"

export function PublicWelcome() {
  const isDemoMode = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen curation-bg">
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

          {/* Public Curation Grid */}
          <div className="max-w-5xl mx-auto">
            <CurationGrid />
          </div>
        </div>
      </div>
    </div>
  )
}