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
import { colors, motion as motionTokens, radii } from "./tokens";
import type { PdfFlipbookProps } from "./types";

export function PdfFlipbook({
  data,
  layoutVariant: _layoutVariant = "default",
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

  if (!data.pdfUrl) {
    return (
      <AnimatePresence>
        {!isClosing && (
          <motion.div
            key="pdf-flipbook-empty-backdrop"
            initial={motionTokens.backdropIn}
            animate={motionTokens.backdropAnimate}
            exit={motionTokens.backdropIn}
            transition={motionTokens.backdropTransition}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="No PDF available"
          >
            <motion.div
              initial={motionTokens.containerIn}
              animate={motionTokens.containerAnimate}
              exit={motionTokens.containerExit}
              transition={motionTokens.containerTransition}
              className={cn(
                "relative flex flex-col items-center justify-center p-10",
                radii.modal,
              )}
              style={{ backgroundColor: colors.bg.warm }}
              onClick={(e) => e.stopPropagation()}
            >
              {onClose && (
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-600 hover:text-stone-900 hover:bg-white transition-all shadow-sm"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="text-stone-400 font-editorial text-sm">
                No PDF available
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
              "relative w-[96vw] h-[92vh] lg:w-[94vw] lg:h-[90vh] flex flex-col overflow-hidden",
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

            {/* ── Top header ── */}
            <div
              className="flex-shrink-0 px-6 py-3 border-b"
              style={{ borderColor: colors.border.medium, backgroundColor: colors.bg.paper }}
            >
              <h1
                className="font-serif text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                {data.title}
              </h1>
            </div>

            {/* ── PDF viewer area ── */}
            <div className="flex-1 min-h-0">
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
