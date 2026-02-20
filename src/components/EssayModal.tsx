"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent,
} from "react";
import {
  ArrowLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfViewer } from "@/components/PdfViewer";
import type { Essay } from "@/data/essays";
import { FONT_SIZES, EssayBlockRenderer } from "@/components/essay";

// ─────────────────────────────────────────────
// Main Modal Component
// ─────────────────────────────────────────────
interface EssayModalProps {
  essay: Essay;
  onClose: () => void;
}

export function EssayModal({ essay, onClose }: EssayModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ── Lock body scroll & animate in ──
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Trigger mount animation after one frame
    requestAnimationFrame(() => setIsVisible(true));

    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // ── Scroll progress tracking ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setScrollProgress(max > 0 ? scrollTop / max : 0);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close with animation ──
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 280);
  }, [onClose]);

  // ── ESC key ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // ── Click outside ──
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // ── Share ──
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: essay.title,
        text: essay.excerpt,
      });
    }
  };

  const currentFontSize = FONT_SIZES[fontIndex]!;

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
      aria-label={essay.title}
    >
      {/* ── Progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-stone-200/40">
        <div
          className="h-full bg-amber-600 transition-[width] duration-75 ease-linear"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ── Modal container ── */}
      <div
        className={cn(
          "relative w-full max-w-[800px] max-h-[94vh] md:max-h-[92vh] rounded-t-2xl md:rounded-2xl overflow-hidden",
          "bg-[#FCFCFA] shadow-2xl",
          "essay-modal-container",
          isVisible && !isClosing && "essay-modal-container--visible",
          isClosing && "essay-modal-container--closing"
        )}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 essay-modal-header">
          <div className="flex items-center justify-between px-5 md:px-8 h-12">
            {/* Left — back arrow */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors group"
              aria-label="Close"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Center — essay title */}
            <span className="font-serif italic text-sm font-bold text-stone-600 absolute left-1/2 -translate-x-1/2 hidden sm:inline truncate max-w-[50%] text-center">
              {essay.title}
            </span>

            {/* Right — category, date, share */}
            <div className="flex items-center gap-3">
              <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.15em] editorial-accent hidden md:inline">
                {essay.category}
              </span>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-stone-300" />
              <span className="font-editorial text-[10px] font-medium text-stone-400 hidden md:inline">
                {essay.date}
              </span>
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
        <div ref={scrollRef} className="overflow-y-auto max-h-[calc(94vh-48px)] md:max-h-[calc(92vh-48px)] essay-modal-scroll">
          {/* If essay has a PDF, show the embedded PDF viewer */}
          {essay.pdfUrl ? (
            <>
              {/* Embedded PDF */}
              <div className="px-4 md:px-8 pb-10" style={{ height: "75vh" }}>
                <PdfViewer pdfUrl={essay.pdfUrl} title={essay.title} className="rounded-lg overflow-hidden" />
              </div>
            </>
          ) : (
            <>
          {/* Lead image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 editorial-image-wrapper essay-scroll-reveal">
            <div className="absolute inset-0 bg-stone-200 editorial-image flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-stone-400/30" />
              </div>
            </div>
          </div>

          {/* Article content */}
          <article className="px-6 md:px-12 lg:px-16">
            {/* Body blocks */}
            <div className="pb-16 md:pb-20">
              {essay.body && essay.body.length > 0 ? (
                essay.body.map((block, i) => (
                  <EssayBlockRenderer
                    key={i}
                    block={block}
                    index={i}
                    bodyClass={currentFontSize.bodyClass}
                  />
                ))
              ) : (
                <p className={cn("font-editorial text-stone-500 italic", currentFontSize.bodyClass)}>
                  {essay.excerpt}
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

          {/* Footer within modal */}
          <div className="px-6 md:px-12 lg:px-16 pb-10">
            <hr className="editorial-rule mb-8" />
            <div className="flex items-center justify-between">
              <span className="font-serif italic text-sm text-stone-300">
                Soumitri Digital Twin
              </span>
              <button
                onClick={handleClose}
                className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 hover:text-stone-700 transition-colors"
              >
                Return to Essays →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
