import {
  Sun,
  Sparkles,
  Droplets,
  Target,
  Wind,
  Shirt,
  Coffee,
  UtensilsCrossed,
  Moon,
  ShoppingCart,
  Dumbbell,
  Heart,
  PenTool,
  Compass,
  FileText,
  GraduationCap,
  Tv,
  Lightbulb,
  Monitor,
  BookOpen,
  Utensils,
  MapPin,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { topics } from "@/data/topics";

// ========================================
// Category Configuration
// ========================================
export interface SidebarCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgClass: string;
  borderClass: string;
  group: string;
  subCategories?: { id: string; name: string; href: string }[];
}

export const categories: SidebarCategory[] = [
  // Daily Logic
  {
    id: "today",
    name: "Today",
    icon: Sun,
    href: "/",
    color: "lifeos-today",
    bgClass: "bg-category-today",
    borderClass: "border-category-today",
    group: "Daily Logic",
  },
  // Routines
  {
    id: "skin",
    name: "Skin",
    icon: Sparkles,
    href: "/routines/skin",
    color: "lifeos-skin",
    bgClass: "bg-category-skin",
    borderClass: "border-category-skin",
    group: "Routines",
  },
  {
    id: "body",
    name: "Body",
    icon: Droplets,
    href: "/routines/body",
    color: "lifeos-body",
    bgClass: "bg-category-body",
    borderClass: "border-category-body",
    group: "Routines",
  },
  {
    id: "bodySpecific",
    name: "Body Specifics",
    icon: Target,
    href: "/routines/body-specifics",
    color: "lifeos-bodySpecific",
    bgClass: "bg-category-bodySpecific",
    borderClass: "border-category-bodySpecific",
    group: "Routines",
  },
  {
    id: "hair",
    name: "Hair",
    icon: Wind,
    href: "/routines/hair",
    color: "lifeos-hair",
    bgClass: "bg-category-hair",
    borderClass: "border-category-hair",
    group: "Routines",
  },
  {
    id: "makeup",
    name: "Makeup",
    icon: Sparkles,
    href: "/routines/makeup",
    color: "lifeos-makeup",
    bgClass: "bg-category-makeup",
    borderClass: "border-category-makeup",
    group: "Routines",
  },
  // Inventory
  {
    id: "wardrobe",
    name: "Wardrobe",
    icon: Shirt,
    href: "/inventory/wardrobe",
    color: "lifeos-wardrobe",
    bgClass: "bg-category-wardrobe",
    borderClass: "border-category-wardrobe",
    group: "Inventory",
    subCategories: [
      { id: "tops", name: "Tops", href: "/inventory/wardrobe/tops" },
      { id: "bottoms", name: "Bottoms", href: "/inventory/wardrobe/bottoms" },
      { id: "dresses", name: "Dresses", href: "/inventory/wardrobe/dresses" },
      { id: "outerwear", name: "Outerwear", href: "/inventory/wardrobe/outerwear" },
      { id: "shoes", name: "Shoes", href: "/inventory/wardrobe/shoes" },
      { id: "innerwear", name: "Innerwear", href: "/inventory/wardrobe/innerwear" },
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery",
    icon: Shirt,
    href: "/inventory/jewellery",
    color: "lifeos-jewellery",
    bgClass: "bg-category-jewellery",
    borderClass: "border-category-jewellery",
    group: "Inventory",
  },
  // Nutrition
  {
    id: "breakfast",
    name: "Breakfast",
    icon: Coffee,
    href: "/nutrition/breakfast",
    color: "lifeos-breakfast",
    bgClass: "bg-category-breakfast",
    borderClass: "border-category-breakfast",
    group: "Nutrition",
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: UtensilsCrossed,
    href: "/nutrition/lunch",
    color: "lifeos-lunch",
    bgClass: "bg-category-lunch",
    borderClass: "border-category-lunch",
    group: "Nutrition",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: Moon,
    href: "/nutrition/dinner",
    color: "lifeos-dinner",
    bgClass: "bg-category-dinner",
    borderClass: "border-category-dinner",
    group: "Nutrition",
  },
  {
    id: "grocery",
    name: "Grocery List",
    icon: ShoppingCart,
    href: "/nutrition/grocery",
    color: "lifeos-grocery",
    bgClass: "bg-category-grocery",
    borderClass: "border-category-grocery",
    group: "Nutrition",
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: Sun,
    href: "/nutrition/wellness",
    color: "lifeos-wellness",
    bgClass: "bg-category-wellness",
    borderClass: "border-category-wellness",
    group: "Nutrition",
  },
  // Physicality
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    href: "/fitness",
    color: "lifeos-fitness",
    bgClass: "bg-category-fitness",
    borderClass: "border-category-fitness",
    group: "Physicality",
  },
];

// Icon map for public curation topics
const TOPIC_ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  "pen-tool": PenTool,
  compass: Compass,
  "file-text": FileText,
  "graduation-cap": GraduationCap,
  tv: Tv,
  lightbulb: Lightbulb,
  monitor: Monitor,
  "book-open": BookOpen,
  utensils: Utensils,
  "map-pin": MapPin,
  palette: Palette,
};

// Generate Public Curation categories from topics data
const publicCurationCategories: SidebarCategory[] = topics.map((topic) => ({
  id: topic.slug,
  name: topic.title,
  icon: TOPIC_ICON_MAP[topic.icon] || Heart,
  href: topic.slug === "wishlist" ? "/inventory/wishlist" : topic.slug === "essays" ? "/essays" : `/${topic.slug}`,
  color: "lifeos-today",
  bgClass: topic.iconBg,
  borderClass: "border-stone-300",
  group: "Public Curation",
}));

// Combine all categories
export const allCategories = [...categories, ...publicCurationCategories];

// Group categories by their group
export const groupedCategories = allCategories.reduce((acc, cat) => {
  if (!acc[cat.group]) {
    acc[cat.group] = [];
  }
  acc[cat.group]!.push(cat);
  return acc;
}, {} as Record<string, typeof allCategories>);

export const groupOrder = ["Daily Logic", "Routines", "Inventory", "Public Curation", "Nutrition", "Physicality"];

// Persist sidebar scroll position across navigations (survives remounts)
export let _sidebarScrollTop = 0;
export function setSidebarScrollTop(value: number) {
  _sidebarScrollTop = value;
}
