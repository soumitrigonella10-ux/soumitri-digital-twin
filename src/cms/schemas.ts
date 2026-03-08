// ─────────────────────────────────────────────────────────────
// CMS Zod Schemas — Validation schemas for all content types
//
// Each content type has:
//   - payloadSchema: validates the type-specific data in payload JSONB
//   - metadataSchema: validates the metadata JSONB
//
// These run server-side on every create/update to guarantee DB integrity.
// They also power client-side form validation via react-hook-form.
// ─────────────────────────────────────────────────────────────
import { z } from "zod";

// ── Shared schemas ───────────────────────────────────────────

export const mediaItemSchema = z.object({
  src: z.string().min(1, "Media source is required"),
  type: z.enum(["image", "video"]).optional(),
  alt: z.string().min(1, "Alt text is required"),
  aspectRatio: z.string().optional(),
});

export const metaEntrySchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

// ── Essay ────────────────────────────────────────────────────

export const essayPayloadSchema = z.object({
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be under 500 characters"),
  pdfUrl: z.string().optional().default(""),
  readingTime: z.string().optional().default(""),
  media: z.array(mediaItemSchema).optional().default([]),
  contentMeta: z.array(metaEntrySchema).optional().default([]),
});

export type EssayPayload = z.infer<typeof essayPayloadSchema>;

export const essayMetadataSchema = z.object({
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  date: z.string().min(1, "Date is required"),
});

export type EssayMetadata = z.infer<typeof essayMetadataSchema>;

// ── Skill Quest ──────────────────────────────────────────────

export const skillPayloadSchema = z.object({
  description: z.string().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
  proficiency: z.number().min(0, "Min 0").max(100, "Max 100").default(0),
});

export type SkillPayload = z.infer<typeof skillPayloadSchema>;

export const skillMetadataSchema = z.object({
  category: z.string().min(1, "Field is required"),
  tags: z.array(z.string()).optional().default([]),
});

export type SkillMetadata = z.infer<typeof skillMetadataSchema>;

// ── Sidequest ────────────────────────────────────────────────

export const sidequestPayloadSchema = z.object({
  description: z.string().min(1, "Description is required").max(500, "Description must be under 500 characters"),
  questLog: z.string().min(1, "Write-up is required"),
  imageUrl: z.string().optional().default(""),
});

export type SidequestPayload = z.infer<typeof sidequestPayloadSchema>;

export const sidequestMetadataSchema = z.object({
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Expert"]).default("Medium"),
});

export type SidequestMetadata = z.infer<typeof sidequestMetadataSchema>;

// ── Artifact ─────────────────────────────────────────────────

export const artifactPayloadSchema = z.object({
  description: z.string().max(500, "Description must be under 500 characters").optional().default(""),
  backgroundColor: z.string().optional().default("#F9F7F2"),
  imagePath: z.string().optional().default(""),
  hasWashiTape: z.boolean().optional().default(false),
  paperNoteText: z.string().max(100, "Note must be under 100 characters").optional().default(""),
  paperNotePosition: z.enum(["", "top-left", "top-right", "bottom-left", "bottom-right"]).optional().default(""),
});

export type ArtifactPayload = z.infer<typeof artifactPayloadSchema>;

export const artifactMetadataSchema = z.object({
  medium: z.string().min(1, "Medium is required"),
  frameType: z.enum(["hero", "standard", "mini", "tiny", "wide"]).default("standard"),
  borderStyle: z.enum(["polaroid", "thin", "shadow", "none"]).default("shadow"),
  category: z.string().optional().default(""),
});

export type ArtifactMetadata = z.infer<typeof artifactMetadataSchema>;

// ── Content Consumption ──────────────────────────────────────

export const consumptionPayloadSchema = z.object({
  description: z.string().min(1, "Description is required").max(500, "Description must be under 500 characters"),
  author: z.string().min(1, "Author/Creator is required"),
  imageUrl: z.string().optional().default(""),
  watchUrl: z.string().optional().default(""),
  comment: z.string().max(300, "Comment must be under 300 characters").optional().default(""),
  aspectRatio: z.enum(["3/4", "1/1", "2/3", "16/9", "4/5"]).optional().default("3/4"),
});

export type ConsumptionPayload = z.infer<typeof consumptionPayloadSchema>;

export const consumptionMetadataSchema = z.object({
  contentType: z.enum(["book", "movie", "essay", "series", "video"]),
  status: z.enum(["CURRENTLY READING", "CURRENTLY WATCHING", "COMPLETED", "QUEUED", "LISTENING"]).default("QUEUED"),
  metadataText: z.string().optional().default(""),
  language: z.string().optional().default(""),
  genre: z.string().optional().default(""),
  topPick: z.boolean().optional().default(false),
});

export type ConsumptionMetadata = z.infer<typeof consumptionMetadataSchema>;

// ── Inspiration ──────────────────────────────────────────────

export const inspirationPayloadSchema = z.object({
  content: z.string().min(1, "Content is required"),
  source: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  backgroundColor: z.string().optional().default("#F9F7F2"),
  accentColor: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

export type InspirationPayload = z.infer<typeof inspirationPayloadSchema>;

export const inspirationMetadataSchema = z.object({
  inspirationType: z.enum(["image", "music", "quote", "video"]),
});

export type InspirationMetadata = z.infer<typeof inspirationMetadataSchema>;

// ── Wishlist ─────────────────────────────────────────────────

export const wishlistPayloadSchema = z.object({
  brand: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  websiteUrl: z.string().optional().default(""),
  price: z.number().optional(),
  currency: z.string().optional().default("INR"),
});

export type WishlistPayload = z.infer<typeof wishlistPayloadSchema>;

export const wishlistMetadataSchema = z.object({
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  purchased: z.boolean().optional().default(false),
});

export type WishlistMetadata = z.infer<typeof wishlistMetadataSchema>;

// ── Design Thought ───────────────────────────────────────────

export const designThoughtPayloadSchema = z.object({
  subtitle: z.string().optional().default(""),
  pdfUrl: z.string().optional().default(""),
  hasTechnicalPattern: z.boolean().optional().default(false),
});

export type DesignThoughtPayload = z.infer<typeof designThoughtPayloadSchema>;

export const designThoughtMetadataSchema = z.object({
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  cardType: z.enum(["standard", "blueprint", "inverted", "technical"]).default("standard"),
  annotationType: z.enum(["measurement", "redline", "stamp", "none"]).default("none"),
});

export type DesignThoughtMetadata = z.infer<typeof designThoughtMetadataSchema>;

// ── Travel ───────────────────────────────────────────────────

export const travelPayloadSchema = z.object({
  description: z.string().min(1, "Description is required").max(500, "Description must be under 500 characters"),
  notes: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  pdfUrl: z.string().optional().default(""),
  inventory: z.string().optional().default(""),
  isHeroTile: z.boolean().optional().default(false),
});

export type TravelPayload = z.infer<typeof travelPayloadSchema>;

export const travelMetadataSchema = z.object({
  country: z.string().min(1, "Country is required"),
  dateVisited: z.string().min(1, "Date visited is required"),
  climate: z.string().min(1, "Climate is required"),
  duration: z.string().min(1, "Duration is required"),
  coordinates: z.string().optional().default(""),
});

export type TravelMetadata = z.infer<typeof travelMetadataSchema>;

// ── Journal (Studio) ─────────────────────────────────────────

export const journalPayloadSchema = z.object({
  description: z.string().max(300, "Description must be under 300 characters").optional().default(""),
  pdfUrl: z.string().min(1, "A journal PDF is required"),
  coverUrl: z.string().optional().default(""),
});

export type JournalPayload = z.infer<typeof journalPayloadSchema>;

export const journalMetadataSchema = z.object({
  date: z.string().optional().default(""),
});

export type JournalMetadata = z.infer<typeof journalMetadataSchema>;

// ── Internet Lore ────────────────────────────────────────────

export const internetLorePayloadSchema = z.object({
  description: z.string().max(500, "Description must be under 500 characters").optional().default(""),
  mediaUrl: z.string().optional().default(""),      // uploaded image or video thumbnail
  videoUrl: z.string().optional().default(""),       // external video / reel link
  quoteText: z.string().max(500, "Quote must be under 500 characters").optional().default(""),
  note: z.string().max(200, "Note must be under 200 characters").optional().default(""),
});

export type InternetLorePayload = z.infer<typeof internetLorePayloadSchema>;

export const internetLoreMetadataSchema = z.object({
  category: z.enum(["pop-internet-core", "lobotomy-core", "hood-classics"]),
  mediaType: z.enum(["photo", "video", "reel", "quote"]),
  era: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

export type InternetLoreMetadata = z.infer<typeof internetLoreMetadataSchema>;

// ── Content Item base schema (shared across all types) ───────

export const contentVisibilitySchema = z.enum(["draft", "published", "archived"]);

export const createContentSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  slug: z.string().min(1, "Slug is required")
    .max(100, "Slug must be under 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  visibility: contentVisibilitySchema,
  metadata: z.record(z.unknown()),
  payload: z.record(z.unknown()),
  coverImage: z.string().nullable().optional(),
  isFeatured: z.boolean().optional().default(false),
});

export const updateContentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  visibility: contentVisibilitySchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  payload: z.record(z.unknown()).optional(),
  coverImage: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
});
