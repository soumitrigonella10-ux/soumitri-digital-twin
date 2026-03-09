// Bento Dashboard Tile Configuration
// Grid: 3 columns x 4 rows, row height 240px

export interface BentoTileConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  icon: string; // Lucide icon name
  iconColor: string; // Tailwind bg class for icon blob
  href?: string;
  signature?: boolean; // Show script signature stamp
  tall?: boolean; // Tall pillar tile spanning 2 rows
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
    title: "Monologue",
    subtitle: "Long-form thinking",
    description:
      "I thought about something and now I have to inconvenience you by making you read it.",
    icon: "PenLine",
    iconColor: ICON_COLORS.amber,
    href: "/monologue",
    tall: true,
  },
  {
    id: "consumption",
    title: "Media Diet",
    subtitle: "Brainful consumption",
    description: "Books, films, podcasts, and articles currently in rotation.",
    icon: "BookOpen",
    iconColor: ICON_COLORS.indigo,
    href: "/mediadiet",
  },
  {
    id: "skillup",
    title: "Skill/SideQuests",
    subtitle: "Collecting XP",
    description: "Master of all trades, jack of none.",
    icon: "GraduationCap",
    iconColor: ICON_COLORS.violet,
    href: "/sidequests",
  },
  {
    id: "travellog",
    title: "Atlas",
    subtitle: "Photo or it didn't happen",
    description: "I went there to see what it would do to me.",
    icon: "MapPin",
    iconColor: ICON_COLORS.rose,
    href: "/atlas",
  },
  {
    id: "studio",
    title: "Studio",
    subtitle: "Creative workspace",
    description: "I paint and what not.",
    icon: "Palette",
    iconColor: ICON_COLORS.cyan,
    href: "/studio",
    signature: true,
    tall: true,
  },
  {
    id: "inspiration",
    title: "Inspo",
    subtitle: "It made me feel something",
    description: "Sparks that made me feel something.",
    icon: "Sparkles",
    iconColor: ICON_COLORS.orange,
    href: "/inspo",
  },
  {
    id: "wishlist",
    title: "Wi$hlist",
    subtitle: "Desire archive",
    description: "Things I am considering purchasing.",
    icon: "Heart",
    iconColor: ICON_COLORS.fuchsia,
    href: "/wishlist",
  },
  {
    id: "design",
    title: "Design",
    subtitle: "Systems thinking",
    description:
      "Bachelor of Industrial and Product design.",
    icon: "Layers",
    iconColor: ICON_COLORS.sky,
    href: "/design",
  },
  {
    id: "internet-lore",
    title: "Online Lore",
    subtitle: "Found in the wild",
    description: "Proof I am perennially online.",
    icon: "Globe",
    iconColor: ICON_COLORS.emerald,
    href: "/onlinelore",
  },
];
