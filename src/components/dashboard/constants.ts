import type { Product, TimeOfDay } from "@/types";

// Body Area configuration for tags
export const BODY_AREAS = {
  UA: { name: "UA", fullName: "Underarm", color: "bg-blue-100 text-blue-700" },
  IT: { name: "IT", fullName: "Inner Thigh", color: "bg-pink-100 text-pink-700" },
  BL: { name: "BL", fullName: "Bikini Line", color: "bg-rose-100 text-rose-700" },
  IA: { name: "IA", fullName: "Intimate Area", color: "bg-purple-100 text-purple-700" },
  B: { name: "B", fullName: "Belly/Stomach", color: "bg-green-100 text-green-700" },
  LIPS: { name: "Lips", fullName: "Lips", color: "bg-red-100 text-red-700" },
} as const;

// Helper to get products for today filtered by routine type, day, and time
export function getTodayProducts(
  products: Product[],
  routineType: string,
  dayOfWeek: number,
  timeOfDay?: TimeOfDay
) {
  return products
    .filter((p) => {
      if (p.routineType !== routineType) return false;
      if (p.weekdays && !p.weekdays.includes(dayOfWeek)) return false;
      if (timeOfDay && timeOfDay !== "ANY") {
        if (p.timeOfDay && p.timeOfDay !== "ANY" && p.timeOfDay !== timeOfDay) return false;
      }
      return true;
    })
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
}

// Meal color themes keyed by meal type
export const MEAL_THEMES = {
  breakfast: {
    label: "Morning",
    badgeClass: "bg-amber-100 text-amber-700",
    accentClass: "text-amber-600",
    stepBgClass: "bg-amber-100",
    stepTextClass: "text-amber-600",
  },
  lunch: {
    label: "Midday",
    badgeClass: "bg-orange-100 text-orange-700",
    accentClass: "text-orange-600",
    stepBgClass: "bg-orange-100",
    stepTextClass: "text-orange-600",
  },
  dinner: {
    label: "Evening",
    badgeClass: "bg-indigo-100 text-indigo-700",
    accentClass: "text-indigo-600",
    stepBgClass: "bg-indigo-100",
    stepTextClass: "text-indigo-600",
  },
} as const;
