// ========================================
// Editorial Types
//
// Types for public-facing editorial content:
// consumption, essays, sidequests, skills, travel, design thoughts, topics.
// ========================================

// ── Shared Structured Shapes ─────────────
// These mirror the JSONB shapes in the DB schema and align with
// ContentData from content-renderer so adapters can pass through.

export interface EditorialMedia {
  src: string;
  type?: "image" | "video";
  alt: string;
  aspectRatio?: string;
}

export interface EditorialMeta {
  label: string;
  value: string;
}

// ── Content Consumption ──────────────────

export type ContentType = "book" | "playlist" | "essay" | "video" | "movie" | "series";
export type ContentStatus = "CURRENTLY READING" | "CURRENTLY WATCHING" | "COMPLETED" | "QUEUED" | "LISTENING";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string; // Author, artist, director, etc.
  description: string;
  metadata: string; // Year, genre, etc.
  status: ContentStatus;
  imageUrl?: string; // Optional real image
  aspectRatio: "3/4" | "1/1" | "2/3" | "16/9" | "4/5";
  /** Language/medium — shown on the Completed list view */
  language?: string;
  /** Genre tag — shown on the Completed list view */
  genre?: string;
  /** One-liner takeaway — shown on the Completed list view */
  comment?: string;
  /** URL for watching (films, shows, etc.) */
  watchUrl?: string;
  /** Highlight this item as a top pick */
  topPick?: boolean;
}

// ── Essays ───────────────────────────────

export interface Essay {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  tags?: string[];
  slug: string;
  /** Path to PDF file in public/pdfs/essays/ (e.g. "/pdfs/essays/on-taste.pdf") */
  pdfUrl?: string;
  /** @deprecated Legacy essay body content - now using PDFs for display */
  body?: EssayBlock[];
  /** Multi-media gallery — passed through to ContentRenderer when present */
  media?: EditorialMedia[];
  /** Structured metadata — passed through to ContentRenderer when present */
  contentMeta?: EditorialMeta[];
}

/** Content block types for structured essay rendering (legacy - now using PDFs) */
export type EssayBlock =
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string; attribution?: string }
  | { type: "heading"; text: string }
  | { type: "separator" };

export type EssayCategory = (typeof ESSAY_CATEGORIES)[number];

export const ESSAY_CATEGORIES = [
  "All",
  "Philosophy",
  "History",
  "Culture",
  "Don't be absurd, I have a list of things I hate",
  "Personal",
] as const;

// ── Sidequests ───────────────────────────

export interface Sidequest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  xp: number;
  completed: boolean;
  imageUrl: string;
  questLog: string;
  entryId: string;
  /** Multi-media gallery — passed through to ContentRenderer when present */
  media?: EditorialMedia[];
  /** Structured metadata — passed through to ContentRenderer when present */
  contentMeta?: EditorialMeta[];
}

// ── Skills ───────────────────────────────

export interface SkillExperiment {
  id: string;
  experimentNumber: number;
  name: string;
  tools: string[]; // Technologies, frameworks, methodologies
  proficiency: number; // 0-100 percentage
  description: string;
  category: "Technical" | "Design" | "Strategy" | "Craft" | "Language";
  isInverted?: boolean; // Dark card styling
  /** Multi-media gallery — passed through to ContentRenderer when present */
  media?: EditorialMedia[];
  /** Structured metadata — passed through to ContentRenderer when present */
  contentMeta?: EditorialMeta[];
}

// ── Travel ───────────────────────────────

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  coordinates: string;
  dateVisited: string;
  description: string;
  imageUrl: string;
  isHeroTile?: boolean;
  climate: string;
  duration: string;
  inventory: string[];
  notes: string;
  /** Path to PDF journal in public/pdfs/travel/ */
  pdfUrl: string;
  /** Multi-media gallery — passed through to ContentRenderer when present */
  media?: EditorialMedia[];
  /** Structured metadata — passed through to ContentRenderer when present */
  contentMeta?: EditorialMeta[];
}

// ── Design Thoughts ──────────────────────

export type ThoughtCardType = "standard" | "blueprint" | "inverted" | "technical";
export type AnnotationType = "measurement" | "redline" | "stamp" | "none";

export interface DesignThought {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  cardType: ThoughtCardType;
  annotationType: AnnotationType;
  hasTechnicalPattern?: boolean;
  pdfUrl?: string;
  /** Multi-media gallery — passed through to ContentRenderer when present */
  media?: EditorialMedia[];
  /** Structured metadata — passed through to ContentRenderer when present */
  contentMeta?: EditorialMeta[];
}

// ── Topics (Navigation) ─────────────────

export interface Topic {
  slug: string;
  title: string;
  description: string;
  isPublic: boolean;
  icon: string; // lucide icon name
  iconColor: string; // tailwind text color class for the icon
  iconBg: string; // tailwind bg color class for the icon container
  displayOrder: number;
  subTabs?: SubTab[];
}

export interface SubTab {
  id: string;
  label: string;
  displayOrder: number;
}
