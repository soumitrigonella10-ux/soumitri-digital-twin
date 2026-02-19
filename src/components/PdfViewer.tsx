"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

// ─────────────────────────────────────────────
// PDF Viewer — Embeds a PDF via an API route that serves
// the file with permissive framing headers (SAMEORIGIN).
// ─────────────────────────────────────────────
// Usage: Place PDFs in public/pdfs/essays/ or public/pdfs/travel/
// Then reference them as "/pdfs/essays/my-essay.pdf" etc.
// The viewer rewrites the path to /api/pdf/... to bypass
// the strict X-Frame-Options: DENY on static assets.
// ─────────────────────────────────────────────

interface PdfViewerProps {
  /** Path to the PDF file (relative to public/, e.g. "/pdfs/essays/on-taste.pdf") */
  pdfUrl: string;
  /** Title for accessibility */
  title?: string;
  /** Optional className for the container */
  className?: string;
}

/**
 * Converts a public PDF path like "/pdfs/travel/kyoto-2025.pdf"
 * into an API route path "/api/pdf/travel/kyoto-2025.pdf"
 * so the file is served without frame-blocking headers.
 */
function toApiUrl(pdfUrl: string): string {
  // Strip leading "/pdfs/" and route through the API
  const stripped = pdfUrl.replace(/^\/pdfs\//, "");
  return `/api/pdf/${stripped}`;
}

export function PdfViewer({ pdfUrl, title = "PDF Document", className = "" }: PdfViewerProps) {
  const [hasError, setHasError] = useState(false);
  const apiUrl = toApiUrl(pdfUrl);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 px-6 ${className}`}>
        <FileText className="w-16 h-16 text-stone-300 mb-4" />
        <p className="font-editorial text-sm text-stone-500 mb-2">
          Unable to display PDF inline
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-editorial text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2 transition-colors"
        >
          Open PDF in new tab
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <iframe
        src={`${apiUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={title}
        className="w-full h-full border-0 rounded-sm"
        style={{ minHeight: "70vh" }}
        onError={() => setHasError(true)}
      />
      {/* Fallback link */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all text-stone-600 hover:text-stone-900"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.1em]">
            Open PDF
          </span>
        </a>
      </div>
    </div>
  );
}
