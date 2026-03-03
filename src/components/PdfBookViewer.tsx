"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// PDF Book Viewer — Responsive PDF viewer.
//
// • Landscape / desktop → two pages side-by-side
//   like an open book with page-turn controls.
// • Portrait / phone   → single page with vertical
//   scroll through all pages.
//
// Uses PDF.js loaded from CDN to avoid webpack
// bundling issues with Next.js.
// ─────────────────────────────────────────────

interface PdfBookViewerProps {
  /** Path to the PDF file (relative to public/, e.g. "/pdfs/travel/kyoto-2025.pdf") */
  pdfUrl: string;
  /** Title for accessibility */
  title?: string;
  /** Optional className for the container */
  className?: string;
}

/** Minimal type surface for a PDF.js document (CDN-loaded, no @types available). */
interface PdfDocument {
  numPages: number;
  getPage(pageNum: number): Promise<PdfPage>;
}

interface PdfPage {
  getViewport(options: { scale: number }): PdfViewport;
  render(options: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): { promise: Promise<void> };
}

interface PdfViewport {
  width: number;
  height: number;
}

/** Minimal type surface for the PDF.js library entry point. */
interface PdfJsLib {
  getDocument(url: string): { promise: Promise<PdfDocument> };
}

// ── Portrait / landscape detection ──────────

function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      // Consider portrait when viewport width < height, or width ≤ 768 px
      setIsPortrait(
        window.innerWidth < window.innerHeight || window.innerWidth <= 768
      );
    };
    check();
    window.addEventListener("resize", check);

    // Also listen to the orientation change API when available
    const mql = window.matchMedia("(orientation: portrait)");
    const handleMql = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches || window.innerWidth <= 768);
    };
    mql.addEventListener("change", handleMql);

    return () => {
      window.removeEventListener("resize", check);
      mql.removeEventListener("change", handleMql);
    };
  }, []);

  return isPortrait;
}

/**
 * Converts a public PDF path to an API route path
 * so the file is served without frame-blocking headers.
 * Handles both /pdfs/... and /uploads/... paths.
 */
function toApiUrl(pdfUrl: string): string {
  const stripped = pdfUrl.startsWith("/uploads/")
    ? pdfUrl.replace(/^\//, "")
    : pdfUrl.replace(/^\/pdfs\//, "");
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

/** Render a single PDF page onto a canvas, scaled to fit a given height. */
async function renderPageToCanvas(
  pdfDoc: PdfDocument,
  pageNum: number,
  canvas: HTMLCanvasElement,
  maxHeight: number
): Promise<void> {
  if (pageNum < 1 || pageNum > pdfDoc.numPages) {
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
  const scale = maxHeight / viewport.height;
  const scaledViewport = page.getViewport({ scale });

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
}

/** Render a single PDF page onto a canvas, scaled to fit a given width. */
async function renderPageToCanvasWidth(
  pdfDoc: PdfDocument,
  pageNum: number,
  canvas: HTMLCanvasElement,
  maxWidth: number
): Promise<void> {
  if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / viewport.width;
  const scaledViewport = page.getViewport({ scale });

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
}

// ─────────────────────────────────────────────
// Portrait mode: vertical single-page scroll
// ─────────────────────────────────────────────

function PortraitScrollView({
  pdfDoc,
  numPages,
  pdfUrl,
}: {
  pdfDoc: PdfDocument;
  numPages: number;
  pdfUrl: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [rendered, setRendered] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure the ref array has the right length
  if (canvasRefs.current.length !== numPages) {
    canvasRefs.current = Array(numPages).fill(null);
  }

  // Render visible pages via IntersectionObserver
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNum = Number(
            (entry.target as HTMLElement).dataset.page
          );
          if (entry.isIntersecting && !rendered.has(pageNum)) {
            const canvas = canvasRefs.current[pageNum - 1];
            if (canvas) {
              const containerWidth = scrollRef.current?.clientWidth ?? 360;
              const canvasWidth = containerWidth - 32; // 16px padding each side
              renderPageToCanvasWidth(pdfDoc, pageNum, canvas, canvasWidth);
              setRendered((prev) => new Set(prev).add(pageNum));
            }
          }
        });
      },
      { root: scrollRef.current, rootMargin: "200px 0px", threshold: 0.01 }
    );

    canvasRefs.current.forEach((canvas) => {
      if (canvas) observer.observe(canvas);
    });

    return () => observer.disconnect();
  }, [pdfDoc, numPages, rendered]);

  // Re-render all visible pages on resize (orientation change etc.)
  useEffect(() => {
    const handler = () => {
      setRendered(new Set()); // clear rendered set to trigger re-render via observer
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Track current page via scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = container.querySelectorAll<HTMLCanvasElement>(
        "canvas[data-page]"
      );
      let closestPage = 1;
      let closestDist = Infinity;
      const containerTop = container.scrollTop + container.clientHeight / 3;

      children.forEach((child) => {
        const dist = Math.abs(child.offsetTop - containerTop);
        if (dist < closestDist) {
          closestDist = dist;
          closestPage = Number(child.dataset.page);
        }
      });
      setCurrentPage(closestPage);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPage = (page: number) => {
    const canvas = canvasRefs.current[page - 1];
    if (canvas && scrollRef.current) {
      canvas.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-stone-800/5"
        style={{ minHeight: 0, WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col items-center gap-3 py-4 px-4">
          {Array.from({ length: numPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <canvas
                key={pageNum}
                ref={(el) => { canvasRefs.current[i] = el; }}
                data-page={pageNum}
                className="rounded-sm shadow-sm border border-stone-200/60 w-full"
                style={{
                  // Placeholder aspect ratio before render
                  aspectRatio: "0.707 / 1",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Floating page indicator + quick nav */}
      {numPages > 0 && (
        <div className="flex items-center gap-3 py-2.5 px-4 bg-white/90 backdrop-blur-sm border-t border-stone-200 w-full justify-center">
          <button
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronUp className="w-4 h-4 text-stone-600" />
          </button>

          <span className="font-editorial text-xs text-stone-500 tabular-nums min-w-[80px] text-center">
            Page {currentPage} of {numPages}
          </span>

          <button
            onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages}
            className="p-1.5 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronDown className="w-4 h-4 text-stone-600" />
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 ml-3 text-stone-500 hover:text-stone-800 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.1em]">
              Open
            </span>
          </a>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Landscape mode: two-page book spread
// ─────────────────────────────────────────────

function LandscapeSpreadView({
  pdfDoc,
  numPages,
  pdfUrl,
}: {
  pdfDoc: PdfDocument;
  numPages: number;
  pdfUrl: string;
}) {
  const [spread, setSpread] = useState(0);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderSpread = useCallback(async () => {
    if (!pdfDoc || !leftCanvasRef.current || !rightCanvasRef.current || !containerRef.current) return;

    const containerHeight = containerRef.current.clientHeight || 600;
    const leftPage = spread * 2 + 1;
    const rightPage = spread * 2 + 2;

    await Promise.all([
      renderPageToCanvas(pdfDoc, leftPage, leftCanvasRef.current, containerHeight),
      renderPageToCanvas(pdfDoc, rightPage, rightCanvasRef.current, containerHeight),
    ]);
  }, [pdfDoc, spread]);

  useEffect(() => {
    renderSpread();
  }, [renderSpread]);

  useEffect(() => {
    const handler = () => renderSpread();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [renderSpread]);

  const totalSpreads = Math.ceil(numPages / 2);
  const leftPageNum = spread * 2 + 1;
  const rightPageNum = Math.min(spread * 2 + 2, numPages);

  return (
    <>
      {/* Book spread area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-stone-800/5 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <div className="flex items-center gap-[2px] p-1">
          {/* Left page */}
          <div className="relative">
            <canvas
              ref={leftCanvasRef}
              className="rounded-l-sm shadow-[inset_-8px_0_12px_-6px_rgba(0,0,0,0.08)] border border-stone-200/60"
              style={{ width: "auto" }}
            />
            <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-stone-900/[0.06] to-transparent pointer-events-none" />
          </div>

          {/* Spine / gutter */}
          <div className="w-[3px] self-stretch bg-gradient-to-b from-stone-300/40 via-stone-400/60 to-stone-300/40 rounded-full flex-shrink-0" />

          {/* Right page */}
          <div className="relative">
            <canvas
              ref={rightCanvasRef}
              className="rounded-r-sm shadow-[inset_8px_0_12px_-6px_rgba(0,0,0,0.08)] border border-stone-200/60"
              style={{ width: "auto" }}
            />
            <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-stone-900/[0.06] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Controls bar */}
      {numPages > 0 && (
        <div className="flex items-center gap-4 py-3 px-4 bg-white/90 backdrop-blur-sm border-t border-stone-200 w-full justify-center">
          <button
            onClick={() => setSpread((s) => Math.max(0, s - 1))}
            disabled={spread <= 0}
            className="p-1.5 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous pages"
          >
            <ChevronLeft className="w-4 h-4 text-stone-600" />
          </button>

          <span className="font-editorial text-xs text-stone-500 tabular-nums min-w-[100px] text-center">
            {leftPageNum === rightPageNum
              ? `Page ${leftPageNum} of ${numPages}`
              : `Pages ${leftPageNum}\u2013${rightPageNum} of ${numPages}`}
          </span>

          <button
            onClick={() => setSpread((s) => Math.min(totalSpreads - 1, s + 1))}
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
    </>
  );
}

// ─────────────────────────────────────────────
// Main export — switches between portrait / landscape
// ─────────────────────────────────────────────

export function PdfBookViewer({
  pdfUrl,
  title = "PDF Document",
  className = "",
}: PdfBookViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isPortrait = useIsPortrait();
  const apiUrl = toApiUrl(pdfUrl);

  // Load the PDF document
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const pdfjsLib = (await loadPdfJs()) as PdfJsLib;
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
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-stone-800/5">
          <div className="animate-pulse text-stone-400 font-editorial text-sm">
            Loading journal&hellip;
          </div>
        </div>
      ) : pdfDoc ? (
        isPortrait ? (
          <PortraitScrollView pdfDoc={pdfDoc} numPages={numPages} pdfUrl={pdfUrl} />
        ) : (
          <LandscapeSpreadView pdfDoc={pdfDoc} numPages={numPages} pdfUrl={pdfUrl} />
        )
      ) : null}
    </div>
  );
}
