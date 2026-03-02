// ─────────────────────────────────────────────────────────────
// CMS Types — Shared type definitions for the content management system
// ─────────────────────────────────────────────────────────────
import type { z } from "zod";

// ── Visibility ───────────────────────────────────────────────
export type ContentVisibility = "draft" | "published" | "archived";

export const VISIBILITY_OPTIONS: { value: ContentVisibility; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

// ── Content Item (matches DB row) ────────────────────────────
export interface ContentItem {
  id: string;
  type: string;
  slug: string;
  title: string;
  visibility: ContentVisibility;
  metadata: Record<string, unknown>;
  payload: Record<string, unknown>;
  coverImage: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// ── Form field descriptor — drives dynamic form generation ───
export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "select"
  | "multiselect"
  | "tags"
  | "number"
  | "boolean"
  | "date"
  | "file-image"
  | "file-pdf"
  | "file-video"
  | "url";

export interface FormField {
  /** Key in the payload object */
  name: string;
  /** Human-readable label */
  label: string;
  /** Field input type */
  type: FieldType;
  /** Placeholder text */
  placeholder?: string;
  /** Help text shown below the field */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Options for select/multiselect */
  options?: { value: string; label: string }[];
  /** Default value */
  defaultValue?: unknown;
  /** Group fields under a collapsible section */
  group?: string;
}

// ── Metadata field — fields that go in `metadata` column ─────
export interface MetadataField extends FormField {
  /** Marks this as a metadata field (vs payload) */
  isMetadata: true;
}

// ── Content Type Registration ────────────────────────────────
export interface ContentTypeConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Unique content type key — e.g. "essay" */
  type: string;
  /** Human-readable singular label — e.g. "Essay" */
  label: string;
  /** Plural label — e.g. "Essays" */
  pluralLabel: string;
  /** Icon name (Lucide) — e.g. "BookOpen" */
  icon: string;
  /** Description of this content type */
  description: string;
  /** Zod schema for payload validation */
  payloadSchema: z.ZodType<T>;
  /** Zod schema for metadata validation */
  metadataSchema: z.ZodType<Record<string, unknown>>;
  /** Form field definitions for payload */
  payloadFields: FormField[];
  /** Form field definitions for metadata */
  metadataFields: MetadataField[];
  /** Default payload values for new items */
  defaultPayload: T;
  /** Default metadata values for new items */
  defaultMetadata: Record<string, unknown>;
  /** Slug generation helper */
  generateSlug: (title: string) => string;
}

// ── Create/Update DTOs ───────────────────────────────────────
export interface CreateContentInput {
  type: string;
  title: string;
  slug: string;
  visibility: ContentVisibility;
  metadata: Record<string, unknown>;
  payload: Record<string, unknown>;
  coverImage?: string | null;
  isFeatured?: boolean;
}

export interface UpdateContentInput {
  id: string;
  title?: string;
  slug?: string;
  visibility?: ContentVisibility;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  coverImage?: string | null;
  isFeatured?: boolean;
}

// ── API Response shapes ──────────────────────────────────────
export interface CmsActionResult<T = ContentItem> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
