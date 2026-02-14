// ========================================
// Public Curation Items (Content for Topic Pages)
// ========================================

export interface CurationItem {
  id: string;
  topicSlug: string;
  subTabId?: string;
  title: string;
  description: string;
  link?: string;
  date?: string;
  tags?: string[];
  isPublic: boolean;
  displayOrder: number;
}

// Seed items — expand as content grows
export const items: CurationItem[] = [
  // Wishlist items are managed separately in data/wishlist.ts
  // These are placeholder entries for other topics

  // Art
  {
    id: "aim-1",
    topicSlug: "art",
    subTabId: "gallery",
    title: "Untitled Series I",
    description: "Mixed media explorations, early 2025.",
    isPublic: true,
    displayOrder: 1,
  },

  // Content Consumption — Culture
  {
    id: "pcl-1",
    topicSlug: "content-consumption",
    subTabId: "culture",
    title: "The Succession Effect",
    description: "How prestige TV rewired corporate aesthetics.",
    isPublic: true,
    displayOrder: 1,
  },

  // Content Consumption — Watching
  {
    id: "wl-1",
    topicSlug: "content-consumption",
    subTabId: "watching",
    title: "Past Lives",
    description: "Celine Song. Memory, longing, migration.",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: "wl-2",
    topicSlug: "content-consumption",
    subTabId: "watching",
    title: "The Brutalist",
    description: "Brady Corbet. Architecture as autobiography.",
    isPublic: true,
    displayOrder: 2,
  },

  // Content Consumption — Reading
  {
    id: "rl-1",
    topicSlug: "content-consumption",
    subTabId: "reading",
    title: "Thinking in Systems",
    description: "Donella Meadows. Systems thinking primer.",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: "rl-2",
    topicSlug: "content-consumption",
    subTabId: "reading",
    title: "The Creative Act",
    description: "Rick Rubin. A way of being.",
    isPublic: true,
    displayOrder: 2,
  },

  // Inspiration
  {
    id: "aiwti-1",
    topicSlug: "inspiration",
    subTabId: "gallery",
    title: "James Turrell — Light Installations",
    description: "Perception as medium. Light as material.",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: "aiwti-2",
    topicSlug: "inspiration",
    subTabId: "links",
    title: "Olafur Eliasson Studio",
    description: "Nature, geometry, and participatory art.",
    link: "https://olafureliasson.net",
    isPublic: true,
    displayOrder: 2,
  },

  // Private topic seed items
  {
    id: "sq-1",
    topicSlug: "sidequests",
    title: "Build a weather station",
    description: "Raspberry Pi + sensors. Data logging to local dashboard.",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: "es-1",
    topicSlug: "essays",
    title: "On Taste",
    description: "What it means to have taste vs. having preferences.",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: "sk-1",
    topicSlug: "skilling",
    title: "Carpentry fundamentals",
    description: "Joinery, hand tools, wood selection.",
    isPublic: false,
    displayOrder: 1,
  },
  {
    id: "ct-1",
    topicSlug: "travel-log",
    title: "Lisbon",
    description: "Light, tiling, port wine, slow pace.",
    isPublic: true,
    displayOrder: 1,
  },
];

// Helper: get items for a topic (optionally filtered by sub-tab)
export function getItemsByTopic(topicSlug: string, subTabId?: string): CurationItem[] {
  return items
    .filter((item) => {
      if (item.topicSlug !== topicSlug) return false;
      if (subTabId && item.subTabId !== subTabId) return false;
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// Helper: get public items only
export function getPublicItemsByTopic(topicSlug: string, subTabId?: string): CurationItem[] {
  return getItemsByTopic(topicSlug, subTabId).filter((item) => item.isPublic);
}
