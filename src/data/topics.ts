// ========================================
// Public Curation Topics
// ========================================

import type { Topic, SubTab } from "@/types/editorial";
export type { Topic, SubTab };

export const topics: Topic[] = [
  {
    slug: "essays",
    title: "Essays",
    description: "Long-form thinking.",
    isPublic: true,
    icon: "file-text",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    displayOrder: 1,
  },
  {
    slug: "internet-lore",
    title: "Internet Lore",
    description: "Fragments from the deep web, screenshots nobody asked for, and the kind of posts you send to exactly one person at 2 a.m.",
    isPublic: true,
    icon: "globe",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    displayOrder: 10,
  },
  {
    slug: "travel-log",
    title: "Travel Log",
    description: "Places I want to understand, not just visit.",
    isPublic: true,
    icon: "map-pin",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    displayOrder: 3,
  },
  {
    slug: "content-consumption",
    title: "Content Consumption",
    description: "An archive of cultural intake.",
    isPublic: true,
    icon: "monitor",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    displayOrder: 4,
    // Sub-tabs removed — /consumption page uses its own filter system
    // (CONTENT_TYPES + SUB_CHIPS from data/consumption.ts)
  },
  {
    slug: "wishlist",
    title: "Wishlist",
    description: "A running list of objects I'm considering.",
    isPublic: true,
    icon: "heart",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    displayOrder: 5,
  },
  {
    slug: "skilling",
    title: "Skill / Side Quests",
    description: "Master of all trades, jack of none.",
    isPublic: true,
    icon: "graduation-cap",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    displayOrder: 6,
  },
  {
    slug: "art",
    title: "Art",
    description: "A collection of creative experiments and visual studies.",
    isPublic: true,
    icon: "pen-tool",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    displayOrder: 7,
    subTabs: [
      { id: "gallery", label: "Gallery", displayOrder: 1 },
      { id: "notes", label: "Notes", displayOrder: 2 },
    ],
  },
  {
    slug: "inspiration",
    title: "Inspiration",
    description: "Small fragments of influence—tacked on, torn out, and treasured.",
    isPublic: true,
    icon: "palette",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
    displayOrder: 8,
    subTabs: [
      { id: "gallery", label: "Gallery", displayOrder: 1 },
      { id: "links", label: "Links", displayOrder: 2 },
      { id: "notes", label: "Notes", displayOrder: 3 },
    ],
  },
  {
    slug: "design-thoughts",
    title: "Design Thoughts",
    description: "A working document of principles, beliefs, and process notes from the drafting table.",
    isPublic: true,
    icon: "lightbulb",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    displayOrder: 9,
  },
  // ========================================
  // Private Topics (Require Authentication)
  // ========================================
  {
    slug: "routines",
    title: "Routines",
    description: "Personal care routines and beauty rituals.",
    isPublic: false,
    icon: "calendar",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    displayOrder: 100,
  },
  {
    slug: "manage",
    title: "Manage",
    description: "Content management and administration interface.",
    isPublic: false,
    icon: "settings",
    iconColor: "text-slate-600",
    iconBg: "bg-slate-50",
    displayOrder: 101,
  },
  {
    slug: "fitness",
    title: "Fitness",
    description: "Workout tracking and fitness planning.",
    isPublic: false,
    icon: "activity",
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    displayOrder: 102,
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    description: "Meal planning and nutritional tracking.",
    isPublic: false,
    icon: "utensils",
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    displayOrder: 103,
  },
  {
    slug: "week",
    title: "Week",
    description: "Weekly planning and schedule management.",
    isPublic: false,
    icon: "calendar-days",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    displayOrder: 104,
  },
];

// Helper: get all public topic slugs
export function getPublicTopicSlugs(): string[] {
  return topics.filter((t) => t.isPublic).map((t) => t.slug);
}

// Helper: get all private topic slugs
export function getPrivateTopicSlugs(): string[] {
  return topics.filter((t) => !t.isPublic).map((t) => t.slug);
}

// Helper: find topic by slug
export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

// Helper: get the route href for a topic slug
// Maps editorial slugs to their actual page routes
export function getTopicHref(slug: string): string {
  const routeMap: Record<string, string> = {
    essays: "/essays",
    wishlist: "/inventory/wishlist",
    "internet-lore": "/sidequests",
    "content-consumption": "/consumption",
    "travel-log": "/travel-log",
    skilling: "/skills",
    art: "/artifacts",
    "design-thoughts": "/design-theology",
    inspiration: "/inspiration",
  };
  
  return routeMap[slug] ?? `/${slug}`;
}
