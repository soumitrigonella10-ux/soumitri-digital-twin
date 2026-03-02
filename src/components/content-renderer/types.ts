// ========================================
// Content Visualization System — Shared Types
//
// A uniform props schema so any page can drive any
// visualization type through data alone.
// ========================================

import type { ReactNode } from "react";

// ── Visualization Types ──────────────────

/** The four reusable visualization modes. */
export type ContentVisualizationType =
  | "split-detail"
  | "list-detail"
  | "pdf-flipbook"
  | "pdf-single";

/** Layout variant hint — lets pages nudge presentation without re-building. */
export type LayoutVariant =
  | "default"
  | "compact"
  | "full-bleed"
  | "centered";

// ── Media ────────────────────────────────

export interface MediaItem {
  /** URL to image or video source */
  src: string;
  /** "image" | "video" — defaults to "image" */
  type?: "image" | "video";
  /** alt / caption text for accessibility */
  alt: string;
  /** Optional aspect-ratio hint (e.g. "16/9", "3/4") */
  aspectRatio?: string;
  /** placeholder blur-data-url for Next.js Image */
  blurDataUrl?: string;
}

// ── Actions ──────────────────────────────

export interface ContentAction {
  label: string;
  /** Optional Lucide icon name */
  icon?: string;
  onClick?: () => void;
  href?: string;
  /** Visual weight */
  variant?: "primary" | "secondary" | "ghost";
}

// ── Badge / Tag ──────────────────────────

export interface ContentTag {
  label: string;
  /** Tailwind class overrides (e.g. "bg-emerald-100 text-emerald-700") */
  className?: string;
}

// ── Metadata key-value pair ──────────────

export interface MetadataEntry {
  label: string;
  value: string;
}

// ── Unified Content Data Payload ─────────

export interface ContentData {
  /** Unique identifier */
  id: string;

  /** Primary title */
  title: string;

  /** Optional subtitle / excerpt */
  subtitle?: string;

  /** Tags / category badges */
  tags?: ContentTag[];

  /** Media gallery (images / videos) */
  media?: MediaItem[];

  /** Rich text body — rendered as ReactNode or string */
  body?: ReactNode | string;

  /** PDF path for flipbook / single-viewer modes */
  pdfUrl?: string;

  /** Arbitrary key-value metadata (date, climate, duration …) */
  metadata?: MetadataEntry[];

  /** CTA / action buttons */
  actions?: ContentAction[];

  /** Optional small tracking label (e.g. "Entry 003") */
  trackingLabel?: string;

  /** Completion / achieved flag (drives list-detail styling) */
  isCompleted?: boolean;

  /** Progress 0-100 (drives list-detail progress bar) */
  progress?: number;

  /** Footer text (attribution, return link label) */
  footerLabel?: string;

  /** Optional list items for list-detail visualization */
  items?: ListDetailItem[];
}

// ── List-Detail Item ─────────────────────

/** A single item inside a list-detail view with expand/collapse. */
export interface ListDetailItem extends ContentData {
  /** Category string (for color-coded pills) */
  category?: string;

  /** Tools / sub-labels shown in footer */
  tools?: string[];
}

// ── ContentRenderer Props ────────────────

export interface ContentRendererProps {
  /** Which visualization to render */
  type: ContentVisualizationType;

  /** The data payload */
  data: ContentData;

  /** Layout variant hint */
  layoutVariant?: LayoutVariant;

  /** Called when the user closes / dismisses (modals, overlays) */
  onClose?: () => void;

  /** Additional className on the outermost wrapper */
  className?: string;
}

// ── Individual Type Props ────────────────

export interface SplitDetailProps {
  data: ContentData;
  layoutVariant?: LayoutVariant;
  onClose?: () => void;
  className?: string;
}

export interface ListDetailProps {
  /** Array of items to list */
  items: ListDetailItem[];
  /** Overall title for the list */
  title?: string;
  layoutVariant?: LayoutVariant;
  className?: string;
}

export interface PdfFlipbookProps {
  data: ContentData;
  layoutVariant?: LayoutVariant;
  onClose?: () => void;
  className?: string;
}

export interface PdfSingleViewerProps {
  data: ContentData;
  layoutVariant?: LayoutVariant;
  onClose?: () => void;
  className?: string;
}
