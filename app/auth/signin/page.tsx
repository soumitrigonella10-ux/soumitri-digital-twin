"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";

// Map Auth.js error codes to user-friendly messages
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "The server is misconfigured (database or email transport). Please try again in a few minutes — if this persists, contact the admin.",
  AccessDenied:
    "This email is not authorized to sign in, or the ALLOWED_EMAIL environment variable is not configured on the server.",
  Verification:
    "The magic link has expired or was already used. Request a new one.",
  Default: "An unexpected sign-in error occurred. Please try again.",
};

// Errors that won't resolve by retrying with the same email
const NON_RETRYABLE_ERRORS = new Set(["Configuration", "AccessDenied"]);

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const urlError = searchParams.get("error") ?? null;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(urlError);
  const [error, setError] = useState<string | null>(
    urlError
      ? (AUTH_ERROR_MESSAGES[urlError] ?? AUTH_ERROR_MESSAGES.Default)
      : null
  );
  const isDemoMode = process.env.NODE_ENV === "development";
  const isNonRetryable = NON_RETRYABLE_ERRORS.has(errorCode ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return;

    try {
      const result = await signIn("nodemailer", {
        email,
        redirectTo: next,
        redirect: false,
      });

      if (result?.error) {
        const code = result.error;
        setErrorCode(code);
        setError(
          AUTH_ERROR_MESSAGES[code] ??
            `Sign-in failed (${code}). Please try again.`
        );
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
              disabled={isNonRetryable}
              className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNonRetryable ? "Temporarily Unavailable" : "Continue with Email"}
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
