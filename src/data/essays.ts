// ========================================
// Essays — Editorial Archive Data
// ========================================

export interface Essay {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  tags?: string[];
  slug: string;
  /** Full essay body — array of content blocks for rich rendering */
  body?: EssayBlock[];
}

/** Content block types for structured essay rendering */
export type EssayBlock =
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string; attribution?: string }
  | { type: "heading"; text: string }
  | { type: "separator" };

export const ESSAY_CATEGORIES = [
  "All",
  "Philosophy",
  "Design",
  "Culture",
  "Technology",
  "Personal",
] as const;

export type EssayCategory = (typeof ESSAY_CATEGORIES)[number];

export const essays: Essay[] = [
  {
    id: "es-1",
    slug: "on-taste",
    title: "On Taste",
    excerpt:
      "What it means to have taste versus having preferences. The difference is conviction — taste is an argument you're willing to defend, preferences are habits you've never examined.",
    category: "Philosophy",
    date: "January 2026",
    readingTime: "8 min read",
    imageUrl: "/images/essays/on-taste.jpg",
    isFeatured: true,
    tags: ["aesthetics", "identity", "curation"],
    body: [
      { type: "paragraph", text: "Taste is not preference. Preference is passive — it is the residue of habit, convenience, and exposure. You prefer vanilla because your mother bought vanilla. You prefer blue because you were once complimented in a blue shirt. Preference requires no argument, no defense. It simply exists, and it asks nothing of you." },
      { type: "paragraph", text: "Taste demands more. Taste is a position. It is the willingness to look at two beautiful things and say: this one is better, and here is why. It is an act of editorial courage — of narrowing the infinite into the specific, of choosing not just what to include but what to leave behind." },
      { type: "pullquote", text: "Taste is an argument you're willing to defend. Preference is a habit you've never examined." },
      { type: "paragraph", text: "We confuse the two constantly. When someone says 'I have good taste,' they often mean 'I like expensive things' or 'I follow trends that signal refinement.' But following is not choosing. Taste is built in the gaps — in the moments where you disagree with the consensus and hold your ground." },
      { type: "heading", text: "The Architecture of Choosing" },
      { type: "paragraph", text: "To cultivate taste, you must first cultivate attention. You have to look — truly look — at the things around you. Not to evaluate them against a standard, but to understand what moves you and, more importantly, to ask why. The unexamined aesthetic life produces preferences. The examined one produces taste." },
      { type: "paragraph", text: "I think about this with clothing, with food, with the tools I use daily. Every choice is a small declaration. Not of status, but of values. When I reach for the hand-thrown ceramic mug instead of the mass-produced one, I am not performing refinement. I am practicing a form of attention that I believe makes life richer." },
      { type: "pullquote", text: "Every choice is a small declaration — not of status, but of values." },
      { type: "separator" },
      { type: "paragraph", text: "The final test of taste is this: can you articulate it? Not to impress, but to clarify — to yourself, first — what you believe about beauty, about function, about what deserves to exist in the limited space of your life. If you can, you have taste. If you cannot, you have preferences. Both are fine. But only one is a practice." },
    ],
  },
  {
    id: "es-2",
    slug: "the-architecture-of-daily-rituals",
    title: "The Architecture of Daily Rituals",
    excerpt:
      "Every morning is a small act of construction. The order of operations matters — not because of productivity, but because rhythm is how we author our days instead of merely surviving them.",
    category: "Personal",
    date: "December 2025",
    readingTime: "12 min read",
    imageUrl: "/images/essays/daily-rituals.jpg",
    isFeatured: true,
    tags: ["routines", "intentionality", "time"],
    body: [
      { type: "paragraph", text: "Every morning is a small act of construction. Not in the productivity-guru sense — not the cold shower, the 4 AM alarm, the optimized stack of supplements. I mean something quieter. The order in which you do things is itself a form of authorship. You are writing the opening paragraph of your day." },
      { type: "paragraph", text: "I wake up and I do not reach for my phone. This is not discipline; it is architecture. The phone is kept in another room, charging. The first thing my hands touch is the kettle. The second is the French press. The third is a pen. This sequence didn't happen by accident — I designed it, the way you'd design the entryway of a home." },
      { type: "pullquote", text: "Rhythm is how we author our days instead of merely surviving them." },
      { type: "heading", text: "The Morning as Blueprint" },
      { type: "paragraph", text: "There is a reason that monks, writers, and athletes all share an obsession with morning routines. It is not about optimization. It is about sovereignty. The morning is the only part of your day that belongs entirely to you — before the emails, the requests, the social obligations that consume everything after 9 AM." },
      { type: "paragraph", text: "What you do with this time is a statement about what you value. If you spend it scrolling, you value distraction. If you spend it moving, you value your body. If you spend it thinking, you value your mind. There is no wrong answer, but there is always an honest one." },
      { type: "separator" },
      { type: "paragraph", text: "My ritual is simple: coffee, journal, walk. Twenty minutes of each. By 7:30 AM, I have already done three things that matter — not because they produce output, but because they produce presence. The rest of the day can be chaotic. The morning was mine." },
      { type: "pullquote", text: "The morning is the only part of your day that belongs entirely to you." },
      { type: "paragraph", text: "I've come to believe that the quality of a life is not determined by its highlights but by its defaults. The things you do without thinking — the paths you've worn into your days through repetition. If those defaults are intentional, you are living deliberately. If they are not, you are being lived." },
    ],
  },
  {
    id: "es-3",
    slug: "against-minimalism",
    title: "Against Minimalism (As Religion)",
    excerpt:
      "Minimalism became its own form of maximalism — a lifestyle brand dressed in linen. What if the goal isn't fewer things, but better reasons for the things we keep?",
    category: "Design",
    date: "November 2025",
    readingTime: "10 min read",
    imageUrl: "/images/essays/against-minimalism.jpg",
    tags: ["design", "consumerism", "intention"],
    body: [
      { type: "paragraph", text: "Minimalism began as a liberation. Fewer things, less noise, more clarity. It was a reaction to decades of accumulation — a necessary correction. But somewhere along the way, it became its own religion, complete with dogma, virtue signaling, and a very specific uniform (white walls, linen shirts, Scandinavian everything)." },
      { type: "paragraph", text: "The problem with minimalism-as-religion is that it replaces one form of consumption with another. Instead of buying things, you buy the idea of not buying things. The capsule wardrobe becomes a status symbol. The empty shelf becomes a performance of restraint masquerading as taste." },
      { type: "pullquote", text: "Instead of buying things, you buy the idea of not buying things." },
      { type: "heading", text: "The Case for Intentional Abundance" },
      { type: "paragraph", text: "What if the goal isn't fewer things, but better reasons? I own more books than a minimalist would approve of. But each one represents a conversation I had with an author, a period of my thinking, a question I once found urgent. They are not clutter. They are a bibliography of my mind." },
      { type: "paragraph", text: "The same applies to clothing, to kitchen tools, to the objects on my desk. I don't want less for the sake of less. I want everything I own to have a story — a reason that goes beyond 'it was on sale' or 'everyone has one.'" },
      { type: "separator" },
      { type: "paragraph", text: "True simplicity is not an empty room. It is a room where everything has earned its place. That requires not asceticism, but judgment — and judgment, unlike counting, is a practice that never ends." },
    ],
  },
  {
    id: "es-4",
    slug: "the-digital-twin-hypothesis",
    title: "The Digital Twin Hypothesis",
    excerpt:
      "Building a mirror of your life in software isn't vanity — it's introspection at scale. What happens when your decisions become data you can revisit, question, and learn from?",
    category: "Technology",
    date: "October 2025",
    readingTime: "15 min read",
    imageUrl: "/images/essays/digital-twin.jpg",
    tags: ["software", "self-knowledge", "systems"],
    body: [
      { type: "paragraph", text: "Building a mirror of your life in software isn't vanity. It is, if done honestly, a form of introspection at scale. We journal for the same reason — to see ourselves from the outside, to catch patterns invisible from within. The difference is that software doesn't forget, doesn't flatter, and doesn't tire." },
      { type: "paragraph", text: "The concept of a 'digital twin' comes from engineering. In manufacturing, it means a virtual replica of a physical system — a jet engine, a factory floor — updated in real time with sensor data. The replica lets you simulate, predict, and optimize without touching the real thing." },
      { type: "pullquote", text: "Software doesn't forget, doesn't flatter, and doesn't tire." },
      { type: "heading", text: "The Personal Twin" },
      { type: "paragraph", text: "Applied to a person, the concept becomes something stranger and more intimate. What if you could see your wardrobe as a dataset — frequency of wear, color distribution, seasonal patterns? What if your meals were a nutritional ledger, your routines a dependency graph, your purchases a timeline of values?" },
      { type: "paragraph", text: "This is not about surveillance or quantification for its own sake. It is about making the implicit explicit. We all have systems — we just don't always see them. The digital twin makes them visible, queryable, revisitable." },
      { type: "separator" },
      { type: "paragraph", text: "The deepest value of a digital twin is not efficiency. It is honesty. When you see that you've worn the same three outfits for six months, or that your grocery list hasn't changed in a year, or that you always skip the same workout — that's not a failure to optimize. It's a mirror. And mirrors, if you're willing to look, are where growth begins." },
    ],
  },
  {
    id: "es-5",
    slug: "on-clothing-as-language",
    title: "On Clothing as Language",
    excerpt:
      "We dress in sentences. Some days we whisper, other days we make declarations. The wardrobe is less a closet and more a vocabulary — assembled over years, revised every morning.",
    category: "Culture",
    date: "September 2025",
    readingTime: "7 min read",
    imageUrl: "/images/essays/clothing-language.jpg",
    tags: ["fashion", "semiotics", "expression"],
    body: [
      { type: "paragraph", text: "We dress in sentences. Some mornings the sentence is clipped and efficient — dark jeans, white tee, done. Other mornings it is more baroque — a layered thought, a deliberate clash, a reference only you would catch. The wardrobe is less a closet and more a vocabulary, assembled over years and revised every morning." },
      { type: "paragraph", text: "Fashion critics love to talk about clothing as communication. But the metaphor goes deeper than they usually push it. Clothing isn't just communication — it is language itself. It has grammar (silhouettes, proportions), vocabulary (specific garments, textures, colors), and syntax (how you combine them)." },
      { type: "pullquote", text: "The wardrobe is less a closet and more a vocabulary — assembled over years, revised every morning." },
      { type: "heading", text: "Fluency and Dialect" },
      { type: "paragraph", text: "Like any language, you can speak it fluently or haltingly. You can have a rich vocabulary or a limited one. You can speak in clichés (fast fashion, trend-chasing) or develop a personal dialect that is unmistakably yours." },
      { type: "paragraph", text: "The most interesting dressers I know are not the most fashionable. They are the most articulate. They know what they are saying — and more importantly, what they are not saying. Their outfit is not an accident. It is an argument." },
      { type: "separator" },
      { type: "paragraph", text: "I have come to believe that getting dressed is one of the most creative acts of daily life. It requires no canvas, no instrument, no audience. Just a body, a mirror, and a willingness to say something — even if only to yourself." },
    ],
  },
  {
    id: "es-6",
    slug: "systems-over-goals",
    title: "Systems Over Goals",
    excerpt:
      "Why I optimize for repeatable processes, not outcomes. Goals are destination-oriented; systems are journey-oriented. One is fragile, the other is antifragile.",
    category: "Philosophy",
    date: "August 2025",
    readingTime: "9 min read",
    imageUrl: "/images/essays/systems-goals.jpg",
    tags: ["productivity", "philosophy", "growth"],
    body: [
      { type: "paragraph", text: "Goals are fragile. They depend on a future that may never arrive — a specific number on a scale, a title on a business card, a date on a calendar. When you reach them, the satisfaction is brief. When you don't, the failure feels total. This binary quality is the weakness of goal-oriented thinking." },
      { type: "paragraph", text: "Systems are different. A system is a repeatable process that produces results over time, regardless of any specific outcome. Going to the gym is a system. 'Lose 20 pounds' is a goal. Writing every morning is a system. 'Finish a novel' is a goal. The system survives failure. The goal does not." },
      { type: "pullquote", text: "The system survives failure. The goal does not." },
      { type: "heading", text: "Antifragility in Daily Life" },
      { type: "paragraph", text: "Nassim Taleb talks about antifragility — things that gain from disorder. Systems are antifragile in a way that goals never can be. When your system encounters an obstacle, it adapts. You miss a day at the gym, so you walk instead. You can't write in the morning, so you write at night. The system bends. The goal would break." },
      { type: "paragraph", text: "I've structured my life around systems: a morning routine, a weekly review, a seasonal wardrobe audit, a monthly reading cadence. None of these have a finish line. They are loops, not lines. And loops, by definition, never end — they only improve." },
      { type: "separator" },
      { type: "paragraph", text: "The paradox is that systems produce better outcomes than goals ever could. You end up healthier, more creative, more consistent — not because you chased those things, but because you built the infrastructure that made them inevitable." },
    ],
  },
  {
    id: "es-7",
    slug: "the-loneliness-of-good-taste",
    title: "The Loneliness of Good Taste",
    excerpt:
      "Refinement is a narrowing. The more precisely you know what you want, the fewer people will understand why. This is the quiet cost of curation.",
    category: "Personal",
    date: "July 2025",
    readingTime: "6 min read",
    imageUrl: "/images/essays/good-taste.jpg",
    tags: ["solitude", "curation", "identity"],
    body: [
      { type: "paragraph", text: "Refinement is a narrowing. This is the part that nobody warns you about. The more precisely you know what you want — in food, in music, in conversation, in love — the fewer options satisfy you. The menu shrinks. The playlist shortens. The circle tightens." },
      { type: "paragraph", text: "This is not snobbery, though it is easily mistaken for it. It is the natural consequence of paying attention. Once you've tasted exceptional olive oil, the supermarket kind becomes difficult. Once you've read Borges, airport fiction loses its grip. Once you've experienced a truly well-made garment, fast fashion feels like cardboard." },
      { type: "pullquote", text: "The more precisely you know what you want, the fewer people will understand why." },
      { type: "heading", text: "The Quiet Cost" },
      { type: "paragraph", text: "The cost is social as much as practical. When your taste diverges from the mainstream, shared experience becomes harder. You can't enjoy things casually anymore. You see the stitching, the seasoning, the sentence construction. Everything is legible — and legibility, paradoxically, is isolating." },
      { type: "paragraph", text: "But there is a gift hidden in this loneliness. The things that do meet your standard become extraordinary. A perfect cup of coffee becomes transcendent. A well-cut coat feels like armor. A book that truly speaks to you feels like finding a friend in an empty room." },
      { type: "separator" },
      { type: "paragraph", text: "Taste is a trade. You give up the easy pleasure of undiscriminating consumption. In return, you receive a rarer, more intense form of satisfaction — one that fewer people will share, but that belongs entirely to you." },
    ],
  },
  {
    id: "es-8",
    slug: "in-defense-of-friction",
    title: "In Defense of Friction",
    excerpt:
      "Silicon Valley wants to eliminate every inconvenience. But friction is where thought lives — in the pause before a purchase, the effort of cooking, the discipline of a morning walk.",
    category: "Technology",
    date: "June 2025",
    readingTime: "11 min read",
    imageUrl: "/images/essays/friction.jpg",
    tags: ["technology", "slowness", "intention"],
    body: [
      { type: "paragraph", text: "Silicon Valley's central promise is the elimination of friction. One-click ordering. Instant delivery. Frictionless payments. Seamless experiences. The language itself is revealing — friction is treated as the enemy, an obstacle between desire and fulfillment that technology must destroy." },
      { type: "paragraph", text: "But what if friction is not the enemy? What if friction is where thought lives? The pause before a purchase. The effort of cooking a meal from scratch. The discipline of a morning walk when you'd rather scroll. These are not inconveniences. They are the spaces where intentionality survives." },
      { type: "pullquote", text: "Friction is where thought lives — in the pause before a purchase, the effort of cooking, the discipline of a morning walk." },
      { type: "heading", text: "The Speed Trap" },
      { type: "paragraph", text: "When you eliminate all friction, you don't get freedom. You get compulsion. One-click ordering doesn't make you more intentional — it makes you more impulsive. Algorithmic feeds don't make you more informed — they make you more reactive. The removal of friction doesn't serve the user. It serves the platform." },
      { type: "paragraph", text: "I've started deliberately adding friction back into my life. I use a French press instead of a pod machine. I walk to the grocery store instead of ordering delivery. I write in a physical notebook before transferring to digital. Each of these choices is slower, less convenient, more effortful. And that is precisely the point." },
      { type: "separator" },
      { type: "paragraph", text: "The effort is the experience. When you remove the effort, you don't preserve the experience — you hollow it out. A home-cooked meal tastes different from a delivered one, not because of the ingredients but because of the attention invested. The friction is the flavor." },
      { type: "pullquote", text: "When you remove the effort, you don't preserve the experience — you hollow it out." },
      { type: "paragraph", text: "I don't want a frictionless life. I want a life where the friction is chosen — where the difficulty is meaningful, where the slowness is deliberate, where the effort produces not just a result but a relationship with the process itself." },
    ],
  },
];

// Helpers
export function getEssayBySlug(slug: string): Essay | undefined {
  return essays.find((e) => e.slug === slug);
}

export function getEssaysByCategory(category: string): Essay[] {
  if (category === "All") return essays;
  return essays.filter((e) => e.category === category);
}

export function getFeaturedEssays(): Essay[] {
  return essays.filter((e) => e.isFeatured);
}
