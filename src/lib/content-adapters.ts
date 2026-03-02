// ========================================
// Content Adapters
//
// Shared adapter functions that convert domain types (Essay, Sidequest,
// TravelLocation, DesignThought) into the unified ContentData shape
// consumed by ContentRenderer.
//
// Each adapter uses a "prefer structured, fall back to scalar" pattern:
//   - If the domain object already has `media[]`, pass it through.
//   - Otherwise, build a single-item array from `imageUrl`.
//   - Same for `contentMeta[]` → fall back to manual key-value pairs.
//
// This means pages never duplicate adapter logic, and when the DB
// starts returning structured JSONB, adapters shrink to near-passthrough.
// ========================================

import type { ContentData, MediaItem, MetadataEntry } from "@/components/content-renderer";
import type {
  Essay,
  Sidequest,
  TravelLocation,
  DesignThought,
} from "@/types/editorial";

// ── Helpers ──────────────────────────────

/** Build a single-image media array from a plain imageUrl, or return undefined. */
function imageToMedia(imageUrl: string | undefined, alt: string): MediaItem[] | undefined {
  if (!imageUrl) return undefined;
  return [{ src: imageUrl, alt, type: "image" as const }];
}

// ── Essay → ContentData (pdf-single) ─────

export function essayToContentData(essay: Essay): ContentData {
  const media: MediaItem[] | undefined =
    essay.media ?? imageToMedia(essay.imageUrl, essay.title);

  const metadata: MetadataEntry[] =
    essay.contentMeta ?? [
      { label: "Category", value: essay.category },
      { label: "Date", value: essay.date },
      { label: "Reading Time", value: essay.readingTime },
    ];

  return {
    id: essay.id,
    title: essay.title,
    subtitle: essay.excerpt,
    ...(essay.pdfUrl ? { pdfUrl: essay.pdfUrl } : {}),
    ...(media ? { media } : {}),
    tags: [
      { label: essay.category },
      ...(essay.tags ?? []).map((t) => ({ label: t })),
    ],
    metadata,
    trackingLabel: essay.readingTime,
    footerLabel: "Essays Archive",
  };
}

// ── Sidequest → ContentData (split-detail) ─

export function sidequestToContentData(quest: Sidequest): ContentData {
  const media: MediaItem[] | undefined =
    quest.media ?? imageToMedia(quest.imageUrl, quest.title);

  const metadata: MetadataEntry[] =
    quest.contentMeta ?? [
      { label: "Category", value: quest.category },
      { label: "Difficulty", value: quest.difficulty },
    ];

  return {
    id: quest.id,
    title: quest.title,
    subtitle: quest.description,
    body: quest.questLog,
    trackingLabel: `Entry ${quest.entryId}`,
    isCompleted: quest.completed,
    ...(media ? { media } : {}),
    tags: [
      { label: quest.category },
      { label: quest.difficulty },
    ],
    metadata,
    footerLabel: "Sidequests Archive",
  };
}

// ── TravelLocation → ContentData (pdf-flipbook) ─

export function locationToContentData(location: TravelLocation): ContentData {
  const media: MediaItem[] | undefined =
    location.media ??
    imageToMedia(location.imageUrl, `${location.name}, ${location.country}`);

  const metadata: MetadataEntry[] =
    location.contentMeta ?? [
      { label: "Coordinates", value: location.coordinates },
      { label: "Date", value: location.dateVisited },
      { label: "Climate", value: location.climate },
      { label: "Duration", value: location.duration },
    ];

  return {
    id: location.id,
    title: location.name,
    subtitle: location.country,
    pdfUrl: location.pdfUrl,
    ...(media ? { media } : {}),
    tags: [{ label: location.country }, { label: location.duration }],
    metadata,
    body: location.notes,
    trackingLabel: location.dateVisited,
    footerLabel: "Travel Archive",
  };
}

// ── DesignThought → ContentData (pdf-flipbook) ─

export function thoughtToContentData(thought: DesignThought): ContentData {
  const media: MediaItem[] | undefined = thought.media ?? undefined;

  const metadata: MetadataEntry[] =
    thought.contentMeta ?? [
      { label: "Category", value: thought.category },
      { label: "Date", value: thought.date },
      { label: "Card Type", value: thought.cardType },
    ];

  return {
    id: thought.id,
    title: thought.title,
    ...(thought.subtitle ? { subtitle: thought.subtitle } : {}),
    ...(thought.pdfUrl ? { pdfUrl: thought.pdfUrl } : {}),
    ...(media ? { media } : {}),
    tags: [{ label: thought.category }],
    metadata,
    trackingLabel: thought.date,
    footerLabel: "Design Theology Archive",
  };
}
