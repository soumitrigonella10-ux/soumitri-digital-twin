// ─────────────────────────────────────────────────────────────
// Inspiration Content Type — Registration
//
// Covers: Image, Music, Quote, Video fragments
// metadata: inspirationType
// payload:  content, source, subtitle, backgroundColor, accentColor, imageUrl
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { inspirationPayloadSchema, inspirationMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields ──────────────────────────────────────────
const metadataFields: MetadataField[] = [
  {
    name: "inspirationType",
    label: "Fragment Type",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "image", label: "Image" },
      { value: "music", label: "Music" },
      { value: "quote", label: "Quote" },
      { value: "video", label: "Video" },
    ],
    defaultValue: "quote",
  },
];

// ── Payload fields ───────────────────────────────────────────
const payloadFields: FormField[] = [
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    placeholder: "e.g. The details are not the details. They make the design.",
    description: "The quote text, image caption, track name, or video title",
  },
  {
    name: "source",
    label: "Source",
    type: "text",
    placeholder: "e.g. Charles Eames",
    description: "Attribution — artist, photographer, author",
  },
  {
    name: "subtitle",
    label: "Subtitle / Duration",
    type: "text",
    placeholder: "e.g. 4:32",
    description: "Duration for music/video, or subtitle",
  },
  {
    name: "backgroundColor",
    label: "Background Color",
    type: "text",
    placeholder: "#F9F7F2",
    description: "Hex color for the card background",
  },
  {
    name: "accentColor",
    label: "Accent Color",
    type: "text",
    placeholder: "#C4B6A6",
    description: "Accent color for music play icon",
  },
  {
    name: "imageUrl",
    label: "Image",
    type: "file-image",
    description: "Upload an image (for image-type fragments)",
    group: "Media",
  },
];

// ── Registration ─────────────────────────────────────────────
const inspirationConfig: ContentTypeConfig = {
  type: "inspiration",
  label: "Inspiration",
  pluralLabel: "Inspirations",
  icon: "Sparkles",
  description: "Small fragments of influence — tacked on, torn out, and treasured",
  payloadSchema: inspirationPayloadSchema,
  metadataSchema: inspirationMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    content: "",
    source: "",
    subtitle: "",
    backgroundColor: "#F9F7F2",
    accentColor: "",
    imageUrl: "",
  },
  defaultMetadata: {
    inspirationType: "quote",
  },
  generateSlug: slugify,
};

registerContentType(inspirationConfig);

export { inspirationConfig };
