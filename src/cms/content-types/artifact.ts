// ─────────────────────────────────────────────────────────────
// Artifact Content Type — Registration
//
// Registers "artifact" as a CMS content type with:
//   - Zod validation schemas
//   - Form field definitions for the admin UI
//   - Default values
//
// Frontend Artifact parameters mapped:
//   metadata: medium, frameType, borderStyle
//   payload:  description, backgroundColor,
//             imagePath, paperNote, hasWashiTape
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { artifactPayloadSchema, artifactMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields (go in `metadata` column) ───────────────
const metadataFields: MetadataField[] = [
  {
    name: "medium",
    label: "Medium",
    type: "text",
    required: true,
    placeholder: "e.g. Digital Photography, Ink & Watercolor",
    description: "Art medium or technique used",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "frameType",
    label: "Frame Size",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "hero", label: "Hero (large)" },
      { value: "standard", label: "Standard" },
      { value: "mini", label: "Mini (compact)" },
      { value: "tiny", label: "Tiny (smallest)" },
      { value: "wide", label: "Wide (text card)" },
    ],
    defaultValue: "standard",
  },
  {
    name: "borderStyle",
    label: "Border Style",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "polaroid", label: "Polaroid" },
      { value: "thin", label: "Thin" },
      { value: "shadow", label: "Shadow" },
      { value: "none", label: "None" },
    ],
    defaultValue: "shadow",
  },
];

// ── Payload fields (go in `payload` column) ──────────────────
const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "A reflective description of the piece...",
    description: "Shown on wide/text cards — max 500 characters",
  },
  {
    name: "backgroundColor",
    label: "Background Color",
    type: "text",
    placeholder: "#2D2424",
    description: "Hex color for the card background",
  },
  {
    name: "imagePath",
    label: "Image",
    type: "file-image",
    description: "Upload the artifact image",
    group: "Media",
  },
  {
    name: "hasWashiTape",
    label: "Washi Tape Decoration",
    type: "boolean",
    description: "Show decorative washi tape on the card",
    defaultValue: false,
  },
  {
    name: "paperNoteText",
    label: "Paper Note Text",
    type: "text",
    placeholder: "e.g. Captured at Golden Hour",
    description: "Optional handwritten-style note on the card",
  },
  {
    name: "paperNotePosition",
    label: "Paper Note Position",
    type: "select",
    description: "Where to place the paper note",
    options: [
      { value: "", label: "No note" },
      { value: "top-left", label: "Top Left" },
      { value: "top-right", label: "Top Right" },
      { value: "bottom-left", label: "Bottom Left" },
      { value: "bottom-right", label: "Bottom Right" },
    ],
    defaultValue: "",
  },
];

// ── Registration ─────────────────────────────────────────────
const artifactConfig: ContentTypeConfig = {
  type: "artifact",
  label: "Artifact",
  pluralLabel: "Artifacts",
  icon: "Palette",
  description: "Creative experiments and visual studies for The Studio",
  payloadSchema: artifactPayloadSchema,
  metadataSchema: artifactMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    description: "",
    backgroundColor: "#F9F7F2",
    imagePath: "",
    hasWashiTape: false,
    paperNoteText: "",
    paperNotePosition: "",
  },
  defaultMetadata: {
    medium: "",
    frameType: "standard",
    category: "",
    borderStyle: "shadow",
  },
  generateSlug: slugify,
};

registerContentType(artifactConfig);

export { artifactConfig };
