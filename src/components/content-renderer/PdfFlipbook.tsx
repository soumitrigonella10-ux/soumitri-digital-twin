"use client";

// ========================================
// PdfFlipbook — Book / Travel-Log Page-Turn Experience
//
// Wraps PdfBookViewer in the shared modal chrome with an optional
// metadata sidebar (à la JournalModal). Uses shared tokens for
// consistent backdrop, typography, and spacing.
// ========================================

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfBookViewer } from "@/components/PdfBookViewer";
import { colors, typography, motion as motionTokens, radii } from "./tokens";
import type { PdfFlipbookProps } from "./types";

export function PdfFlipbook({
  data,
  layoutVariant = "default",
  onClose,
  className,
}: PdfFlipbookProps) {
  const [isClosing, setIsClosing] = useState(false);

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = useCallback(() => {
    if (!onClose) return;
    setIsClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const showSidebar =
    layoutVariant !== "compact" &&
    (data.metadata?.length || data.subtitle || data.tags?.length);

  if (!data.pdfUrl) {
    return (
      <div
        className="flex items-center justify-center h-64 text-stone-400 font-editorial text-sm"
      >
        No PDF available
      </div>
    );
  }

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          key="pdf-flipbook-backdrop"
          initial={motionTokens.backdropIn}
          animate={motionTokens.backdropAnimate}
          exit={motionTokens.backdropIn}
          transition={motionTokens.backdropTransition}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={data.title}
        >
          <motion.div
            initial={motionTokens.containerIn}
            animate={motionTokens.containerAnimate}
            exit={motionTokens.containerExit}
            transition={motionTokens.containerTransition}
            className={cn(
              "relative w-[96vw] h-[92vh] lg:w-[94vw] lg:h-[90vh] flex overflow-hidden",
              radii.modal,
              className
            )}
            style={{ backgroundColor: colors.bg.warm }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            {onClose && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-600 hover:text-stone-900 hover:bg-white transition-all shadow-sm"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* ── Optional sidebar ── */}
            {showSidebar && (
              <aside
                className="hidden lg:flex flex-col w-56 xl:w-64 flex-shrink-0 border-r overflow-y-auto p-6"
                style={{ borderColor: colors.border.medium, backgroundColor: colors.bg.paper }}
              >
                {/* Title */}
                <h1
                  className="font-serif text-2xl xl:text-3xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {data.title}
                </h1>

                {/* Subtitle */}
                {data.subtitle && (
                  <p
                    className="font-editorial text-sm mb-4"
                    style={{ color: colors.accent.oxblood, letterSpacing: "0.1em" }}
                  >
                    {data.subtitle}
                  </p>
                )}

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {data.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={cn(
                          "px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] font-medium",
                          radii.pill,
                          tag.className ?? "bg-stone-100 text-stone-500"
                        )}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                {data.metadata?.map((m, i) => (
                  <div key={m.label}>
                    {i > 0 && (
                      <div
                        className="my-3 h-px"
                        style={{ backgroundColor: colors.border.medium }}
                      />
                    )}
                    <div
                      className={typography.label}
                      style={{ color: colors.text.tan }}
                    >
                      {m.label}
                    </div>
                    <div
                      className="font-editorial text-sm mt-0.5"
                      style={{ color: colors.text.primary }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}

                {/* Tracking label */}
                {data.trackingLabel && (
                  <>
                    <div
                      className="my-3 h-px"
                      style={{ backgroundColor: colors.border.medium }}
                    />
                    <span
                      className={cn(typography.label, "italic")}
                      style={{ color: colors.text.tan }}
                    >
                      {data.trackingLabel}
                    </span>
                  </>
                )}
              </aside>
            )}

            {/* ── PDF viewer area ── */}
            <div className="flex-1 h-full">
              <PdfBookViewer
                pdfUrl={data.pdfUrl}
                title={data.title}
                className="h-full rounded-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
