import { Product } from "@/types";

// Body Area configuration with colors and metadata
export const BODY_AREAS = {
  UA: {
    name: "UA",
    fullName: "Underarm",
    color: "bg-blue-50 text-blue-700",
    border: "border-blue-200",
    glowColor: "ring-blue-300",
    impactZone: "Upper body, arms raised",
  },
  IT: {
    name: "IT",
    fullName: "Inner Thigh",
    color: "bg-pink-50 text-pink-700",
    border: "border-pink-200",
    glowColor: "ring-pink-300",
    impactZone: "Upper leg, inner area",
  },
  BL: {
    name: "BL",
    fullName: "Bikini Line",
    color: "bg-rose-50 text-rose-700",
    border: "border-rose-200",
    glowColor: "ring-rose-300",
    impactZone: "Lower abdomen, bikini area",
  },
  IA: {
    name: "IA",
    fullName: "Intimate Area",
    color: "bg-purple-50 text-purple-700",
    border: "border-purple-200",
    glowColor: "ring-purple-300",
    impactZone: "Intimate/private area",
  },
  B: {
    name: "B",
    fullName: "Belly/Stomach",
    color: "bg-green-50 text-green-700",
    border: "border-green-200",
    glowColor: "ring-green-300",
    impactZone: "Abdomen, stomach area",
  },
  LIPS: {
    name: "Lips",
    fullName: "Lips",
    color: "bg-red-50 text-red-700",
    border: "border-red-200",
    glowColor: "ring-red-300",
    impactZone: "Lip area, mouth",
  },
  OTHER: {
    name: "Other",
    fullName: "Other Areas",
    color: "bg-gray-50 text-gray-600",
    border: "border-gray-200",
    glowColor: "ring-gray-300",
    impactZone: "Various areas",
  },
} as const;

/** Determine a product's primary body area for grouping */
export function getProductArea(product: Product): keyof typeof BODY_AREAS {
  if (product.category === "Lip Care") return "LIPS";
  if (!product.bodyAreas || product.bodyAreas.length === 0) return "OTHER";
  if (product.bodyAreas.includes("UA")) return "UA";
  if (product.bodyAreas.includes("B")) return "B";
  if (product.bodyAreas.includes("IT")) return "IT";
  if (product.bodyAreas.includes("BL")) return "BL";
  if (product.bodyAreas.includes("IA")) return "IA";
  return "OTHER";
}
