export interface Sidequest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xp: number;
  completed: boolean;
  imageUrl: string;
  questLog: string;
  entryId: string;
}

export const sidequests: Sidequest[] = [
  {
    id: '001',
    entryId: 'SQ-001',
    title: 'Master the Art of Minimalist Styling',
    description: 'Curate a capsule wardrobe with timeless pieces that define your signature aesthetic.',
    category: 'Style',
    difficulty: 'Medium',
    xp: 250,
    completed: true,
    imageUrl: '/images/quest-minimalist.jpg',
    questLog: 'This journey began with the realization that less is indeed more. By carefully selecting pieces that transcend seasonal trends and embody timeless elegance, you\'ve crafted a wardrobe that speaks volumes through its restraint. Each item has been chosen for its versatility, quality, and ability to seamlessly integrate with your personal narrative. The minimalist approach isn\'t about deprivation—it\'s about intentional curation and mindful selection. Through this quest, you\'ve discovered that true style comes not from the abundance of choices, but from the confidence in the few pieces that truly represent who you are.',
  },
  {
    id: '002',
    entryId: 'SQ-002',
    title: 'Morning Ritual Mastery',
    description: 'Design and maintain a morning routine that energizes your entire day.',
    category: 'Wellness',
    difficulty: 'Easy',
    xp: 150,
    completed: true,
    imageUrl: '/images/quest-morning.jpg',
    questLog: 'The morning sets the tone for everything that follows. This quest challenged you to design a ritual that honors both body and mind—a sacred practice that transitions you from rest to readiness. Whether it\'s a skincare routine that feels like meditation, a stretching sequence that awakens dormant energy, or a mindful breakfast that nourishes more than just your body, you\'ve created a foundation that supports your highest self. The real achievement isn\'t just completing the routine, but recognizing its ripple effect throughout your day.',
  },
  {
    id: '003',
    entryId: 'SQ-003',
    title: 'The Digital Detox Experiment',
    description: 'Spend 7 consecutive days with minimal screen time and document the transformation.',
    category: 'Mindfulness',
    difficulty: 'Hard',
    xp: 400,
    completed: false,
    imageUrl: '/images/quest-detox.jpg',
    questLog: 'In a world of constant connectivity, disconnection becomes the ultimate luxury. This challenge invites you to reclaim your attention, rediscover analog pleasures, and observe how the absence of digital noise creates space for deeper presence. Seven days of intentional tech limitation may reveal dependencies you didn\'t know existed and freedoms you\'d forgotten about. Document your observations, note the patterns that emerge, and discover what fills the space when scrolling no longer can.',
  },
  {
    id: '004',
    entryId: 'SQ-004',
    title: 'Signature Scent Journey',
    description: 'Discover, test, and commit to a fragrance that becomes your olfactory signature.',
    category: 'Beauty',
    difficulty: 'Medium',
    xp: 200,
    completed: false,
    imageUrl: '/images/quest-scent.jpg',
    questLog: 'Scent is the most powerful yet underrated element of personal presentation. This quest guides you through the art of fragrance selection—understanding notes, recognizing your preferences, and finding that perfect composition that feels like an extension of your identity. Visit boutiques, sample widely, wear scents for full days, and pay attention to how different fragrances affect your mood and confidence. The goal isn\'t just to smell good, but to find that one scent that makes you feel unmistakably like yourself.',
  },
  {
    id: '005',
    entryId: 'SQ-005',
    title: 'Culinary Self-Sufficiency',
    description: 'Master 10 nourishing recipes you can prepare without looking at instructions.',
    category: 'Nutrition',
    difficulty: 'Medium',
    xp: 300,
    completed: true,
    imageUrl: '/images/quest-culinary.jpg',
    questLog: 'True culinary confidence comes not from following recipes, but from internalizing them. This quest challenged you to select ten foundational recipes—breakfast staples, satisfying lunches, comforting dinners—and practice them until they became second nature. Through repetition, you\'ve developed an intuitive understanding of flavors, techniques, and timing. These aren\'t just meals; they\'re your repertoire, your culinary vocabulary, the dishes you can prepare with eyes closed and heart open. This is food as self-care, cooking as meditation, and nourishment as an act of self-respect.',
  },
  {
    id: '006',
    entryId: 'SQ-006',
    title: 'The Art of Letter Writing',
    description: 'Write and send 5 handwritten letters to people who shaped your journey.',
    category: 'Connection',
    difficulty: 'Easy',
    xp: 175,
    completed: false,
    imageUrl: '/images/quest-letters.jpg',
    questLog: 'In an age of instant messaging, the handwritten letter has become a radical act of intentionality. This quest invites you to slow down, reflect deeply, and express gratitude in its most tangible form. Choose five people whose presence has left an imprint on your life—mentors, friends, family members, even past versions of yourself. Write with honesty and care, seal with intention, and mail with courage. The act of writing clarifies thought and deepens appreciation, while the physical letter becomes an artifact of connection that transcends digital ephemera.',
  },
  {
    id: '007',
    entryId: 'SQ-007',
    title: 'Movement as Medicine',
    description: 'Establish a daily movement practice that brings joy, not obligation.',
    category: 'Fitness',
    difficulty: 'Medium',
    xp: 275,
    completed: true,
    imageUrl: '/images/quest-movement.jpg',
    questLog: 'Exercise shouldn\'t feel like punishment. This quest challenged you to reframe movement from obligation to celebration—to find physical practices that energize rather than deplete. Whether you discovered the meditative flow of yoga, the rhythmic joy of dance, the grounded strength of weight training, or the free expression of outdoor running, you\'ve found your movement medicine. The daily practice you\'ve established isn\'t about achieving a certain body; it\'s about honoring the body you have and experiencing the pleasure of inhabiting it fully.',
  },
  {
    id: '008',
    entryId: 'SQ-008',
    title: 'The Perfect Reading Nook',
    description: 'Design and create a dedicated space for reading that invites hours of escape.',
    category: 'Space',
    difficulty: 'Easy',
    xp: 125,
    completed: false,
    imageUrl: '/images/quest-reading.jpg',
    questLog: 'A reading nook is more than furniture arrangement—it\'s the creation of a portal to other worlds. This quest invites you to craft a space that beckons you to slow down, settle in, and get lost in pages. Consider lighting that soothes without straining, seating that supports without confining, temperature control that comforts, and proximity to your most beloved books. Add a small table for tea, a soft blanket for cozy afternoons, and perhaps a candle whose scent signals to your brain: it\'s time to read. This small sanctuary can become your most frequented destination.',
  },
  {
    id: '009',
    entryId: 'SQ-009',
    title: 'Jewelry as Narrative',
    description: 'Curate a collection where each piece tells a story or marks a milestone.',
    category: 'Style',
    difficulty: 'Hard',
    xp: 350,
    completed: false,
    imageUrl: '/images/quest-jewelry.jpg',
    questLog: 'Jewelry, when chosen with intention, becomes wearable memory. This quest challenges you to build a collection not based on trends or matching sets, but on meaning. Each piece should mark something—a transition, an achievement, a lesson learned, a place visited, or a person loved. Perhaps a ring from your grandmother, earrings purchased after your first big accomplishment, a bracelet found in a foreign market that reminds you of adventure. When you wear these pieces, you carry your story with you. Your jewelry becomes a personal archive, tangible evidence of a life fully lived.',
  },
];
