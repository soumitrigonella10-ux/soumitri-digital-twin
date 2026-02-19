import type { TravelLocation } from "./types";

export const lisbonLocation: TravelLocation = {
  id: "lisbon-2024",
  name: "Lisbon",
  country: "Portugal",
  coordinates: "38.7223° N, 9.1393° W",
  dateVisited: "March 2024",
  description: "Hills, azulejos, and fado. A city of beautiful decay where every surface tells a layered story of empire, earthquake, and reinvention.",
  imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
  climate: "Spring warmth, 15-22°C",
  duration: "6 days",
  inventory: [
    "35mm film camera (Kodak Portra 400)",
    "Portuguese phrasebook",
    "Linen shirts and walking shoes",
    "Portable wine opener",
  ],
  notes: "The light here is different. Golden, angled, slightly melancholic. Every photographer mentions it.",
  pdfUrl: "/pdfs/travel/lisbon-2024.pdf",
  journalPages: [
    {
      pageNumber: 1,
      type: "text",
      title: "Arrival: Alfama District",
      content: "Landed at dawn, took the metro straight to Alfama. No hotel check-in, just...started walking.\n\nThe neighborhood is a labyrinth — steep cobblestone alleys, laundry strung between buildings, old women selling sardines from doorways. It's the oldest part of Lisbon, survived the 1755 earthquake, and feels like it. The buildings lean into each other. The tile work (azulejos) is chipped, faded, beautiful in its imperfection.\n\nI keep stopping to photograph textures: cracked plaster, rusted iron balconies, hand-painted numbers on doors. A man yelled at me in Portuguese. I think he was saying 'stop photographing my house' but I'm not sure.",
    },
    {
      pageNumber: 2,
      type: "mixed",
      title: "Tram 28",
      content: "The iconic yellow tram. It rattles up and down impossibly steep hills, squeezing through alleys so narrow you can touch the buildings from the window.\n\nI rode it end to end, then back again. Best €3 tour in the city. The driver looked bored. The tourists looked delighted. The locals looked annoyed.\n\nHopped off in Graça, climbed to Miradouro da Graça. Sunset over the Tagus. The whole city glowing. Couples drinking cheap wine from plastic cups. I joined them.",
      images: ["tram-28", "miradouro-sunset"],
    },
    {
      pageNumber: 3,
      type: "text",
      title: "Belém & Pastéis de Nata",
      content: "Mandatory pilgrimage to Pastéis de Belém. The line was ridiculous. Waited 40 minutes. Worth it.\n\nThe pastry: custard tart with caramelized top, flaky crust, dusted with cinnamon. I ate three in succession at the counter, standing, like a addict.\n\nAfterward: walked to the Jerónimos Monastery. The Manueline architecture is excessive, ornate, dripping with maritime motifs (ropes, shells, coral). It's the aesthetic of a nation that once controlled half the world. Now it's a museum. The arc of empire in limestone.",
    },
    {
      pageNumber: 4,
      type: "sketch",
      title: "LX Factory Studies",
      content: "Spent an afternoon in LX Factory — a converted industrial complex turned creative hub. Warehouses full of bookstores, design studios, murals.\n\nI drew: a wall of street art (layer upon layer, palimpsest of styles), the typography of old signage (bold, geometric, faded), a skateboarder's trajectory (arc and grace).\n\nIt's the opposite of Alfama — intentionally hip, self-aware, Instagram-ready. But there's something honest about it too. Cities need both preservation and reinvention.",
    },
    {
      pageNumber: 5,
      type: "text",
      title: "Fado & Saudade",
      content: "Fado night in a small tavern in Bairro Alto. Guitarist, singer, audience of maybe 20 people. The singer — a woman in black — closed her eyes and the room stopped.\n\nFado is untranslatable, but the word 'saudade' is key: a deep longing for something absent, lost, or impossible. Not quite nostalgia, not quite grief. A uniquely Portuguese melancholy.\n\nI didn't understand the lyrics but I felt them. The melody was all minor keys and quavering vibrato. When she finished, silence. Then applause. Then more silence.\n\nAfter, I walked home through the hills. Every window had music leaking out. The city sings itself to sleep.",
    },
  ],
};
