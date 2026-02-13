// ========================================
// Next.js Not Found Page
// Shown when a route does not exist (404)
// ========================================

import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
          <Search className="h-10 w-10 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Check the URL or head back to your dashboard.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
