// ─────────────────────────────────────────────────────────────
// CMS barrel export
// ─────────────────────────────────────────────────────────────

// Register all content types (side-effect imports)
import "./content-types";

// Re-export registry functions
export {
  getContentType,
  requireContentType,
  getAllContentTypes,
  getContentTypeKeys,
  hasContentType,
  slugify,
} from "./registry";

// Re-export types
export type {
  ContentItem,
  ContentVisibility,
  ContentTypeConfig,
  FormField,
  MetadataField,
  CreateContentInput,
  UpdateContentInput,
  CmsActionResult,
  FieldType,
} from "./types";

export { VISIBILITY_OPTIONS } from "./types";

// Re-export schemas
export {
  createContentSchema,
  updateContentSchema,
  contentVisibilitySchema,
  essayPayloadSchema,
  essayMetadataSchema,
  skillPayloadSchema,
  skillMetadataSchema,
  sidequestPayloadSchema,
  sidequestMetadataSchema,
  consumptionPayloadSchema,
  consumptionMetadataSchema,
  inspirationPayloadSchema,
  inspirationMetadataSchema,
  wishlistPayloadSchema,
  wishlistMetadataSchema,
  designThoughtPayloadSchema,
  designThoughtMetadataSchema,
} from "./schemas";
