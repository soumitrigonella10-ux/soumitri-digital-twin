"use client"

import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/HeroSection"
import { BentoDashboard } from "@/components/bento"
import { EditorialNav } from "@/components/EditorialNav"

export default function PublicPage() {
  const { data: session, status } = useSession()
  const isDemoMode = process.env.NODE_ENV === 'development'
  const router = useRouter()

  // Auto-redirect authenticated users to Today page
  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session, router])

  if (status === "loading" || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          {session && <p className="text-gray-600">Redirecting to your dashboard...</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <EditorialNav currentSlug="public" />
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Archive Section */}
      <section id="sidequests" className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdfaf3' }}>
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 mb-4 tracking-tight">
              The Archive
            </h2>
            <p className="text-gray-600 font-light text-lg">
              Curated collection of projects, writings, and explorations
            </p>
          </div>
          <BentoDashboard />
        </div>
      </section>

      {/* 3. Sign In Section */}
      <section id="signin" className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Feature tiles */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Daily Routines</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage your skin care, hair care, body care, and wellness routines with personalized schedules.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fitness & Nutrition</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Track workouts, meal planning, and nutrition goals to maintain a healthy lifestyle.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Wardrobe Management</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Organize your clothing, plan outfits, and manage your wardrobe inventory efficiently.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Archive</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Curate essays, projects, and reflections in your personal digital archive.
                </p>
              </div>
            </div>

            {/* Right: Sign in */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 mb-6 tracking-tight">
                Sign In
              </h2>
              <p className="text-gray-600 font-light text-lg mb-12">
                Access your personal digital space
              </p>
              
              {isDemoMode && (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 p-6 mb-8 text-left max-w-md lg:mx-0 mx-auto rounded-lg">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Mode</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Magic links will be printed to the server console.</p>
                        <p>Try: <code className="bg-white px-2 py-0.5 rounded text-xs border border-gray-200">soumitri.gonella10@gmail.com</code></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="max-w-md lg:mx-0 mx-auto">
                <button
                  onClick={() => signIn("email")}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light py-4 px-8 rounded-lg transition-all tracking-wide uppercase text-sm"
                >
                  Sign In with Email
                </button>
                
                <p className="mt-6 text-sm text-gray-500 font-light">
                  We&apos;ll send you a secure magic link to sign in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}