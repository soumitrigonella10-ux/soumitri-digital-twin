// ========================================
// Public Curation Topics
// ========================================

export interface Topic {
  slug: string;
  title: string;
  description: string;
  isPublic: boolean;
  icon: string; // lucide icon name
  iconColor: string; // tailwind text color class for the icon
  iconBg: string; // tailwind bg color class for the icon container
  displayOrder: number;
  subTabs?: SubTab[];
}

export interface SubTab {
  id: string;
  label: string;
  displayOrder: number;
}

export const topics: Topic[] = [
  {
    slug: "wishlist",
    title: "Wishlist",
    description: "A running list of objects I'm considering. No expectations attached.",
    isPublic: true,
    icon: "heart",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    displayOrder: 1,
  },
  {
    slug: "skills-i-want-to-learn",
    title: "Skills to Learn",
    description: "An honest inventory of gaps I intend to close.",
    isPublic: false,
    icon: "graduation-cap",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    displayOrder: 2,
  },
  {
    slug: "reading-list",
    title: "Reading List",
    description: "Books, papers, and longform pieces queued or completed.",
    isPublic: true,
    icon: "book-open",
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50",
    displayOrder: 3,
  },
  {
    slug: "art-i-made",
    title: "Art I Made",
    description: "Things I built, drew, wrote, or shaped into existence.",
    isPublic: true,
    icon: "pen-tool",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    displayOrder: 4,
    subTabs: [
      { id: "gallery", label: "Gallery", displayOrder: 1 },
      { id: "notes", label: "Notes", displayOrder: 2 },
    ],
  },
  {
    slug: "pop-culture-lore",
    title: "Pop Culture Lore",
    description: "References, obsessions, and cultural artifacts I track.",
    isPublic: true,
    icon: "tv",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    displayOrder: 5,
  },
  {
    slug: "food",
    title: "Food",
    description: "Recipes, restaurants, and culinary notes.",
    isPublic: true,
    icon: "utensils",
    iconColor: "text-lime-600",
    iconBg: "bg-lime-50",
    displayOrder: 6,
  },
  {
    slug: "sidequests",
    title: "Sidequests",
    description: "Micro-projects and tangents worth following.",
    isPublic: false,
    icon: "compass",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    displayOrder: 7,
  },
  {
    slug: "sam-philosophy",
    title: "Sam Philosophy",
    description: "Operating principles and internal frameworks.",
    isPublic: false,
    icon: "lightbulb",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    displayOrder: 8,
  },
  {
    slug: "cities-im-curious-about",
    title: "Curious Cities",
    description: "Places I want to understand, not just visit.",
    isPublic: false,
    icon: "map-pin",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    displayOrder: 9,
  },
  {
    slug: "essays",
    title: "Essays",
    description: "Long-form thinking on things that matter to me.",
    isPublic: false,
    icon: "file-text",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    displayOrder: 10,
  },
  {
    slug: "watchlist",
    title: "Watchlist",
    description: "Films, series, and visual media on the radar.",
    isPublic: true,
    icon: "monitor",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    displayOrder: 11,
  },
  {
    slug: "art-i-want-to-inhale",
    title: "Art to Inhale",
    description: "Work by others that I want to absorb completely.",
    isPublic: true,
    icon: "palette",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    displayOrder: 12,
    subTabs: [
      { id: "gallery", label: "Gallery", displayOrder: 1 },
      { id: "links", label: "Links", displayOrder: 2 },
      { id: "notes", label: "Notes", displayOrder: 3 },
    ],
  },
];

// Helper: get all public topic slugs
export function getPublicTopicSlugs(): string[] {
  return topics.filter((t) => t.isPublic).map((t) => t.slug);
}

// Helper: find topic by slug
export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
