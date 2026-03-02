// ========================================
// Content Visualization System — Design Tokens
//
// Single source of truth for colors, spacing, typography,
// and motion so every visualization type shares one design language.
// ========================================

/** Color palette derived from the site-wide editorial / telugu design system. */
export const colors = {
  /** Page & modal backgrounds */
  bg: {
    ivory: "#F9F7F2",
    paper: "#FCFCFA",
    warm: "#F9F5F0",
    cream: "#FDF5E6",
  },

  /** Primary accent (used for badges, labels, active states) */
  accent: {
    oxblood: "#8A2424",
    kavi: "#8B2323",
    amber: "#B45309",
    marigold: "#FFB300",
  },

  /** Text hierarchy */
  text: {
    primary: "#2D2424",
    heading: "#4A2C2A",
    muted: "#6b6b6b",
    tan: "#C4B6A6",
  },

  /** Warm gradient stops (media placeholders, decorative fills) */
  gradient: {
    from: "#EBDCCB",
    via: "#D4C4B0",
    to: "#BFAF9B",
  },

  /** Borders / dividers */
  border: {
    light: "#E7E5E4", // stone-200
    medium: "#C4B6A6",
  },

  /** Overlay / backdrop */
  overlay: {
    dark: "rgba(138, 36, 36, 0.80)", // Oxblood 80 %
    light: "rgba(255, 255, 255, 0.65)",
  },
} as const;

/** Spacing scale — maps semantic names to Tailwind utility classes */
export const spacing = {
  /** Modal/page outer padding */
  pagePx: "px-6 md:px-8 lg:px-12",
  pagePy: "py-8 lg:py-12",

  /** Section gaps */
  sectionGap: "space-y-6 lg:space-y-8",
  itemGap: "space-y-3",

  /** Card inner padding */
  cardPadding: "p-4 md:p-6",
} as const;

/** Typography classes for consistent heading / body / label styling */
export const typography = {
  /** Large display title — serif italic (Playfair Display) */
  displayTitle:
    "text-3xl sm:text-4xl lg:text-5xl font-serif italic leading-tight",

  /** Section heading — serif italic medium */
  sectionTitle: "text-xl lg:text-2xl font-serif italic",

  /** Body copy — Inter with generous leading */
  body: "font-editorial text-base leading-relaxed tracking-[0.01em]",

  /** Small uppercase label / tracker */
  label:
    "text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold",

  /** Tiny meta info (dates, counts) */
  meta: "font-editorial text-[11px] sm:text-xs text-stone-400",
} as const;

/** Motion / transition presets (CSS + framer-motion compatible) */
export const motion = {
  /** Backdrop / overlay fade */
  backdropIn: { opacity: 0 },
  backdropAnimate: { opacity: 1 },
  backdropTransition: { duration: 0.3 },

  /** Content container entrance */
  containerIn: { opacity: 0, scale: 0.95, y: 20 },
  containerAnimate: { opacity: 1, scale: 1, y: 0 },
  containerExit: { opacity: 0, scale: 0.95, y: 20 },
  containerTransition: { duration: 0.3, ease: "easeOut" as const },

  /** List-item stagger */
  staggerDelay: (i: number) => `${i * 75}ms`,

  /** Shared CSS transition string */
  cssDefault: "transition-all duration-300 ease-out",
} as const;

/** Shared border-radius presets */
export const radii = {
  card: "rounded-lg",
  modal: "rounded-none lg:rounded-xl",
  pill: "rounded-full",
} as const;
