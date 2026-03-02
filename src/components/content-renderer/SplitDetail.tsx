"use client";

// ========================================
// SplitDetail — Left Media + Right Write-Up
//
// Inspired by QuestModal: full-viewport split with warm gradient
// media placeholder, scrollable right content column, shared tokens.
// ========================================

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { colors, spacing, typography, motion as motionTokens, radii } from "./tokens";
import type { SplitDetailProps, MediaItem } from "./types";

// ── Media renderer ───────────────────────

function MediaDisplay({ item, className }: { item: MediaItem; className?: string }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        className={cn("w-full h-full object-cover", className)}
        autoPlay
        loop
        muted
        playsInline
        aria-label={item.alt}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      className={cn("object-cover", className)}
      sizes="(max-width: 1024px) 100vw, 50vw"
      placeholder={item.blurDataUrl ? "blur" : "empty"}
      {...(item.blurDataUrl ? { blurDataURL: item.blurDataUrl } : {})}
      priority
    />
  );
}

// ── Component ────────────────────────────

export function SplitDetail({
  data,
  layoutVariant = "default",
  onClose,
  className,
}: SplitDetailProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

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

  const activeMedia = data.media?.[activeMediaIndex];

  const isFullBleed = layoutVariant === "full-bleed";
  const isCentered = layoutVariant === "centered";

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          key="split-detail-backdrop"
          initial={motionTokens.backdropIn}
          animate={motionTokens.backdropAnimate}
          exit={motionTokens.backdropIn}
          transition={motionTokens.backdropTransition}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-4"
          style={{ backgroundColor: colors.overlay.dark }}
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
              "relative w-full h-full lg:max-w-7xl lg:h-[85vh] flex flex-col lg:flex-row overflow-hidden",
              radii.modal,
              className
            )}
            style={{ backgroundColor: colors.bg.warm }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Left Column — Media ── */}
            <div
              className={cn(
                "relative flex-shrink-0 overflow-hidden",
                isFullBleed
                  ? "w-full lg:w-3/5 h-56 sm:h-72 lg:h-full"
                  : "w-full lg:w-1/2 h-56 sm:h-72 lg:h-full"
              )}
            >
              {activeMedia ? (
                <MediaDisplay item={activeMedia} />
              ) : (
                /* Warm gradient placeholder */
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradient.from}, ${colors.gradient.via}, ${colors.gradient.to})`,
                  }}
                />
              )}

              {/* Gallery dots (if multiple media items) */}
              {data.media && data.media.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {data.media.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMediaIndex(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        i === activeMediaIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      )}
                      aria-label={`View media ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Right Column — Content ── */}
            <div
              className={cn(
                "flex-1 overflow-y-auto modal-scroll",
                isCentered ? "flex items-center" : "",
                "p-6 sm:p-8 lg:p-12"
              )}
            >
              {/* Close button */}
              {onClose && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-all duration-300 hover:rotate-90 group"
                  style={{ color: colors.text.heading }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className={cn(spacing.sectionGap, isCentered && "w-full")}>
                {/* Tracking label */}
                {data.trackingLabel && (
                  <span
                    className={typography.label}
                    style={{ color: colors.accent.oxblood }}
                  >
                    {data.trackingLabel}
                  </span>
                )}

                {/* Title */}
                <h2
                  className={cn(typography.displayTitle, "pr-12")}
                  style={{ color: colors.text.heading }}
                >
                  {data.title}
                </h2>

                {/* Subtitle */}
                {data.subtitle && (
                  <p
                    className="font-editorial text-base sm:text-lg leading-relaxed"
                    style={{ color: `${colors.text.heading}CC` }}
                  >
                    {data.subtitle}
                  </p>
                )}

                {/* Tags / Badges */}
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {data.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={cn(
                          "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium",
                          radii.pill,
                          tag.className
                        )}
                        style={
                          !tag.className
                            ? {
                                backgroundColor: colors.gradient.from,
                                color: colors.text.heading,
                              }
                            : undefined
                        }
                      >
                        {tag.label}
                      </span>
                    ))}

                    {data.isCompleted && (
                      <span
                        className={cn(
                          "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5",
                          radii.pill
                        )}
                        style={{
                          backgroundColor: colors.accent.oxblood,
                          color: "#fff",
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                )}

                {/* Metadata pairs */}
                {data.metadata && data.metadata.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {data.metadata.map((m) => (
                      <div key={m.label}>
                        <dt
                          className={typography.label}
                          style={{ color: colors.accent.oxblood }}
                        >
                          {m.label}
                        </dt>
                        <dd
                          className="font-editorial text-sm mt-0.5"
                          style={{ color: colors.text.heading }}
                        >
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </div>
                )}

                {/* Body content */}
                {data.body && (
                  <div className={spacing.sectionGap}>
                    {typeof data.body === "string" ? (
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
                    )}
                  </div>
                )}

                {/* Actions */}
                {data.actions && data.actions.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {data.actions.map((action) => {
                      const base =
                        "inline-flex items-center gap-2 font-editorial text-sm font-semibold tracking-[0.05em] transition-all duration-200";
                      const variants = {
                        primary: cn(
                          base,
                          "px-5 py-2.5",
                          radii.pill,
                          "text-white"
                        ),
                        secondary: cn(
                          base,
                          "px-5 py-2.5 border",
                          radii.pill
                        ),
                        ghost: cn(base, "underline underline-offset-4"),
                      };

                      const style =
                        action.variant === "primary"
                          ? { backgroundColor: colors.accent.oxblood }
                          : action.variant === "secondary"
                            ? {
                                borderColor: colors.border.medium,
                                color: colors.text.heading,
                              }
                            : { color: colors.accent.amber };

                      if (action.href) {
                        return (
                          <a
                            key={action.label}
                            href={action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={variants[action.variant ?? "ghost"]}
                            style={style}
                          >
                            {action.label}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        );
                      }

                      return (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          className={variants[action.variant ?? "ghost"]}
                          style={style}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Footer */}
                {data.footerLabel && (
                  <div className="pt-6 mt-4 border-t" style={{ borderColor: colors.border.light }}>
                    <span
                      className="font-serif italic text-sm"
                      style={{ color: colors.text.tan }}
                    >
                      {data.footerLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
