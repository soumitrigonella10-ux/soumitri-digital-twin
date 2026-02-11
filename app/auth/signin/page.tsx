"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDemoMode = process.env.NODE_ENV === "development";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return;

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: next,
        redirect: false,
      });

      if (result?.error) {
        setError("Sign-in failed. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Sign-in is currently unavailable.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Sign In
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email to receive a magic link.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
          <Mail className="w-8 h-8 text-gray-600 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">Check your email</p>
            <p className="text-xs text-gray-500">
              A sign-in link has been sent to {email}
            </p>
            {isDemoMode && (
              <p className="text-xs text-gray-400 mt-2">
                Demo mode: check your server console for the magic link.
              </p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue with Email
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center">{error}</p>
          )}
        </form>
      )}

      <p className="text-center text-xs text-gray-400">
        Access is intentional. Reach out if you qualify.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
