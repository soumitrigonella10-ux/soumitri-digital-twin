import type { TravelLocation } from "./types";

export const reykjavikLocation: TravelLocation = {
  id: "reykjavik-2023",
  name: "Reykjavík",
  country: "Iceland",
  coordinates: "64.1466° N, 21.9426° W",
  dateVisited: "September 2023",
  description: "Minimalism meets nature. A city on the edge of the world where the light never quite settles and the landscape feels alive.",
  imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",
  climate: "Cool and unpredictable, 8-12°C",
  duration: "5 days",
  inventory: [
    "Waterproof camera (GoPro)",
    "Merino wool layers",
    "Headlamp for glacier walks",
    "Instant coffee sachets",
  ],
  notes: "The silence here is profound. Even in the city, there's an absence of noise that's almost tangible.",
  pdfUrl: "/pdfs/travel/reykjavik-2023.pdf",
  journalPages: [
    {
      pageNumber: 1,
      type: "text",
      title: "The Blue Lagoon Myth",
      content: "Everyone says skip the Blue Lagoon — it's touristy, manufactured, not 'authentic' Iceland.\n\nI went anyway.\n\nYes, it's a geothermal spa built around a power plant. Yes, it's crowded. Yes, it's expensive. But floating in 100°F water, surrounded by black lava rocks, steam rising into cold air, watching the sky shift from blue to violet — that felt authentic enough.\n\nAuthenticity is overrated. Experience is what matters.",
    },
    {
      pageNumber: 2,
      type: "mixed",
      title: "Golden Circle",
      content: "Rented a car, drove the tourist circuit: Þingvellir (tectonic plates!), Geysir (erupting every 8 minutes), Gullfoss (waterfall).\n\nThe landscape is alien. Black volcanic rock, bright green moss, no trees. It looks like the surface of another planet.\n\nAt Gullfoss, I stood at the edge and felt the spray. The waterfall is massive, two-tiered, thunderous. A rainbow hovered in the mist. I tried to take a photo. The camera couldn't capture it. Some things refuse to be reduced.",
      images: ["thingvellir", "geysir-eruption", "gullfoss"],
    },
    {
      pageNumber: 3,
      type: "text",
      title: "Reykjavík by Foot",
      content: "Walked the city for hours. Hallgrímskirkja church: concrete and Brutalist and stunning. Climbed the tower for 360° views.\n\nThe architecture here is practical, not ornate. Corrugated metal, bold colors (red, blue, yellow), small windows. Everything designed to withstand wind and cold.\n\nLunch: hot dog from Bæjarins Beztu. The Icelandic hot dog is lamb-based, topped with crispy onions and sweet mustard. Bill Clinton ate here. So did I. Democracy in action.",
    },
    {
      pageNumber: 4,
      type: "photo",
      title: "The Black Sand Beach",
      content: "Drove south to Reynisfjara. Black sand, basalt columns, roaring waves.\n\nThe signs everywhere: 'DANGER. Sneaker Waves Can Kill You.' People ignore them, get too close, get swept out to sea. Every year.\n\nI stayed back. Watched the waves. The power was mesmerizing. Nature doesn't negotiate.\n\nNearby: puffins nesting on cliffs. Comically adorable birds. Impossible to take seriously. Iceland's mascot.",
      images: ["black-sand", "basalt-columns", "puffin"],
    },
  ],
};
