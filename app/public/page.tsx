"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function PublicPage() {
  const { data: session, status } = useSession()
  const isDemoMode = process.env.NODE_ENV === 'development'

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Soumitri Digital Twin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal digital twin for daily routines, fitness, and wardrobe management.
          </p>
          
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
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {session ? (
              <div>
                {/* Auto-redirect authenticated users to Today page */}
                {typeof window !== 'undefined' && (window.location.href = '/')}
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Redirecting to your Today dashboard...</p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Sign In to Get Started
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we&apos;ll send you a magic link to sign in.
                </p>
                {isDemoMode && (
                  <p className="text-sm text-orange-600 mb-4">
                    🧪 Demo Mode: Try <code className="bg-gray-100 px-2 py-1 rounded">soumitri.gonella10@gmail.com</code> for admin access
                  </p>
                )}
                <button
                  onClick={() => signIn("email")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Sign In with Email
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily Routines</h3>
              <p className="text-gray-600">
                Manage your skin care, hair care, body care, and wellness routines with personalized schedules.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fitness & Nutrition</h3>
              <p className="text-gray-600">
                Track workouts, meal planning, and nutrition goals to maintain a healthy lifestyle.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Wardrobe Management</h3>
              <p className="text-gray-600">
                Organize your clothing, plan outfits, and manage your wardrobe inventory efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}