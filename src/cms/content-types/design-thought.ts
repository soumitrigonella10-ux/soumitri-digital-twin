// ─────────────────────────────────────────────────────────────
// Design Thought Content Type — Registration
//
// Design Theology entries — principles, beliefs, process notes.
// metadata: category, date, cardType, annotationType
// payload:  subtitle, pdfUrl, hasTechnicalPattern
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { designThoughtPayloadSchema, designThoughtMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields ──────────────────────────────────────────
const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "UX Philosophy", label: "UX Philosophy" },
      { value: "Layout Theory", label: "Layout Theory" },
      { value: "Type Design", label: "Type Design" },
      { value: "Animation", label: "Animation" },
      { value: "Visual Design", label: "Visual Design" },
      { value: "Technical", label: "Technical" },
      { value: "Design Systems", label: "Design Systems" },
      { value: "Ethics", label: "Ethics" },
    ],
    defaultValue: "UX Philosophy",
  },
  {
    name: "date",
    label: "Date",
    type: "text",
    required: true,
    placeholder: "Feb 2026",
    description: "Display date",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "cardType",
    label: "Card Type",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "standard", label: "Standard" },
      { value: "blueprint", label: "Blueprint" },
      { value: "inverted", label: "Inverted (Dark)" },
      { value: "technical", label: "Technical" },
    ],
    defaultValue: "standard",
  },
  {
    name: "annotationType",
    label: "Annotation Type",
    type: "select",
    isMetadata: true,
    options: [
      { value: "none", label: "None" },
      { value: "measurement", label: "Measurement" },
      { value: "redline", label: "Redline" },
      { value: "stamp", label: "Stamp" },
    ],
    defaultValue: "none",
  },
];

// ── Payload fields ───────────────────────────────────────────
const payloadFields: FormField[] = [
  {
    name: "subtitle",
    label: "Subtitle",
    type: "text",
    placeholder: "e.g. in Digital Interfaces",
    description: "Optional secondary line on the card",
  },
  {
    name: "pdfUrl",
    label: "PDF Document",
    type: "text",
    placeholder: "/pdfs/essays/design-philosophy.pdf",
    description: "Path to a PDF for the thought detail view",
  },
  {
    name: "hasTechnicalPattern",
    label: "Technical Pattern Background",
    type: "boolean",
    description: "Show grid/technical pattern overlay on the card",
    defaultValue: false,
  },
];

// ── Registration ─────────────────────────────────────────────
const designThoughtConfig: ContentTypeConfig = {
  type: "design-thought",
  label: "Design Thought",
  pluralLabel: "Design Thoughts",
  icon: "PenTool",
  description: "Principles, beliefs, and process notes from the drafting table",
  payloadSchema: designThoughtPayloadSchema,
  metadataSchema: designThoughtMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    subtitle: "",
    pdfUrl: "",
    hasTechnicalPattern: false,
  },
  defaultMetadata: {
    category: "UX Philosophy",
    date: "",
    cardType: "standard",
    annotationType: "none",
  },
  generateSlug: slugify,
};

registerContentType(designThoughtConfig);

export { designThoughtConfig };
