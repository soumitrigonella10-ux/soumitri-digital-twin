import type { TravelLocation } from "./types";

export const osakaLocation: TravelLocation = {
  id: "osaka-2021",
  name: "Osaka",
  country: "Japan",
  coordinates: "34.6937° N, 135.5023° E",
  dateVisited: "October 2021",
  description: "Kyoto's rowdy sibling. Street food, neon-lit Dotonbori, and a local energy that feels more working-class, less precious.",
  imageUrl: "https://images.unsplash.com/photo-1589452271712-64fa89a25d3d?w=1200&q=80",
  climate: "Warm autumn, 18-24°C",
  duration: "4 days",
  inventory: [
    "Appetite (bring it)",
    "Comfortable walking shoes",
    "Portable phone charger",
    "Empty suitcase (for snacks)",
  ],
  notes: "Osaka's motto: 'Kuidaore' — eat until you drop. I took this literally.",
  pdfUrl: "/pdfs/travel/osaka-2021.pdf",
  journalPages: [
    {
      pageNumber: 1,
      type: "text",
      title: "Dotonbori Nights",
      content: "The neon heart of Osaka. Giant signs: a running Glico man, a mechanical crab, a rotating sushi boat. It's Vegas meets Blade Runner meets street carnival.\n\nI ate: takoyaki (octopus balls), okonomiyaki (savory pancake), kushikatsu (fried everything on skewers). Washed it down with Asahi. Did it again.\n\nThe energy here is frenetic. Workers in suits stumbling out of bars. Teenagers in Harajuku fashion taking selfies. Street touts handing out tissues with ads.\n\nIt's loud, bright, overwhelming — and I loved it.",
    },
    {
      pageNumber: 2,
      type: "text",
      title: "Kuromon Market",
      content: "The 'Kitchen of Osaka' — a covered market stretching several blocks. Vendors selling fresh seafood, wagyu beef, fruit, sweets.\n\nI had breakfast here: sea urchin on rice, grilled scallops, mochi. It cost €30 and was worth every cent.\n\nThe market is touristy but functional. Locals still shop here. I watched an elderly woman inspect fish with the scrutiny of a jeweler examining diamonds.",
    },
  ],
};
