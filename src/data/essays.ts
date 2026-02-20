// ========================================
// Essays — Editorial Archive Data
// ========================================

export interface Essay {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  tags?: string[];
  slug: string;
  /** Path to PDF file in public/pdfs/essays/ (e.g. "/pdfs/essays/on-taste.pdf") */
  pdfUrl?: string;
  /** @deprecated Legacy essay body content - now using PDFs for display */
  body?: EssayBlock[];
}

/** Content block types for structured essay rendering (legacy - now using PDFs) */
export type EssayBlock =
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string; attribution?: string }
  | { type: "heading"; text: string }
  | { type: "separator" };

export const ESSAY_CATEGORIES = [
  "All",
  "Philosophy",
  "History",
  "Culture",
  "Don't be absurd, I have a list of things I hate",
  "Personal",
] as const;

export type EssayCategory = (typeof ESSAY_CATEGORIES)[number];

export const essays: Essay[] = [
  {
    id: "es-1",
    slug: "on-taste",
    title: "On Taste",
    excerpt:
      "What it means to have taste versus having preferences. The difference is conviction — taste is an argument you're willing to defend, preferences are habits you've never examined.",
    category: "Philosophy",
    date: "January 2026",
    readingTime: "8 min read",
    imageUrl: "/images/essays/on-taste.jpg",
    isFeatured: true,
    tags: ["aesthetics", "identity", "curation"],
    pdfUrl: "/pdfs/essays/kyoto-2025.pdf",
  },
  /*
  {
    id: "es-2",
    slug: "the-architecture-of-daily-rituals",
    title: "The Architecture of Daily Rituals",
    excerpt:
      "Every morning is a small act of construction. The order of operations matters — not because of productivity, but because rhythm is how we author our days instead of merely surviving them.",
    category: "Personal",
    date: "December 2025",
    readingTime: "12 min read",
    imageUrl: "/images/essays/daily-rituals.jpg",
    isFeatured: true,
    tags: ["routines", "intentionality", "time"],
    pdfUrl: "/pdfs/essays/the-architecture-of-daily-rituals.pdf",
  },
  {
    id: "es-3",
    slug: "against-minimalism",
    title: "Against Minimalism (As Religion)",
    excerpt:
      "Minimalism became its own form of maximalism — a lifestyle brand dressed in linen. What if the goal isn't fewer things, but better reasons for the things we keep?",
    category: "Thoughts",
    date: "November 2025",
    readingTime: "10 min read",
    imageUrl: "/images/essays/against-minimalism.jpg",
    tags: ["design", "consumerism", "intention"],
    pdfUrl: "/pdfs/essays/against-minimalism.pdf",
  },
  {
    id: "es-4",
    slug: "the-digital-twin-hypothesis",
    title: "The Digital Twin Hypothesis",
    excerpt:
      "Building a mirror of your life in software isn't vanity — it's introspection at scale. What happens when your decisions become data you can revisit, question, and learn from?",
    category: "Don't be absurd, I have a list of things I hate",
    date: "October 2025",
    readingTime: "15 min read",
    imageUrl: "/images/essays/digital-twin.jpg",
    tags: ["software", "self-knowledge", "systems"],
    pdfUrl: "/pdfs/essays/the-digital-twin-hypothesis.pdf",
  },
  {
    id: "es-5",
    slug: "on-clothing-as-language",
    title: "On Clothing as Language",
    excerpt:
      "We dress in sentences. Some days we whisper, other days we make declarations. The wardrobe is less a closet and more a vocabulary — assembled over years, revised every morning.",
    category: "Culture",
    date: "September 2025",
    readingTime: "7 min read",
    imageUrl: "/images/essays/clothing-language.jpg",
    tags: ["fashion", "semiotics", "expression"],
    pdfUrl: "/pdfs/essays/on-clothing-as-language.pdf",
  },
  {
    id: "es-6",
    slug: "systems-over-goals",
    title: "Systems Over Goals",
    excerpt:
      "Why I optimize for repeatable processes, not outcomes. Goals are destination-oriented; systems are journey-oriented. One is fragile, the other is antifragile.",
    category: "Philosophy",
    date: "August 2025",
    readingTime: "9 min read",
    imageUrl: "/images/essays/systems-goals.jpg",
    tags: ["productivity", "philosophy", "growth"],
    pdfUrl: "/pdfs/essays/systems-over-goals.pdf",
  },
  {
    id: "es-7",
    slug: "the-loneliness-of-good-taste",
    title: "The Loneliness of Good Taste",
    excerpt:
      "Refinement is a narrowing. The more precisely you know what you want, the fewer people will understand why. This is the quiet cost of curation.",
    category: "Personal",
    date: "July 2025",
    readingTime: "6 min read",
    imageUrl: "/images/essays/good-taste.jpg",
    tags: ["solitude", "curation", "identity"],
    pdfUrl: "/pdfs/essays/the-loneliness-of-good-taste.pdf",
  },
  {
    id: "es-8",
    slug: "in-defense-of-friction",
    title: "In Defense of Friction",
    excerpt:
      "Silicon Valley wants to eliminate every inconvenience. But friction is where thought lives — in the pause before a purchase, the effort of cooking, the discipline of a morning walk.",
    category: "Don't be absurd, I have a list of things I hate",
    date: "June 2025",
    readingTime: "11 min read",
    imageUrl: "/images/essays/friction.jpg",
    tags: ["technology", "slowness", "intention"],
    pdfUrl: "/pdfs/essays/in-defense-of-friction.pdf",
  },
  */
];

// Helpers
export function getEssayBySlug(slug: string): Essay | undefined {
  return essays.find((e) => e.slug === slug);
}

export function getEssaysByCategory(category: string): Essay[] {
  if (category === "All") return essays;
  return essays.filter((e) => e.category === category);
}

export function getFeaturedEssays(): Essay[] {
  return essays.filter((e) => e.isFeatured);
}
