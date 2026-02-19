// ========================================
// Travel Log — Location Data & Journal Entries
// ========================================

export interface JournalPage {
  pageNumber: number;
  title?: string;
  content: string;
  images?: string[];
  type: "text" | "photo" | "sketch" | "mixed";
}

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  coordinates: string; // e.g., "34.0522° N, 118.2437° W"
  dateVisited: string; // e.g., "December 2025"
  description: string;
  imageUrl: string; // Hero image for the grid card
  isHeroTile?: boolean; // If true, spans 2 columns
  
  // Journal metadata
  climate: string;
  duration: string;
  inventory: string[];
  notes: string;
  
  /** Path to PDF journal in public/pdfs/travel/ (e.g. "/pdfs/travel/kyoto-2025.pdf") */
  pdfUrl?: string;
  
  // Journal pages (fallback if no PDF)
  journalPages: JournalPage[];
}

export const travelLocations: TravelLocation[] = [
  {
    id: "kyoto-2025",
    name: "Kyoto",
    country: "Japan",
    coordinates: "35.0116° N, 135.7681° E",
    dateVisited: "November 2025",
    description: "Ancient temples, minimalist aesthetics, and the quiet art of tea ceremony. A city where tradition and modernity exist in deliberate tension.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=80",
    isHeroTile: true,
    climate: "Mild autumn, 12-18°C",
    duration: "9 days",
    inventory: [
      "Leica M10 with 35mm Summicron",
      "Moleskine watercolor journal",
      "Minimalist wardrobe (neutrals only)",
      "Portable tea set",
    ],
    notes: "The concept of 'ma' (間) — negative space as active element. Everything here is an argument for restraint.",
    pdfUrl: "/pdfs/travel/kyoto-2025.pdf",
    journalPages: [
      {
        pageNumber: 1,
        type: "text",
        title: "Day 1: Arrival & First Impressions",
        content: "The taxi from Kansai wound through suburban sprawl before the city revealed itself — not gradually, but all at once. Kyoto doesn't announce itself with Tokyo's neon aggression. It waits. The architecture is low, horizontal, respectful of the mountains that frame it.\n\nChecked into a machiya in Gion. The entrance is narrow, almost apologetic, but inside — space unfolds like origami. Tatami floors, shoji screens filtering afternoon light, and a small courtyard garden no larger than a dining table. Every element is calibrated.\n\nFirst meal: kaiseki at a counter. Nine courses, each presented on different ceramic pieces. The chef explained nothing, and somehow that made it more communicative.",
      },
      {
        pageNumber: 2,
        type: "mixed",
        title: "Fushimi Inari at Dawn",
        content: "Left at 5:30 AM to beat the crowds. The torii gates start at street level, ordinary and orange, but as you climb they multiply, intensify, become a tunnel of vermillion slicing through forest.\n\nThe symbolism is heavy-handed in theory but visceral in practice. Each gate donated by a business, each one a prayer for prosperity, thousands of prayers stacked into a architecture of hope. By the summit, the air is thinner and the tourists are gone. Just moss, stone foxes, and the city below wrapped in mist.",
        images: ["gate-sketch-1", "summit-view"],
      },
      {
        pageNumber: 3,
        type: "text",
        title: "On Tea Ceremony",
        content: "Attended a chanoyu demonstration in Urasenke. The teacher — an elderly woman in indigo — moved with the economy of someone who has performed these gestures ten thousand times.\n\nWhat struck me: the ceremony is about making tea, yes, but also about cleaning the tools, arranging the flowers, monitoring the temperature of water, positioning the bowl. Every micro-gesture is load-bearing.\n\nThe tea itself was bitter, mossy, startling. She said: 'Ichi-go ichi-e. One time, one meeting. This moment will not repeat.' And then we bowed and it was over.\n\nI keep thinking about that phrase. One time, one meeting. What if I treated every interaction — every email, every conversation, every meal — as unrepeatable?",
      },
      {
        pageNumber: 4,
        type: "photo",
        title: "Arashiyama Bamboo Grove",
        content: "The bamboo forest is overhyped and still worth it. The light filters through the stalks in shafts, and the sound of wind through the grove is like distant applause. Tried to photograph it and failed. Some places resist documentation.\n\nNearby: a small temple with a moss garden that looks designed but is actually just...allowed to grow. The gardener was there, trimming with scissors. We nodded at each other. He understood I wasn't there to talk.",
        images: ["bamboo-1", "bamboo-2", "moss-garden"],
      },
      {
        pageNumber: 5,
        type: "sketch",
        title: "Market Studies",
        content: "Nishiki Market — the 'Kitchen of Kyoto' — is a 400-year-old covered arcade. Narrow, dense, sensory overload.\n\nI drew: the way dried fish are arranged (geometric, almost sculptural), the color gradient of pickled vegetables (magenta to amber), a knife sharpener's hands (gnarled, confident, older than anything in my city).\n\nBought a small ceramic bowl. The maker was there. He inscribed the date on the bottom. Now it's not just an object, it's a coordinate in time.",
      },
      {
        pageNumber: 6,
        type: "text",
        title: "Kinkaku-ji & The Gold Pavilion",
        content: "The Temple of the Golden Pavilion is absurd. I mean that as a compliment. It sits on a pond, covered in gold leaf, surrounded by meticulously manicured gardens, and it shouldn't work. It should feel gaudy, excessive, too much.\n\nBut it works.\n\nI think it's because of the setting. The pavilion is a focal point, yes, but it's also in conversation with the water, the pines, the distant mountains. It's not dominating the landscape — it's reflecting it. Literally. The pond doubles the pavilion, and suddenly you're seeing two: the physical and the ideal.\n\nYukio Mishima wrote about this place. Then he burned down his own golden temple (metaphorically, in a novel; actually, in his life). I understand the impulse. Some beauty is so complete it makes you want to destroy it just to prove it was real.",
      },
      {
        pageNumber: 7,
        type: "mixed",
        title: "Gion After Dark",
        content: "Evening walk through Gion's Hanami-koji. The streets are narrow, lit by paper lanterns, and the machiya facades look like stage sets. Very easy to romanticize.\n\nSaw a maiko (apprentice geisha) crossing the street, moving quickly, phone out, utterly modern except for the kimono. The gap between image and reality is the point, I think. Kyoto trades in that gap.\n\nDinner at a tiny izakaya. The owner spoke no English, I spoke no Japanese, and we communicated entirely through menu pointing and mutual enthusiasm. Best meal of the trip.",
        images: ["gion-street", "izakaya-interior"],
      },
      {
        pageNumber: 8,
        type: "text",
        title: "Philosopher's Path",
        content: "A two-kilometer stone path along a canal, named after Nishida Kitaro, who walked it daily to meditate. In cherry blossom season it's famous, but in autumn it's quiet, lined with gingko trees turning gold.\n\nI walked it three times. Once in morning light, once at midday, once at dusk. Same path, different path each time.\n\nNishida was interested in 'pure experience' — the moment before thought labels and categorizes. Walking this path, I understood. There's a quality of attention that precedes language, where you're just...present. The canal reflects sky. The leaves fall. You walk. No metaphor necessary.",
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

// Helper functions
export function getLocationById(id: string): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.id === id);
}

export function getHeroLocation(): TravelLocation | undefined {
  return travelLocations.find((loc) => loc.isHeroTile);
}

export function getStandardLocations(): TravelLocation[] {
  return travelLocations.filter((loc) => !loc.isHeroTile);
}
