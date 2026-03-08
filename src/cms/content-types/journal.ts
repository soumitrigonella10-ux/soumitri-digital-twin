// ─────────────────────────────────────────────────────────────
// Journal Content Type — Registration
//
// Registers "journal" as a CMS content type for studio journals
// with PDF upload and optional cover image.
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { journalPayloadSchema, journalMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields ──────────────────────────────────────────
const metadataFields: MetadataField[] = [
  {
    name: "date",
    label: "Date",
    type: "text",
    placeholder: "e.g. March 2026",
    description: "When the journal was created",
    isMetadata: true,
    defaultValue: "",
  },
];

// ── Payload fields ───────────────────────────────────────────
const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief notes about this journal...",
    description: "Optional description — max 300 characters",
  },
  {
    name: "pdfUrl",
    label: "Journal PDF",
    type: "file-pdf",
    required: true,
    description: "Upload the journal PDF",
    group: "Media",
  },
  {
    name: "coverUrl",
    label: "Cover Image",
    type: "file-image",
    description: "Optional cover image for the journal card",
    group: "Media",
  },
];

// ── Registration ─────────────────────────────────────────────
const journalConfig: ContentTypeConfig = {
  type: "journal",
  label: "Journal",
  pluralLabel: "Journals",
  icon: "BookOpen",
  description: "Studio journals with PDF flipbook viewer",
  payloadSchema: journalPayloadSchema,
  metadataSchema: journalMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    description: "",
    pdfUrl: "",
    coverUrl: "",
  },
  defaultMetadata: {
    date: "",
  },
  generateSlug: slugify,
};

registerContentType(journalConfig);

export { journalConfig };
