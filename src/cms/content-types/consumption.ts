// ─────────────────────────────────────────────────────────────
// Content Consumption Content Type — Registration
//
// Covers: Movies, Books, Essays, Series, Videos
// metadata: contentType, status, metadataText, language, genre, topPick
// payload:  description, author, imageUrl, watchUrl, comment, aspectRatio
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { consumptionPayloadSchema, consumptionMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields ──────────────────────────────────────────
const metadataFields: MetadataField[] = [
  {
    name: "contentType",
    label: "Content Type",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "book", label: "Book" },
      { value: "movie", label: "Movie" },
      { value: "essay", label: "Essay" },
      { value: "series", label: "Series" },
      { value: "video", label: "Video" },
    ],
    defaultValue: "book",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "QUEUED", label: "Queued" },
      { value: "CURRENTLY READING", label: "Currently Reading" },
      { value: "CURRENTLY WATCHING", label: "Currently Watching" },
      { value: "LISTENING", label: "Listening" },
      { value: "COMPLETED", label: "Completed" },
    ],
    defaultValue: "QUEUED",
  },
  {
    name: "metadataText",
    label: "Metadata Text",
    type: "text",
    placeholder: "e.g. 2024 · Sci-Fi",
    description: "Year, genre tag, or other contextual info",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "language",
    label: "Language",
    type: "text",
    placeholder: "e.g. English",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "genre",
    label: "Genre",
    type: "text",
    placeholder: "e.g. Drama, Sci-Fi",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "topPick",
    label: "Top Pick",
    type: "boolean",
    description: "Highlight this item as a top pick",
    isMetadata: true,
    defaultValue: false,
  },
];

// ── Payload fields ───────────────────────────────────────────
const payloadFields: FormField[] = [
  {
    name: "author",
    label: "Author / Creator",
    type: "text",
    required: true,
    placeholder: "e.g. Christopher Nolan",
    description: "Author, director, artist, or creator",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "A brief description of the content...",
    description: "Max 500 characters",
  },
  {
    name: "comment",
    label: "One-liner Takeaway",
    type: "text",
    placeholder: "e.g. Memory distorts; love remains.",
    description: "Optional one-liner shown in Library view",
  },
  {
    name: "imageUrl",
    label: "Cover Image",
    type: "file-image",
    description: "Upload a cover image",
    group: "Media",
  },
  {
    name: "watchUrl",
    label: "Watch / Read URL",
    type: "text",
    placeholder: "https://...",
    description: "Optional link to where this can be consumed",
  },
  {
    name: "aspectRatio",
    label: "Card Aspect Ratio",
    type: "select",
    options: [
      { value: "3/4", label: "3:4 (Book)" },
      { value: "2/3", label: "2:3 (Movie poster)" },
      { value: "16/9", label: "16:9 (Widescreen)" },
      { value: "4/5", label: "4:5 (Essay)" },
      { value: "1/1", label: "1:1 (Square)" },
    ],
    defaultValue: "3/4",
  },
];

// ── Registration ─────────────────────────────────────────────
const consumptionConfig: ContentTypeConfig = {
  type: "consumption",
  label: "Content Consumption",
  pluralLabel: "Content Consumption",
  icon: "BookOpen",
  description: "Movies, Books, Essays, Series, and Videos — an archive of cultural intake",
  payloadSchema: consumptionPayloadSchema,
  metadataSchema: consumptionMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    description: "",
    author: "",
    imageUrl: "",
    watchUrl: "",
    comment: "",
    aspectRatio: "3/4",
  },
  defaultMetadata: {
    contentType: "book",
    status: "QUEUED",
    metadataText: "",
    language: "",
    genre: "",
    topPick: false,
  },
  generateSlug: slugify,
};

registerContentType(consumptionConfig);

export { consumptionConfig };
