"use client";

// ========================================
// Next.js Global Error Page
// Catches errors in the ROOT layout itself
// Must define its own <html> and <body> tags
// ========================================

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Can't import reportError here since root layout may be broken
    console.error("[GlobalError]", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: "#fee2e2" }}
          >
            <AlertTriangle
              className="h-7 w-7"
              style={{ color: "#dc2626" }}
            />
          </div>

          <div className="space-y-2">
            <h1
              className="text-2xl font-bold"
              style={{ color: "#111827" }}
            >
              Application Error
            </h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              A critical error occurred. The application needs to restart.
            </p>
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-colors"
            style={{ backgroundColor: "#4f46e5" }}
          >
            <RefreshCw className="h-4 w-4" />
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
}
