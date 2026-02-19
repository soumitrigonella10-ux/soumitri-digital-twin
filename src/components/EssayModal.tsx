"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent,
} from "react";
import {
  X,
  ArrowLeft,
  Bookmark,
  Share2,
  Type,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfViewer } from "@/components/PdfViewer";
import type { Essay, EssayBlock } from "@/data/essays";

// ─────────────────────────────────────────────
// Typography size presets
// ─────────────────────────────────────────────
const FONT_SIZES = [
  { label: "S", bodyClass: "text-base leading-[1.6]" },
  { label: "M", bodyClass: "text-lg leading-[1.7]" },
  { label: "L", bodyClass: "text-xl leading-[1.75]" },
] as const;

// ─────────────────────────────────────────────
// Content block renderer
// ─────────────────────────────────────────────
function EssayBlockRenderer({
  block,
  index,
  bodyClass,
}: {
  block: EssayBlock;
  index: number;
  bodyClass: string;
}) {
  const isFirstParagraph = block.type === "paragraph" && index === 0;

  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={cn(
            "font-editorial text-stone-700 mb-6",
            bodyClass,
            isFirstParagraph && "essay-drop-cap"
          )}
        >
          {block.text}
        </p>
      );

    case "pullquote":
      return (
        <blockquote className="my-12 md:my-16 pl-6 border-l-[3px] border-amber-600">
          <p className="font-serif italic text-xl md:text-2xl text-stone-800 leading-snug">
            {block.text}
          </p>
          {block.attribution && (
            <cite className="block mt-3 font-editorial text-xs text-stone-400 uppercase tracking-[0.12em] not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    case "heading":
      return (
        <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900 mt-14 mb-6 leading-tight">
          {block.text}
        </h3>
      );

    case "separator":
      return (
        <div className="flex justify-center items-center gap-3 my-14">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>
      );
  }
}

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
  const [fontIndex, setFontIndex] = useState(0);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
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
            {/* Left — close */}
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.12em] hidden sm:inline">
                Return to Essays
              </span>
              <X className="w-4 h-4 sm:hidden" />
            </button>

            {/* Center — brand */}
            <span className="font-serif italic text-sm font-bold text-stone-400 absolute left-1/2 -translate-x-1/2 hidden sm:inline">
              Soumitri Digital Twin
            </span>

            {/* Right — tools */}
            <div className="flex items-center gap-1">
              {/* Typography picker */}
              <div className="relative">
                <button
                  onClick={() => setShowTypePicker((v) => !v)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    showTypePicker
                      ? "bg-stone-200 text-stone-700"
                      : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  )}
                  aria-label="Adjust typography"
                >
                  <Type className="w-4 h-4" />
                </button>

                {showTypePicker && (
                  <div className="absolute right-0 top-10 bg-white border border-stone-200 rounded-lg shadow-lg p-2 flex gap-1 z-20">
                    {FONT_SIZES.map((size, i) => (
                      <button
                        key={size.label}
                        onClick={() => {
                          setFontIndex(i);
                          setShowTypePicker(false);
                        }}
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center font-editorial text-xs font-semibold transition-colors",
                          fontIndex === i
                            ? "bg-stone-900 text-white"
                            : "text-stone-500 hover:bg-stone-100"
                        )}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked((v) => !v)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  isBookmarked
                    ? "text-amber-600 bg-amber-50"
                    : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                )}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>

              {/* Share */}
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
              {/* Article header (kept for context) */}
              <article className="px-6 md:px-12 lg:px-16">
                <div className="pt-12 md:pt-16 pb-8 md:pb-10">
                  <span className="font-editorial text-[11px] font-bold uppercase tracking-[0.2em] editorial-accent">
                    {essay.category}
                  </span>
                  <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.05] mt-4 mb-5">
                    {essay.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-stone-400 mb-6">
                    <span className="font-editorial text-xs font-medium">
                      {essay.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span className="font-editorial text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {essay.readingTime}
                    </span>
                  </div>
                  {essay.tags && essay.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {essay.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-editorial text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-50 border border-stone-100 px-2.5 py-1 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <hr className="editorial-rule mb-6" />
              </article>

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
            {/* Entry header */}
            <div className="pt-12 md:pt-16 pb-8 md:pb-10">
              {/* Category */}
              <span className="font-editorial text-[11px] font-bold uppercase tracking-[0.2em] editorial-accent">
                {essay.category}
              </span>

              {/* Title */}
              <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.05] mt-4 mb-5">
                {essay.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-stone-400 mb-6">
                <span className="font-editorial text-xs font-medium">
                  {essay.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span className="font-editorial text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {essay.readingTime}
                </span>
              </div>

              {/* Tags */}
              {essay.tags && essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {essay.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-editorial text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-50 border border-stone-100 px-2.5 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thin rule before body */}
            <hr className="editorial-rule mb-10" />

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
