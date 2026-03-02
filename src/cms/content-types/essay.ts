// ─────────────────────────────────────────────────────────────
// Essay Content Type — Registration
//
// Registers "essay" as a CMS content type with:
//   - Zod validation schemas
//   - Form field definitions for the admin UI
//   - Default values
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { essayPayloadSchema, essayMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields (go in `metadata` column) ───────────────
const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Philosophy", label: "Philosophy" },
      { value: "History", label: "History" },
      { value: "Culture", label: "Culture" },
      { value: "Personal", label: "Personal" },
      { value: "Don't be absurd, I have a list of things I hate", label: "Don't be absurd, I have a list of things I hate" },
    ],
    defaultValue: "Philosophy",
  },
  {
    name: "tags",
    label: "Tags",
    type: "tags",
    placeholder: "Add tags (press Enter)",
    description: "Comma-separated or press Enter to add",
    isMetadata: true,
    defaultValue: [],
  },
  {
    name: "date",
    label: "Date",
    type: "text",
    placeholder: "January 2026",
    description: "Display date (e.g. 'January 2026')",
    required: true,
    isMetadata: true,
    defaultValue: "",
  },
];

// ── Payload fields (go in `payload` column) ──────────────────
const payloadFields: FormField[] = [
  {
    name: "excerpt",
    label: "Excerpt",
    type: "textarea",
    placeholder: "A compelling summary of the essay...",
    description: "Shown on cards and previews — max 500 characters",
    required: true,
  },
  {
    name: "readingTime",
    label: "Reading Time",
    type: "text",
    placeholder: "8 min read",
    description: "Estimated reading time",
  },
  {
    name: "pdfUrl",
    label: "PDF File",
    type: "file-pdf",
    description: "Upload the essay PDF",
    group: "Media",
  },
];

// ── Registration ─────────────────────────────────────────────
const essayConfig: ContentTypeConfig = {
  type: "essay",
  label: "Essay",
  pluralLabel: "Essays",
  icon: "BookOpen",
  description: "Long-form written pieces with PDF rendering",
  payloadSchema: essayPayloadSchema,
  metadataSchema: essayMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    excerpt: "",
    pdfUrl: "",
    readingTime: "",
    media: [],
    contentMeta: [],
  },
  defaultMetadata: {
    category: "Philosophy",
    tags: [],
    date: "",
  },
  generateSlug: slugify,
};

registerContentType(essayConfig);

export { essayConfig };
