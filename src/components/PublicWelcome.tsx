"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Eye, Brain, Lock, Key, Mail, Loader2 } from "lucide-react"
import { CurationGrid } from "@/components/CurationGrid"
import { EditorialNav } from "@/components/EditorialNav"

export function PublicWelcome() {
  const isDemoMode = process.env.NODE_ENV === 'development'
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="min-h-screen muggu-bg">
      <EditorialNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
              Welcome to Soumitri Digital Twin
            </h1>
            <p className="font-telugu text-lg md:text-xl text-gray-600 mt-2 tracking-wide">
              సౌమిత్రి డిజిటల్ ట్విన్
            </p>
          </div>

          {isDemoMode && (
            <div className="bg-telugu-marigold/10 border-l-4 border-telugu-marigold text-gray-800 p-4 mb-8 text-left max-w-2xl mx-auto rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-telugu-marigold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Demo Mode Active</h3>
                  <div className="mt-2 text-sm text-gray-700">
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
              <div className="telugu-card p-4">
                <div className="w-8 h-8 bg-telugu-marigold/10 rounded-xl flex items-center justify-center mb-3">
                  <Eye className="w-4 h-4 icon-brass" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What Are You Seeing?</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Only the wishlist.</p>
                  <p className="text-sm text-gray-600">So you know what I like.</p>
                  <p className="text-sm text-gray-600">Not how I operate.</p>
                </div>
              </div>

              {/* What's Inside Card */}
              <div className="telugu-card p-4">
                <div className="w-8 h-8 bg-telugu-marigold/10 rounded-xl flex items-center justify-center mb-3">
                  <Brain className="w-4 h-4 icon-brass" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What's Inside</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Routines. Inventory.</p>
                  <p className="text-sm text-gray-600">Calculated.</p>
                  <p className="text-sm text-gray-600">Curated. Controlled.</p>
                </div>
              </div>

              {/* Why It's Hidden Card */}
              <div className="telugu-card p-4">
                <div className="w-8 h-8 bg-telugu-marigold/10 rounded-xl flex items-center justify-center mb-3">
                  <Lock className="w-4 h-4 icon-brass" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Why It's Hidden</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Private systems aren't</p>
                  <p className="text-sm text-gray-600">public displays.</p>
                </div>
              </div>

              {/* Access Card */}
              <div className="telugu-card p-4">
                <div className="w-8 h-8 bg-telugu-marigold/10 rounded-xl flex items-center justify-center mb-3">
                  <Key className="w-4 h-4 icon-brass" />
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
              <div className="telugu-card p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Have access?
                </h2>
                
                {submitted ? (
                  <div className="text-center space-y-4 py-4">
                    <Mail className="w-10 h-10 text-gray-600 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-base font-medium text-gray-900">Check your email</p>
                      <p className="text-sm text-gray-500">
                        A sign-in link has been sent to <span className="font-medium text-gray-700">{submittedEmail}</span>
                      </p>
                      {isDemoMode && (
                        <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded-lg">
                          Demo mode: check your server console for the magic link.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setError(null); }}
                      className="text-sm text-gray-500 hover:text-gray-700 underline mt-2"
                    >
                      Try a different email
                    </button>
                  </div>
                ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setError(null)
                    setLoading(true)
                    const formData = new FormData(e.currentTarget)
                    const email = formData.get('email') as string
                    if (email) {
                      try {
                        const result = await signIn('email', { email, callbackUrl: '/inventory/wishlist', redirect: false })
                        if (result?.error) {
                          setError("Sign-in failed. Please try again.")
                        } else {
                          setSubmittedEmail(email)
                          setSubmitted(true)
                        }
                      } catch {
                        setError("Sign-in is currently unavailable. Please try again.")
                      } finally {
                        setLoading(false)
                      }
                    } else {
                      setLoading(false)
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
                      disabled={loading}
                      className="w-full px-4 py-4 border-2 border-telugu-marigold rounded-xl focus:ring-2 focus:ring-telugu-turmeric focus:border-telugu-turmeric text-gray-900 placeholder-gray-500 disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-kavi w-full py-4 px-6 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      "Sign In with Email"
                    )}
                  </button>
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}
                </form>
                )}
                
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