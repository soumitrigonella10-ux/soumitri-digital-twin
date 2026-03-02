// ─────────────────────────────────────────────────────────────
// CMS Content Type Registry
//
// Central registry for all content types. Adding a new type is as simple as:
//   1. Define a schema in schemas.ts
//   2. Call registerContentType() here or in a module entry
//   3. Add a renderer component
//
// No DB migration needed — all types share the content_items table.
// ─────────────────────────────────────────────────────────────
import type { ContentTypeConfig } from "./types";

// ── Registry Map ─────────────────────────────────────────────
const registry = new Map<string, ContentTypeConfig>();

/**
 * Register a content type with the CMS.
 * Throws if a type with the same key is already registered.
 */
export function registerContentType<T extends Record<string, unknown>>(
  config: ContentTypeConfig<T>
): void {
  if (registry.has(config.type)) {
    throw new Error(`CMS: Content type "${config.type}" is already registered`);
  }
  registry.set(config.type, config as unknown as ContentTypeConfig);
}

/**
 * Get configuration for a specific content type.
 * Returns undefined if the type is not registered.
 */
export function getContentType(type: string): ContentTypeConfig | undefined {
  return registry.get(type);
}

/**
 * Get configuration for a content type, or throw.
 */
export function requireContentType(type: string): ContentTypeConfig {
  const config = registry.get(type);
  if (!config) {
    throw new Error(`CMS: Unknown content type "${type}". Did you forget to register it?`);
  }
  return config;
}

/**
 * Get all registered content types as an array.
 */
export function getAllContentTypes(): ContentTypeConfig[] {
  return Array.from(registry.values());
}

/**
 * Get all registered type keys.
 */
export function getContentTypeKeys(): string[] {
  return Array.from(registry.keys());
}

/**
 * Check if a content type is registered.
 */
export function hasContentType(type: string): boolean {
  return registry.has(type);
}

/**
 * Utility: generate a URL-safe slug from a title string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")     // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, "-")       // Replace spaces/underscores with hyphens
    .replace(/--+/g, "-")          // Collapse multiple hyphens
    .replace(/^-+|-+$/g, "");      // Trim leading/trailing hyphens
}
