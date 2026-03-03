# Legacy Schema Archive

**Moved here: March 2026**

These Drizzle table definitions were part of the original per-type editorial schema
created in migration `0000_initial-schema.sql` and extended in `0001_add-flexible-jsonb.sql`.

## Why they were removed

The codebase migrated to a **universal polymorphic table** (`content_items`) in migration
`0002_content-items.sql`. The CMS system (`src/cms/`) reads and writes exclusively to
`content_items`, storing type-specific data in JSONB `payload` and `metadata` columns
validated by Zod schemas at the application layer.

The legacy tables were:
- **Seeded** by `scripts/seed.ts` from static `@/data/*` TypeScript files
- **Never queried at runtime** — all pages merge static data with `content_items` via `@/cms/actions`
- **Dropped** in migration `0004_drop-legacy-editorial.sql`

## Tables dropped

| Legacy table | Content type in `content_items` |
|---|---|
| `essays` | `type = "essay"` |
| `consumption_items` | `type = "consumption"` |
| `sidequests` | `type = "sidequest"` |
| `skill_experiments` | `type = "skill"` |
| `travel_locations` | `type = "travel"` |
| `design_thoughts` | `type = "design-thought"` |
| `topics` | N/A (routing config, now in `src/data/topics.ts`) |
| `artifacts` | `type = "artifact"` |
| `inspirations` | `type = "inspiration"` |

## Where the data lives now

- **Static seed data**: `src/data/*` TypeScript files (unchanged, used as build-time fallback)
- **CMS-managed content**: `content_items` table via the admin UI at `/admin`
- **Pages merge both sources** at render time, with CMS items winning on slug/ID conflicts

## Files in this directory

- `editorial.ts` — Drizzle definitions for essays, consumption, sidequests, skills, travel, design thoughts, topics
- `artifacts.ts` — Drizzle definitions for artifacts and inspirations

These files are kept for **historical reference only** and are not imported anywhere.
