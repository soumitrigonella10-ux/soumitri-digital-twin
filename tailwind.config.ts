import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Telugu Cultural Aesthetic Colors
        telugu: {
          kavi: "#8B2323",         // Red Oxide (Kavi) - Header
          marigold: "#FFB300",     // Marigold Yellow - Accents
          turmeric: "#FDB813",     // Turmeric Gold - Borders
          sandstone: "#FDF5E6",    // Warm Sandstone - Background
          cream: "#FFF8DC",        // Cream - Text backgrounds
          chalk: "#F5F5DC",        // Chalk white - Patterns
        },
        // LifeOS Category Colors
        lifeos: {
          today: "#6366f1",      // Indigo
          skin: "#ec4899",       // Pink
          body: "#3b82f6",       // Blue
          bodySpecific: "#8b5cf6", // Purple
          hair: "#eab308",       // Yellow
          wardrobe: "#f97316",   // Orange
          jewellery: "#06b6d4",  // Cyan
          breakfast: "#f59e0b",  // Amber
          lunch: "#10b981",      // Emerald
          dinner: "#4338ca",     // Dark Indigo
          grocery: "#64748b",    // Slate
          fitness: "#ef4444",    // Red
        },
        brand: {
          DEFAULT: "#111827",
          light: "#374151",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "'Times New Roman'", "serif"],
        editorial: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "check-bounce": "checkBounce 0.3s ease-out",
        "strike-through": "strikeThrough 0.3s ease-out forwards",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        checkBounce: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        strikeThrough: {
          "0%": { textDecorationLine: "none" },
          "100%": { textDecorationLine: "line-through" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
