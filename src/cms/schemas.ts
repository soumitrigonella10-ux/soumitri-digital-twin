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
