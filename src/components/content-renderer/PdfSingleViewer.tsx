"use client";

// ========================================
// PdfSingleViewer — Single-Page / Scroll Viewer
//
// Inspired by EssayModal: scroll-progress bar, glassmorphism header,
// embedded PdfViewer, rich text fallback. Uses shared tokens for
// consistent look & feel.
// ========================================

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent,
} from "react";
import { ArrowLeft, Share2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfViewer } from "@/components/PdfViewer";
import { colors, typography, radii } from "./tokens";
import type { PdfSingleViewerProps } from "./types";

export function PdfSingleViewer({
  data,
  layoutVariant = "default",
  onClose,
  className,
}: PdfSingleViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Mount animation
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setScrollProgress(max > 0 ? scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Close with animation
  const handleClose = useCallback(() => {
    if (!onClose) return;
    setIsClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  // ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: data.title,
        text: data.subtitle ?? data.title,
      });
    }
  };

  const isCentered = layoutVariant === "centered";
  const isCompact = layoutVariant === "compact";

  // Extract first tag as category label
  const categoryLabel = data.tags?.[0]?.label;
  // Extract date from metadata
  const dateLabel = data.metadata?.find(
    (m) => m.label.toLowerCase() === "date"
  )?.value;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end md:items-center justify-center",
        "essay-modal-backdrop",
        isVisible && !isClosing && "essay-modal-backdrop--visible",
        isClosing && "essay-modal-backdrop--closing"
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
    >
      {/* ── Progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-stone-200/40">
        <div
          className="h-full transition-[width] duration-75 ease-linear"
          style={{
            width: `${scrollProgress * 100}%`,
            backgroundColor: colors.accent.amber,
          }}
        />
      </div>

      {/* ── Modal container ── */}
      <div
        className={cn(
          "relative w-full max-h-[94vh] md:max-h-[92vh] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl",
          isCompact ? "max-w-[640px]" : isCentered ? "max-w-[720px]" : "max-w-[800px]",
          "essay-modal-container",
          isVisible && !isClosing && "essay-modal-container--visible",
          isClosing && "essay-modal-container--closing",
          className
        )}
        style={{ backgroundColor: colors.bg.paper }}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 essay-modal-header">
          <div className="flex items-center justify-between px-5 md:px-8 h-12">
            {/* Back */}
            {onClose && (
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors group"
                aria-label="Close"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Center title */}
            <span className="font-serif italic text-sm font-bold text-stone-600 absolute left-1/2 -translate-x-1/2 hidden sm:inline truncate max-w-[50%] text-center">
              {data.title}
            </span>

            {/* Right meta */}
            <div className="flex items-center gap-3">
              {categoryLabel && (
                <span
                  className="font-editorial text-[10px] font-bold uppercase tracking-[0.15em] hidden md:inline"
                  style={{ color: colors.accent.amber }}
                >
                  {categoryLabel}
                </span>
              )}
              {categoryLabel && dateLabel && (
                <span className="hidden md:inline w-1 h-1 rounded-full bg-stone-300" />
              )}
              {dateLabel && (
                <span className="font-editorial text-[10px] font-medium text-stone-400 hidden md:inline">
                  {dateLabel}
                </span>
              )}
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div
          ref={scrollRef}
          className="overflow-y-auto max-h-[calc(94vh-48px)] md:max-h-[calc(92vh-48px)] essay-modal-scroll"
        >
          {data.pdfUrl ? (
            <div className="px-4 md:px-8 pb-10" style={{ height: "75vh" }}>
              <PdfViewer
                pdfUrl={data.pdfUrl}
                title={data.title}
                className="rounded-lg overflow-hidden"
              />
            </div>
          ) : (
            <>
              {/* Lead image placeholder */}
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.via}, ${colors.gradient.to})`,
                  }}
                >
                  <BookOpen className="w-16 h-16 text-stone-400/30" />
                </div>
              </div>

              {/* Article */}
              <article className="px-6 md:px-12 lg:px-16">
                {/* Title block */}
                <header className="py-8 md:py-12">
                  {data.trackingLabel && (
                    <span
                      className={cn(typography.label, "mb-3 block")}
                      style={{ color: colors.accent.oxblood }}
                    >
                      {data.trackingLabel}
                    </span>
                  )}
                  <h1
                    className={typography.displayTitle}
                    style={{ color: colors.text.heading }}
                  >
                    {data.title}
                  </h1>
                  {data.subtitle && (
                    <p className="font-editorial text-lg text-stone-500 mt-3 leading-relaxed">
                      {data.subtitle}
                    </p>
                  )}

                  {/* Tags */}
                  {data.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {data.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={cn(
                            "px-3 py-1 text-xs font-medium",
                            radii.pill,
                            tag.className ?? "bg-stone-100 text-stone-500"
                          )}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/* Body */}
                <div className="pb-16 md:pb-20">
                  {data.body ? (
                    typeof data.body === "string" ? (
                      <p
                        className={cn(typography.body, "font-light")}
                        style={{
                          color: `${colors.text.heading}CC`,
                          lineHeight: "1.9",
                        }}
                      >
                        {data.body}
                      </p>
                    ) : (
                      data.body
                    )
                  ) : (
                    <p className="font-editorial text-stone-400 italic text-base">
                      {data.subtitle ?? "No content available."}
                    </p>
                  )}
                </div>

                {/* End mark */}
                <div className="flex justify-center pb-16">
                  <span className="font-serif italic text-2xl text-stone-300">
                    ◆
                  </span>
                </div>
              </article>
            </>
          )}

          {/* Footer */}
          <div className="px-6 md:px-12 lg:px-16 pb-10">
            <hr
              className="mb-8"
              style={{ borderColor: colors.border.light }}
            />
            <div className="flex items-center justify-between">
              <span className="font-serif italic text-sm" style={{ color: colors.text.tan }}>
                {data.footerLabel ?? "Soumitri Digital Twin"}
              </span>
              {onClose && (
                <button
                  onClick={handleClose}
                  className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Return →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
