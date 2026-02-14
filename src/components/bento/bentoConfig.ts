// Bento Dashboard Tile Configuration
// Grid: 3 columns x 4 rows, row height 240px

export interface BentoTileConfig {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  icon: string; // Lucide icon name
  iconColor: string; // Tailwind bg class for icon blob
  gridArea: string; // CSS grid-area value
  href?: string;
  signature?: boolean; // Show script signature stamp
}

export const BENTO_PALETTE = {
  background: "#fdfaf3",
  text: "#2d2d2d",
  textMuted: "#6b6b6b",
  glass: "rgba(255, 255, 255, 0.65)",
  glassBorder: "rgba(255, 255, 255, 0.35)",
} as const;

export const ICON_COLORS = {
  amber: "bg-amber-100 text-amber-600",
  emerald: "bg-emerald-100 text-emerald-600",
  indigo: "bg-indigo-100 text-indigo-600",
  rose: "bg-rose-100 text-rose-600",
  cyan: "bg-cyan-100 text-cyan-600",
  violet: "bg-violet-100 text-violet-600",
  orange: "bg-orange-100 text-orange-600",
  sky: "bg-sky-100 text-sky-600",
  fuchsia: "bg-fuchsia-100 text-fuchsia-600",
} as const;

export const BENTO_TILES: BentoTileConfig[] = [
  {
    id: "essays",
    title: "Essays",
    subtitle: "Long-form thinking",
    description:
      "Carefully considered perspectives on design, technology, culture, and the art of intentional living. Each piece is a slow exploration.",
    icon: "PenLine",
    iconColor: ICON_COLORS.amber,
    gridArea: "1 / 1 / 3 / 2", // row 1-2, col 1
    href: "/essays",
  },
  {
    id: "sidequests",
    title: "Sidequests",
    subtitle: "Curiosity trails",
    description: "Short detours into things that caught my attention.",
    icon: "Compass",
    iconColor: ICON_COLORS.emerald,
    gridArea: "1 / 2 / 2 / 3", // row 1, col 2
  },
  {
    id: "consumption",
    title: "Consumption",
    subtitle: "What I'm absorbing",
    description: "Books, films, podcasts, and articles currently in rotation.",
    icon: "BookOpen",
    iconColor: ICON_COLORS.indigo,
    gridArea: "1 / 3 / 2 / 4", // row 1, col 3
  },
  {
    id: "skill-up",
    title: "Skill Up",
    subtitle: "Active learning",
    description: "Courses, topics, and deliberate practice logs.",
    icon: "GraduationCap",
    iconColor: ICON_COLORS.violet,
    gridArea: "2 / 2 / 3 / 3", // row 2, col 2
  },
  {
    id: "travel-log",
    title: "Travel Log",
    subtitle: "Places & memories",
    description: "A visual journal of places visited and planned.",
    icon: "MapPin",
    iconColor: ICON_COLORS.rose,
    gridArea: "2 / 3 / 3 / 4", // row 2, col 3
  },
  {
    id: "studio",
    title: "The Studio",
    subtitle: "Creative workspace",
    description: "Design experiments, mood boards, and visual research.",
    icon: "Palette",
    iconColor: ICON_COLORS.cyan,
    gridArea: "3 / 1 / 4 / 3", // row 3, col 1-2
    signature: true,
  },
  {
    id: "inspiration",
    title: "Inspiration",
    subtitle: "Collected beauty",
    description: "A curated feed of aesthetic references and visual sparks.",
    icon: "Sparkles",
    iconColor: ICON_COLORS.orange,
    gridArea: "3 / 3 / 4 / 4", // row 3, col 3
  },
  {
    id: "wishlist",
    title: "Wishlist",
    subtitle: "Desire archive",
    description: "Things I want. Tracked with intention, not impulse.",
    icon: "Heart",
    iconColor: ICON_COLORS.fuchsia,
    gridArea: "4 / 1 / 5 / 2", // row 4, col 1
    href: "/inventory/wishlist",
  },
  {
    id: "design",
    title: "Design",
    subtitle: "Systems thinking",
    description:
      "How I approach design — from product interfaces to personal systems. A working philosophy built on clarity, restraint, and purpose.",
    badge: "Design Perspective",
    icon: "Layers",
    iconColor: ICON_COLORS.sky,
    gridArea: "4 / 2 / 5 / 4", // row 4, col 2-3
  },
];
