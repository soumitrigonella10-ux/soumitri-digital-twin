"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────
// PDF Book Viewer — Renders two pages side-by-side
// like an open book. Uses PDF.js loaded from CDN
// to avoid webpack bundling issues with Next.js.
// ─────────────────────────────────────────────

interface PdfBookViewerProps {
  /** Path to the PDF file (relative to public/, e.g. "/pdfs/travel/kyoto-2025.pdf") */
  pdfUrl: string;
  /** Title for accessibility */
  title?: string;
  /** Optional className for the container */
  className?: string;
}

/**
 * Converts a public PDF path to an API route path
 * so the file is served without frame-blocking headers.
 */
function toApiUrl(pdfUrl: string): string {
  const stripped = pdfUrl.replace(/^\/pdfs\//, "");
  return `/api/pdf/${stripped}`;
}

// Dynamically load PDF.js from CDN (only once)
let pdfjsLoadPromise: Promise<unknown> | null = null;

function loadPdfJs(): Promise<unknown> {
  if (pdfjsLoadPromise) return pdfjsLoadPromise;

  pdfjsLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as unknown as Record<string, unknown>).pdfjsLib) {
      resolve((window as unknown as Record<string, unknown>).pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
    script.type = "module";

    // PDF.js v4 ESM doesn't set window.pdfjsLib, so we use an inline module import
    const loader = document.createElement("script");
    loader.type = "module";
    loader.textContent = `
      import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
      window.__pdfjsLib = pdfjsLib;
      window.dispatchEvent(new Event("pdfjsReady"));
    `;

    document.head.appendChild(loader);

    const onReady = () => {
      window.removeEventListener("pdfjsReady", onReady);
      resolve((window as unknown as Record<string, unknown>).__pdfjsLib);
    };
    window.addEventListener("pdfjsReady", onReady);

    // Timeout fallback
    setTimeout(() => {
      if (!(window as unknown as Record<string, unknown>).__pdfjsLib) {
        reject(new Error("PDF.js failed to load"));
      }
    }, 10000);
  });

  return pdfjsLoadPromise;
}

async function renderPageToCanvas(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc: any,
  pageNum: number,
  canvas: HTMLCanvasElement,
  maxHeight: number
): Promise<void> {
  if (pageNum < 1 || pageNum > pdfDoc.numPages) {
    // Clear canvas for out-of-range pages
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = maxHeight * 0.707; // A4 aspect ratio
      canvas.height = maxHeight;
      ctx.fillStyle = "#faf9f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1 });

  // Scale to fit the desired height
  const scale = maxHeight / viewport.height;
  const scaledViewport = page.getViewport({ scale });

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await page.render({
    canvasContext: ctx,
    viewport: scaledViewport,
  }).promise;
}

export function PdfBookViewer({
  pdfUrl,
  title = "PDF Document",
  className = "",
}: PdfBookViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [spread, setSpread] = useState(0); // 0 = pages 1-2, 1 = pages 3-4, etc.
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const apiUrl = toApiUrl(pdfUrl);

  // Load the PDF
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjsLib = (await loadPdfJs()) as any;
        const doc = await pdfjsLib.getDocument(apiUrl).promise;
        if (!cancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("PDF load error:", err);
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [apiUrl]);

  // Render the current spread
  const renderSpread = useCallback(async () => {
    if (!pdfDoc || !leftCanvasRef.current || !rightCanvasRef.current || !containerRef.current) return;

    const containerHeight = containerRef.current.clientHeight || 600;
    const canvasHeight = Math.min(containerHeight - 40, 800);

    const leftPage = spread * 2 + 1;
    const rightPage = spread * 2 + 2;

    await Promise.all([
      renderPageToCanvas(pdfDoc, leftPage, leftCanvasRef.current, canvasHeight),
      renderPageToCanvas(pdfDoc, rightPage, rightCanvasRef.current, canvasHeight),
    ]);
  }, [pdfDoc, spread]);

  useEffect(() => {
    renderSpread();
  }, [renderSpread]);

  // Also re-render on window resize
  useEffect(() => {
    const handler = () => renderSpread();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [renderSpread]);

  const totalSpreads = Math.ceil(numPages / 2);
  const leftPageNum = spread * 2 + 1;
  const rightPageNum = Math.min(spread * 2 + 2, numPages);

  const goToPrevSpread = () => setSpread((s) => Math.max(0, s - 1));
  const goToNextSpread = () => setSpread((s) => Math.min(totalSpreads - 1, s + 1));

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 px-6 ${className}`}>
        <FileText className="w-16 h-16 text-stone-300 mb-4" />
        <p className="font-editorial text-sm text-stone-500 mb-2">Unable to display PDF</p>
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
    <div className={`flex flex-col w-full h-full ${className}`} role="document" aria-label={title}>
      {/* Book spread area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-stone-800/5 overflow-hidden"
        style={{ minHeight: "75vh" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-pulse text-stone-400 font-editorial text-sm">
              Loading journal&hellip;
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-[2px] p-4">
            {/* Left page */}
            <div className="relative">
              <canvas
                ref={leftCanvasRef}
                className="rounded-l-sm shadow-[inset_-8px_0_12px_-6px_rgba(0,0,0,0.08)] border border-stone-200/60"
                style={{ maxHeight: "80vh", width: "auto" }}
              />
              {/* Page curl shadow on the spine side */}
              <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-stone-900/[0.06] to-transparent pointer-events-none" />
            </div>

            {/* Spine / gutter */}
            <div className="w-[3px] h-[75vh] bg-gradient-to-b from-stone-300/40 via-stone-400/60 to-stone-300/40 rounded-full flex-shrink-0" />

            {/* Right page */}
            <div className="relative">
              <canvas
                ref={rightCanvasRef}
                className="rounded-r-sm shadow-[inset_8px_0_12px_-6px_rgba(0,0,0,0.08)] border border-stone-200/60"
                style={{ maxHeight: "80vh", width: "auto" }}
              />
              {/* Page curl shadow on the spine side */}
              <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-stone-900/[0.06] to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      {numPages > 0 && (
        <div className="flex items-center gap-4 py-3 px-4 bg-white/90 backdrop-blur-sm border-t border-stone-200 w-full justify-center">
          <button
            onClick={goToPrevSpread}
            disabled={spread <= 0}
            className="p-1.5 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous pages"
          >
            <ChevronLeft className="w-4 h-4 text-stone-600" />
          </button>

          <span className="font-editorial text-xs text-stone-500 tabular-nums min-w-[100px] text-center">
            {leftPageNum === rightPageNum
              ? `Page ${leftPageNum} of ${numPages}`
              : `Pages ${leftPageNum}–${rightPageNum} of ${numPages}`}
          </span>

          <button
            onClick={goToNextSpread}
            disabled={spread >= totalSpreads - 1}
            className="p-1.5 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next pages"
          >
            <ChevronRight className="w-4 h-4 text-stone-600" />
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 ml-4 text-stone-500 hover:text-stone-800 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.1em]">
              Open PDF
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
