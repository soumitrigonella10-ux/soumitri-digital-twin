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
    title: "Essays",
    subtitle: "Long-form thinking",
    description:
      "I thought about something and now I have to inconvenience you by making you read it.",
    icon: "PenLine",
    iconColor: ICON_COLORS.amber,
    href: "/essays",
    tall: true,
  },
  {
    id: "consumption",
    title: "WatchList & Reccs List",
    subtitle: "Brainful consumption",
    description: "Books, films, podcasts, and articles currently in rotation.",
    icon: "BookOpen",
    iconColor: ICON_COLORS.indigo,
    href: "/consumption",
  },
  {
    id: "skillup",
    title: "Skill/SideQuests",
    subtitle: "Wish me luck",
    description: "Master of all trades, jack of none.",
    icon: "GraduationCap",
    iconColor: ICON_COLORS.violet,
    href: "/skills",
  },
  {
    id: "travellog",
    title: "Travel Log",
    subtitle: "Photo or it didn't happen",
    description: "I went there to see what it would do to me.",
    icon: "MapPin",
    iconColor: ICON_COLORS.rose,
    href: "/travel-log",
  },
  {
    id: "studio",
    title: "The Studio",
    subtitle: "Creative workspace",
    description: "Design experiments, mood boards, and visual research.",
    icon: "Palette",
    iconColor: ICON_COLORS.cyan,
    href: "/artifacts",
    signature: true,
  },
  {
    id: "inspiration",
    title: "Inspiration board",
    subtitle: "It made me feel something",
    description: "Selected references and visual sparks that made me feel something.",
    icon: "Sparkles",
    iconColor: ICON_COLORS.orange,
    href: "/inspiration",
  },
  {
    id: "wishlist",
    title: "Wishlist",
    subtitle: "Desire archive",
    description: "Things I want. Tracked with intention, not impulse.",
    icon: "Heart",
    iconColor: ICON_COLORS.fuchsia,
    href: "/inventory/wishlist",
  },
  {
    id: "design",
    title: "Design",
    subtitle: "Systems thinking",
    description:
      "From product interfaces to personal systems.",
    icon: "Layers",
    iconColor: ICON_COLORS.sky,
    href: "/design-theology",
  },
  {
    id: "internet-lore",
    title: "Internet Lore",
    subtitle: "Found in the wild",
    description: "Fragments from the deep web, screenshots nobody asked for, and the kind of posts you send to exactly one person at 2 a.m.",
    icon: "Globe",
    iconColor: ICON_COLORS.emerald,
    href: "/internetlore",
  },
];
