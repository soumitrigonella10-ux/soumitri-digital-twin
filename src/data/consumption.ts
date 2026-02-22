// ========================================
// Content Consumption Archive Data
// ========================================

import type { ContentItem, ContentType, ContentStatus } from "@/types/editorial";
export type { ContentItem, ContentType, ContentStatus };

export const CONTENT_TYPES = ["Books & Essays", "Movies & Series", "Videos", "Playlists"] as const;
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
    language: "English",
    genre: "Creative Process",
    comment: "Creativity is a way of living, not a talent you possess.",
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
    language: "English",
    genre: "Cultural Criticism",
    comment: "Doing nothing is an act of political resistance.",
  },
  {
    id: "b-5",
    type: "book",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A sweeping history of humankind from the Stone Age to the Silicon Age.",
    metadata: "2011 · History",
    status: "COMPLETED",
    aspectRatio: "3/4",
    language: "English",
    genre: "History",
    comment: "Fiction is the glue that holds civilisation together.",
  },
  {
    id: "b-6",
    type: "book",
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    description: "The Japanese secret to a long and happy life through purpose.",
    metadata: "2016 · Philosophy",
    status: "COMPLETED",
    aspectRatio: "3/4",
    language: "English",
    genre: "Philosophy",
    comment: "Purpose is found at the intersection of love, skill, need, and reward.",
  },
  {
    id: "b-7",
    type: "book",
    title: "Convenience Store Woman",
    author: "Sayaka Murata",
    description: "A woman finds comfort and identity working in a convenience store.",
    metadata: "2016 · Literary Fiction",
    status: "COMPLETED",
    aspectRatio: "3/4",
    language: "Japanese",
    genre: "Literary Fiction",
    comment: "Normalcy is the most violent expectation society imposes.",
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
    language: "English / Korean",
    genre: "Romance",
    comment: "The quiet ache of lives unlived and paths not taken.",
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
    language: "English",
    genre: "Drama",
    comment: "Memory distorts; love remains.",
  },
  {
    id: "m-4",
    type: "movie",
    title: "Dune: Part Two",
    author: "Denis Villeneuve",
    description: "An epic continuation of the desert saga, balancing spectacle with political intrigue.",
    metadata: "2024 · Sci-Fi",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "English",
    genre: "Sci-Fi",
    comment: "A cinematic triumph of scale and sound.",
  },
  {
    id: "m-5",
    type: "movie",
    title: "Perfect Days",
    author: "Wim Wenders",
    description: "A Tokyo toilet cleaner finds beauty in routine and the small rhythms of daily life.",
    metadata: "2023 · Slice of Life",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "Japanese",
    genre: "Slice of Life",
    comment: "Finding profound beauty in the mundane routines of life.",
  },
  {
    id: "m-6",
    type: "movie",
    title: "Anatomy of a Fall",
    author: "Justine Triet",
    description: "A writer on trial for her husband's death. Truth becomes a matter of perspective.",
    metadata: "2023 · Thriller",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "French / English",
    genre: "Thriller",
    comment: "Truth is elusive, subjective, and easily manipulated.",
  },
  {
    id: "m-7",
    type: "movie",
    title: "Decision to Leave",
    author: "Park Chan-Wook",
    description: "A detective becomes obsessed with a suspect during a murder investigation.",
    metadata: "2022 · Mystery",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "Korean",
    genre: "Mystery",
    comment: "A meticulously crafted detective romance.",
  },
  {
    id: "m-8",
    type: "movie",
    title: "Oppenheimer",
    author: "Christopher Nolan",
    description: "The story of the man who built the atomic bomb and the moral weight it carried.",
    metadata: "2023 · Historical Drama",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "English",
    genre: "Historical Drama",
    comment: "Genius without conscience is humanity's greatest threat.",
  },
  {
    id: "m-9",
    type: "movie",
    title: "The Zone of Interest",
    author: "Jonathan Glazer",
    description: "The banality of evil, rendered through the domestic life of an Auschwitz commandant.",
    metadata: "2023 · Drama",
    status: "COMPLETED",
    aspectRatio: "2/3",
    language: "English / German",
    genre: "Drama",
    comment: "Horror lives in what you choose not to see.",
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
    language: "English",
    genre: "Drama",
    comment: "Power doesn't corrupt — it reveals.",
  },
  {
    id: "s-3",
    type: "series",
    title: "Fleabag",
    author: "Phoebe Waller-Bridge",
    description: "A darkly comedic confession about grief, desire, and self-destruction.",
    metadata: "2016-2019 · Comedy Drama",
    status: "COMPLETED",
    aspectRatio: "16/9",
    language: "English",
    genre: "Comedy Drama",
    comment: "The fourth wall is just another way to hide.",
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
    language: "English",
    genre: "Culture Analysis",
    comment: "Quiet luxury started on screen before it hit the streets.",
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
    language: "English",
    genre: "Personal Essay",
    comment: "Taste is the residue of a thousand tiny decisions.",
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
    language: "English / German",
    genre: "Design",
    comment: "Less, but better — the only design brief you need.",
  },
  {
    id: "v-3",
    type: "video",
    title: "Abstract: The Art of Design",
    author: "Scott Dadich",
    description: "Each episode profiles a different designer pushing the boundaries of their craft.",
    metadata: "2017 · Documentary Series",
    status: "COMPLETED",
    aspectRatio: "16/9",
    language: "English",
    genre: "Design",
    comment: "Great design is invisible until you notice it everywhere.",
  },
  {
    id: "v-4",
    type: "video",
    title: "Jiro Dreams of Sushi",
    author: "David Gelb",
    description: "An 85-year-old sushi master pursues perfection through relentless dedication.",
    metadata: "2011 · Documentary",
    status: "COMPLETED",
    aspectRatio: "16/9",
    language: "Japanese",
    genre: "Documentary",
    comment: "Mastery is the art of repeating the basics forever.",
  },
];

// Helper functions
export function getItemsByType(type: ContentFilter): ContentItem[] {
  const typeMap: Record<ContentFilter, ContentType[]> = {
    "Books & Essays": ["book", "essay"],
    "Movies & Series": ["movie", "series"],
    Videos: ["video"],
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

/** Get all unique languages across completed items (for filter dropdown) */
export function getCompletedLanguages(type?: ContentFilter): string[] {
  let items = contentItems.filter(i => i.status === "COMPLETED" && i.language);
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  const langs = new Set(items.map(i => i.language!));
  return Array.from(langs).sort();
}

/** Get all unique genres across completed items (for filter dropdown) */
export function getCompletedGenres(type?: ContentFilter): string[] {
  let items = contentItems.filter(i => i.status === "COMPLETED" && i.genre);
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  const genres = new Set(items.map(i => i.genre!));
  return Array.from(genres).sort();
}

/** Get all completed items, optionally filtered by content-type tab, language, genre, and sub-type */
export function getCompletedItems(
  type?: ContentFilter,
  language?: string,
  genre?: string,
  subType?: ContentType
): ContentItem[] {
  let items = contentItems.filter(i => i.status === "COMPLETED");
  if (type) {
    const typeItems = getItemsByType(type);
    const ids = new Set(typeItems.map(i => i.id));
    items = items.filter(i => ids.has(i.id));
  }
  if (subType) {
    items = items.filter(i => i.type === subType);
  }
  if (language) {
    items = items.filter(i => i.language === language);
  }
  if (genre) {
    items = items.filter(i => i.genre === genre);
  }
  return items;
}
