import type { TravelLocation } from "./types";

export const marrakechLocation: TravelLocation = {
  id: "marrakech-2022",
  name: "Marrakech",
  country: "Morocco",
  coordinates: "31.6295° N, 7.9811° W",
  dateVisited: "April 2022",
  description: "Sensory overload in the best way. Souks, riads, tagines, and the call to prayer echoing across rooftops at sunset.",
  imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80",
  climate: "Hot and dry, 25-32°C",
  duration: "7 days",
  inventory: [
    "Linen pants and cotton scarves",
    "Electrolyte tablets",
    "Moroccan dirham cash",
    "Sunscreen (SPF 50)",
  ],
  notes: "Get lost in the medina. Seriously. It's the only way to find anything real.",
  pdfUrl: "/pdfs/travel/marrakech-2022.pdf",
  journalPages: [
    {
      pageNumber: 1,
      type: "text",
      title: "Jemaa el-Fnaa at Dusk",
      content: "The main square transforms at sunset. During the day: snake charmers, juice vendors, henna artists. At night: food stalls, drummers, storytellers.\n\nI ate at stall #31 (grilled merguez sausage, mint tea). The smoke was thick. The crowd was dense. Someone grabbed my arm — a 'helpful' guide wanting €20 to show me nowhere. I declined.\n\nThe square is chaos, but it's organized chaos. Everyone knows their role. It's been this way for a thousand years.",
    },
    {
      pageNumber: 2,
      type: "mixed",
      title: "Inside the Souks",
      content: "The labyrinth begins. Narrow alleys covered by wooden slats, light filtering through in shafts. Stalls selling everything: leather bags, spices (saffron, cumin, ras el hanout), lanterns, carpets.\n\nI wandered for hours. Got lost. Got found. Got lost again.\n\nBought a small tagine pot from a man who swore his grandmother made it. (She didn't.) Haggled. Settled on half his asking price. We both smiled.\n\nThe colors here: rust orange, deep blue, saffron yellow. Every surface is a composition.",
      images: ["souk-spices", "souk-lanterns"],
    },
    {
      pageNumber: 3,
      type: "text",
      title: "The Hammam Experience",
      content: "Traditional hammam: Les Bains de Marrakech. Not the touristy kind — the local kind.\n\nProcess: undress, sit in a hot room until you're sweating, get scrubbed by a man with a rough mitt who removes what feels like three layers of skin, soap, rinse, lie down in exhaustion.\n\nIt's aggressive self-care. I emerged pink, raw, cleaner than I've ever been. Also: humbled. The attendant looked at my body like a project requiring work. He was right.",
    },
  ],
};
