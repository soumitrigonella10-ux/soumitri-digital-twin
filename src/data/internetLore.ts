// ========================================
// Internet Lore — curated internet artifacts
// ========================================

export type LoreCategory = 'pop-internet-core' | 'lobotomy-core' | 'hood-classics';
export type LoreMediaType = 'photo' | 'video' | 'reel' | 'quote';

export interface LoreItem {
  id: string;
  ref: number;
  title: string;
  era: string;
  category: LoreCategory;
  mediaType: LoreMediaType;
  tags: string[];
  imageUrl?: string;       // uploaded image or reel thumbnail
  videoUrl?: string;       // external video / reel link
  quoteText?: string;      // for quote-type entries
  note?: string;           // handwritten-style annotation
  size?: 'sm' | 'md' | 'lg';  // controls tile height
  _cmsId?: string;         // present if from CMS (enables edit/delete)
}

// Starter entries — extend via CMS later
export const loreItems: LoreItem[] = [
  // ── Pop Internet Core ──────────────────────
  {
    id: 'lore-001',
    ref: 1,
    title: 'The \'S\' Thing',
    era: 'Pre-Internet',
    category: 'pop-internet-core',
    mediaType: 'photo',
    tags: ['THE', 'ARTIFACT'],
    note: 'Everyone drew it. Nobody knows why.',
    size: 'sm',
  },
  {
    id: 'lore-002',
    ref: 2,
    title: 'Nyan Cat',
    era: '2011',
    category: 'pop-internet-core',
    mediaType: 'video',
    tags: ['MEME', 'MUSIC'],
    note: 'Rainbow poptart feline in space. Peak internet.',
    size: 'md',
  },
  {
    id: 'lore-003',
    ref: 3,
    title: 'Rickrolling',
    era: '2007',
    category: 'pop-internet-core',
    mediaType: 'video',
    tags: ['PRANK', 'MUSIC'],
    note: 'Never gonna give you up.',
    size: 'lg',
  },
  {
    id: 'lore-004',
    ref: 4,
    title: 'Keyboard Cat',
    era: '2007',
    category: 'pop-internet-core',
    mediaType: 'video',
    tags: ['VIDEO', 'ANIMAL'],
    size: 'sm',
  },
  {
    id: 'lore-005',
    ref: 5,
    title: 'Vaporwave Aesthetic',
    era: '2010s',
    category: 'pop-internet-core',
    mediaType: 'photo',
    tags: ['THE', 'AESTHETIC'],
    size: 'lg',
  },
  {
    id: 'lore-006',
    ref: 6,
    title: 'Doge',
    era: '2013',
    category: 'pop-internet-core',
    mediaType: 'photo',
    tags: ['MEME', 'ANIMAL'],
    note: 'Much wow. Such internet. Very culture.',
    size: 'md',
  },
  {
    id: 'lore-007',
    ref: 7,
    title: 'Vine Compilations',
    era: '2013-2017',
    category: 'pop-internet-core',
    mediaType: 'reel',
    tags: ['VIDEO', 'COMEDY'],
    note: 'RIP. Gone but never forgotten.',
    size: 'sm',
  },
  {
    id: 'lore-008',
    ref: 8,
    title: 'Badger Badger Badger',
    era: '2003',
    category: 'pop-internet-core',
    mediaType: 'video',
    tags: ['FLASH', 'MUSIC'],
    size: 'md',
  },

  // ── Lobotomy Core ──────────────────────────
  {
    id: 'lore-020',
    ref: 20,
    title: 'Is This a Pigeon?',
    era: '2018',
    category: 'lobotomy-core',
    mediaType: 'photo',
    tags: ['MEME', 'REACTION'],
    note: 'Yes. Everything is a pigeon.',
    size: 'md',
  },
  {
    id: 'lore-021',
    ref: 21,
    title: 'Cursed Images',
    era: '2010s',
    category: 'lobotomy-core',
    mediaType: 'photo',
    tags: ['GENRE', 'UNSETTLING'],
    note: 'You can\'t unsee it.',
    size: 'lg',
  },
  {
    id: 'lore-022',
    ref: 22,
    title: 'He Protec but He Also Attac',
    era: '2017',
    category: 'lobotomy-core',
    mediaType: 'quote',
    tags: ['MEME', 'FORMAT'],
    quoteText: 'He protec. He attac. But most importantly, he got your bac.',
    size: 'sm',
  },
  {
    id: 'lore-023',
    ref: 23,
    title: 'bone apple tea',
    era: '2017',
    category: 'lobotomy-core',
    mediaType: 'quote',
    tags: ['MEME', 'LANGUAGE'],
    quoteText: 'bone apple tea',
    note: 'bon appétit found dead in a ditch.',
    size: 'md',
  },
  {
    id: 'lore-024',
    ref: 24,
    title: 'Shitposting Renaissance',
    era: '2016+',
    category: 'lobotomy-core',
    mediaType: 'photo',
    tags: ['CULTURE', 'POST-IRONY'],
    size: 'sm',
  },
  {
    id: 'lore-025',
    ref: 25,
    title: 'ight imma head out',
    era: '2019',
    category: 'lobotomy-core',
    mediaType: 'photo',
    tags: ['MEME', 'SPONGEBOB'],
    note: 'The universal exit strategy.',
    size: 'lg',
  },
  {
    id: 'lore-026',
    ref: 26,
    title: 'The Dress',
    era: '2015',
    category: 'lobotomy-core',
    mediaType: 'photo',
    tags: ['VIRAL', 'DEBATE'],
    note: 'Blue and black. End of discussion.',
    size: 'md',
  },

  // ── Hood Classics ──────────────────────────
  {
    id: 'lore-040',
    ref: 40,
    title: 'Ain\'t Nobody Got Time for That',
    era: '2012',
    category: 'hood-classics',
    mediaType: 'video',
    tags: ['INTERVIEW', 'ICONIC'],
    note: 'Sweet Brown, cultural philosopher.',
    size: 'md',
  },
  {
    id: 'lore-041',
    ref: 41,
    title: 'Unforgivable',
    era: '2006',
    category: 'hood-classics',
    mediaType: 'video',
    tags: ['VIDEO', 'COMEDY'],
    note: 'Get me a chicken sandwich. And some waffle fries.',
    size: 'lg',
  },
  {
    id: 'lore-042',
    ref: 42,
    title: 'Why You Always Lying',
    era: '2015',
    category: 'hood-classics',
    mediaType: 'reel',
    tags: ['VINE', 'MUSIC'],
    size: 'sm',
  },
  {
    id: 'lore-043',
    ref: 43,
    title: 'Deez Nuts',
    era: '2015',
    category: 'hood-classics',
    mediaType: 'video',
    tags: ['VINE', 'PRANK'],
    note: 'Got eem.',
    size: 'md',
  },
  {
    id: 'lore-044',
    ref: 44,
    title: 'Bootleg Fireworks',
    era: '2011',
    category: 'hood-classics',
    mediaType: 'video',
    tags: ['VIDEO', 'COMMENTARY'],
    note: 'Lord Reekris!',
    size: 'sm',
  },
  {
    id: 'lore-045',
    ref: 45,
    title: 'Conceited Reaction',
    era: '2015',
    category: 'hood-classics',
    mediaType: 'photo',
    tags: ['MEME', 'REACTION'],
    size: 'md',
  },
  {
    id: 'lore-046',
    ref: 46,
    title: 'They Done Let the GDs in the Door',
    era: '2020s',
    category: 'hood-classics',
    mediaType: 'video',
    tags: ['MEME', 'MUSIC'],
    note: 'The crossover event of the century.',
    size: 'lg',
  },
];
