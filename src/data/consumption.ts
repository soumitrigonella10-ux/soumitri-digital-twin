// ========================================
// Content Consumption Archive Data
// ========================================

export type ContentType = "book" | "playlist" | "essay" | "video" | "movie" | "series";
export type ContentStatus = "CURRENTLY READING" | "CURRENTLY WATCHING" | "COMPLETED" | "QUEUED" | "LISTENING";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string; // Author, artist, director, etc.
  description: string;
  metadata: string; // Year, genre, etc.
  status: ContentStatus;
  imageUrl?: string; // Optional real image
  aspectRatio: "3/4" | "1/1" | "2/3" | "16/9" | "4/5";
}

export const CONTENT_TYPES = ["Books & Essays", "Movies", "Videos", "Playlists"] as const;
export type ContentFilter = typeof CONTENT_TYPES[number];

export const SUB_CHIPS = ["Looking Forward", "Recommendations", "Completed"] as const;
export type ContentSubChip = typeof SUB_CHIPS[number];

// Sample content items with diverse types
export const contentItems: ContentItem[] = [
  // Books
  {
    id: "b-1",
    type: "book",
    title: "Thinking in Systems",
    author: "Donella H. Meadows",
    description: "A primer on systems thinking and how to understand interconnected patterns in the world.",
    metadata: "2008 · Systems Theory",
    status: "CURRENTLY READING",
    aspectRatio: "3/4",
  },
  {
    id: "b-2",
    type: "book",
    title: "The Creative Act",
    author: "Rick Rubin",
    description: "A way of being. On creativity, art, and the practice of making meaningful work.",
    metadata: "2023 · Creative Process",
    status: "COMPLETED",
    aspectRatio: "3/4",
  },
  {
    id: "b-3",
    type: "book",
    title: "Exercising Taste",
    author: "Pete Searle",
    description: "How I learned to stop worrying and love good design through deliberate practice.",
    metadata: "2024 · Design Philosophy",
    status: "QUEUED",
    aspectRatio: "3/4",
  },
  {
    id: "b-4",
    type: "book",
    title: "How to Do Nothing",
    author: "Jenny Odell",
    description: "Resisting the attention economy by reclaiming our ability to pay attention to what matters.",
    metadata: "2019 · Cultural Criticism",
    status: "COMPLETED",
    aspectRatio: "3/4",
  },

  // Movies
  {
    id: "m-1",
    type: "movie",
    title: "Past Lives",
    author: "Celine Song",
    description: "Memory, longing, migration, and the invisible strings that connect us across time.",
    metadata: "2023 · Drama",
    status: "COMPLETED",
    aspectRatio: "2/3",
  },
  {
    id: "m-2",
    type: "movie",
    title: "The Brutalist",
    author: "Brady Corbet",
    description: "Architecture as autobiography. A sprawling meditation on art, ego, and legacy.",
    metadata: "2024 · Historical Drama",
    status: "CURRENTLY WATCHING",
    aspectRatio: "2/3",
  },
  {
    id: "m-3",
    type: "movie",
    title: "Aftersun",
    author: "Charlotte Wells",
    description: "A quietly devastating portrait of memory, parenthood, and the passage of time.",
    metadata: "2022 · Drama",
    status: "COMPLETED",
    aspectRatio: "2/3",
  },

  // Series
  {
    id: "s-1",
    type: "series",
    title: "Severance",
    author: "Dan Erickson",
    description: "Corporate dystopia meets existential horror. What does it mean to separate work from life?",
    metadata: "2022 · Sci-Fi Thriller",
    status: "CURRENTLY WATCHING",
    aspectRatio: "16/9",
  },
  {
    id: "s-2",
    type: "series",
    title: "Succession",
    author: "Jesse Armstrong",
    description: "A familial tragedy disguised as a corporate drama. Power, inheritance, and dysfunction.",
    metadata: "2018-2023 · Drama",
    status: "COMPLETED",
    aspectRatio: "16/9",
  },

  // Playlists
  {
    id: "p-1",
    type: "playlist",
    title: "Work: Deep Focus",
    author: "Curated",
    description: "Ambient soundscapes and minimal instrumentation for sustained attention.",
    metadata: "2024 · 42 Tracks",
    status: "LISTENING",
    aspectRatio: "1/1",
  },
  {
    id: "p-2",
    type: "playlist",
    title: "Evening Rituals",
    author: "Curated",
    description: "Warm jazz and downtempo grooves for winding down after a long day.",
    metadata: "2024 · 28 Tracks",
    status: "LISTENING",
    aspectRatio: "1/1",
  },

  // Essays/Articles
  {
    id: "e-1",
    type: "essay",
    title: "The Succession Effect",
    author: "Various",
    description: "How prestige TV rewired corporate aesthetics and reshaped cultural taste.",
    metadata: "Culture Analysis · 2023",
    status: "COMPLETED",
    aspectRatio: "4/5",
  },
  {
    id: "e-2",
    type: "essay",
    title: "On Curation vs. Creation",
    author: "Soumitri",
    description: "The quiet art of selecting, arranging, and presenting. Why limitation breeds clarity.",
    metadata: "Personal Essay · 2026",
    status: "COMPLETED",
    aspectRatio: "4/5",
  },

  // Videos/Documentaries
  {
    id: "v-1",
    type: "video",
    title: "Christopher Alexander",
    author: "Murray Silverstein",
    description: "A master builder discusses patterns, beauty, and the nature of order in architecture.",
    metadata: "1996 · Documentary",
    status: "QUEUED",
    aspectRatio: "16/9",
  },
  {
    id: "v-2",
    type: "video",
    title: "Dieter Rams: Ten Principles",
    author: "Gary Hustwit",
    description: "The legendary designer on simplicity, clarity, and good design.",
    metadata: "2018 · Short Film",
    status: "COMPLETED",
    aspectRatio: "16/9",
  },
];

// Helper functions
export function getItemsByType(type: ContentFilter): ContentItem[] {
  const typeMap: Record<ContentFilter, ContentType[]> = {
    "Books & Essays": ["book", "essay"],
    Movies: ["movie"],
    Videos: ["video", "series"],
    Playlists: ["playlist"],
  };
  
  const targetTypes = typeMap[type];
  return contentItems.filter(item => targetTypes.includes(item.type));
}

// Sub-chip status mapping
const SUB_CHIP_STATUSES: Record<ContentSubChip, ContentStatus[]> = {
  "Looking Forward": ["QUEUED"],
  "Recommendations": ["CURRENTLY READING", "CURRENTLY WATCHING", "LISTENING"],
  "Completed": ["COMPLETED"],
};

export function getItemsBySubChip(
  type: ContentFilter,
  subChip: ContentSubChip
): ContentItem[] {
  const items = getItemsByType(type);
  const allowedStatuses = SUB_CHIP_STATUSES[subChip];
  return items.filter(item => allowedStatuses.includes(item.status));
}

export function getItemById(id: string): ContentItem | undefined {
  return contentItems.find(item => item.id === id);
}
