import { registerContentType, slugify } from "../registry";
import { internetLorePayloadSchema, internetLoreMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Tab / Category",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "pop-internet-core", label: "Pop Internet Core" },
      { value: "lobotomy-core", label: "Lobotomy Core" },
      { value: "hood-classics", label: "Hood Classics" },
    ],
    defaultValue: "pop-internet-core",
  },
  {
    name: "mediaType",
    label: "Media Type",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "photo", label: "Photo" },
      { value: "video", label: "Video URL" },
      { value: "reel", label: "Reel Preview" },
      { value: "quote", label: "Quote" },
    ],
    defaultValue: "photo",
  },
  {
    name: "era",
    label: "Era",
    type: "text",
    isMetadata: true,
    placeholder: "e.g. 2015, Pre-Internet, 2010s",
  },
  {
    name: "tags",
    label: "Tags (comma-separated)",
    type: "text",
    isMetadata: true,
    placeholder: "e.g. MEME, REACTION, VINE",
  },
];

const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description...",
    description: "Optional short description",
  },
  {
    name: "mediaUrl",
    label: "Image",
    type: "file-image",
    description: "Upload a photo or reel preview image",
  },
  {
    name: "videoUrl",
    label: "Video / Reel URL",
    type: "text",
    placeholder: "https://youtube.com/... or https://instagram.com/reel/...",
    description: "External link to the video or reel",
  },
  {
    name: "quoteText",
    label: "Quote Text",
    type: "textarea",
    placeholder: "The iconic quote...",
    description: "For quote-type entries only",
  },
  {
    name: "note",
    label: "Handwritten Note",
    type: "text",
    placeholder: "A small annotation...",
    description: "Shows as a cursive scribble on hover",
  },
];

const internetLoreConfig: ContentTypeConfig = {
  type: "internet-lore",
  label: "Internet Lore",
  pluralLabel: "Internet Lore",
  icon: "Globe",
  description: "Curated internet fragments, memes, and cultural artifacts",
  payloadSchema: internetLorePayloadSchema,
  metadataSchema: internetLoreMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: { description: "", mediaUrl: "", videoUrl: "", quoteText: "", note: "" },
  defaultMetadata: { category: "pop-internet-core", mediaType: "photo", era: "", tags: [] },
  generateSlug: slugify,
};

registerContentType(internetLoreConfig);
