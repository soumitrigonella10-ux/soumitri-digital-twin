// ─────────────────────────────────────────────────────────────
// Travel Content Type — Registration
//
// Registers "travel" as a CMS content type with:
//   - Zod validation schemas
//   - Form field definitions for the admin UI
//   - Default values
//
// TravelLocation parameters mapped:
//   metadata: country, dateVisited, climate, duration, coordinates
//   payload:  description, imageUrl, notes, pdfUrl, inventory
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { travelPayloadSchema, travelMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields (go in `metadata` column) ───────────────
const metadataFields: MetadataField[] = [
  {
    name: "country",
    label: "Country",
    type: "text",
    required: true,
    placeholder: "e.g. Japan",
    description: "Country visited",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "dateVisited",
    label: "Date Visited",
    type: "text",
    required: true,
    placeholder: "e.g. November 2025",
    description: "When the trip took place",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "climate",
    label: "Climate",
    type: "text",
    required: true,
    placeholder: "e.g. Mild autumn, 12-18°C",
    description: "Weather / climate during the visit",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "duration",
    label: "Duration",
    type: "text",
    required: true,
    placeholder: "e.g. 9 days",
    description: "Length of the trip",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "coordinates",
    label: "Coordinates",
    type: "text",
    placeholder: "e.g. 35.0116° N, 135.7681° E",
    description: "GPS coordinates for display",
    isMetadata: true,
    defaultValue: "",
  },
];

// ── Payload fields (go in `payload` column) ──────────────────
const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "A reflective description of the destination...",
    description: "Destination description — max 500 characters",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Personal observations, takeaways...",
    description: "Travel notes and reflections",
  },
  {
    name: "imageUrl",
    label: "Cover Image",
    type: "file-image",
    description: "Upload a cover photo for the location card",
    group: "Media",
  },
  {
    name: "pdfUrl",
    label: "Travel Journal PDF",
    type: "file-pdf",
    description: "Upload the travel journal PDF",
    group: "Media",
  },
  {
    name: "inventory",
    label: "Packing List / Inventory",
    type: "textarea",
    placeholder: "One item per line",
    description: "Items brought on the trip (one per line)",
  },
  {
    name: "isHeroTile",
    label: "Hero Tile",
    type: "boolean",
    description: "Display as a large hero tile on the grid",
    defaultValue: false,
  },
];

// ── Registration ─────────────────────────────────────────────
const travelConfig: ContentTypeConfig = {
  type: "travel",
  label: "Travel Location",
  pluralLabel: "Travel Locations",
  icon: "Map",
  description: "Field journals and travel logs",
  payloadSchema: travelPayloadSchema,
  metadataSchema: travelMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    description: "",
    notes: "",
    imageUrl: "",
    pdfUrl: "",
    inventory: "",
    isHeroTile: false,
  },
  defaultMetadata: {
    country: "",
    dateVisited: "",
    climate: "",
    duration: "",
    coordinates: "",
  },
  generateSlug: slugify,
};

registerContentType(travelConfig);

export { travelConfig };
