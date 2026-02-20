export type ThoughtCardType = 'standard' | 'blueprint' | 'inverted' | 'technical';
export type AnnotationType = 'measurement' | 'redline' | 'stamp' | 'none';

export interface DesignThought {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  cardType: ThoughtCardType;
  annotationType: AnnotationType;
  hasTechnicalPattern?: boolean;
  pdfUrl?: string;
}

export const designThoughts: DesignThought[] = [
  {
    id: 'thought-01',
    title: 'The Paradox of Choice',
    subtitle: 'in Digital Interfaces',
    category: 'UX Philosophy',
    date: 'Feb 2026',
    cardType: 'standard',
    annotationType: 'redline',
    pdfUrl: '/pdfs/essays/design-philosophy.pdf'
  },
  {
    id: 'thought-02',
    title: 'Grid Systems',
    subtitle: 'as Visual Language',
    category: 'Layout Theory',
    date: 'Jan 2026',
    cardType: 'blueprint',
    annotationType: 'measurement',
    pdfUrl: '/pdfs/essays/grid-systems.pdf',
    hasTechnicalPattern: true
  },
  {
    id: 'thought-03',
    title: 'Typography is Voice',
    category: 'Type Design',
    date: 'Feb 2026',
    cardType: 'standard',
    annotationType: 'stamp',
    pdfUrl: '/pdfs/essays/typography-voice.pdf'
  },
  {
    id: 'thought-04',
    title: 'Interaction Timing',
    subtitle: 'The Invisible Craft',
    category: 'Animation',
    date: 'Dec 2025',
    cardType: 'technical',
    annotationType: 'measurement',
    hasTechnicalPattern: true,
    pdfUrl: '/pdfs/essays/interaction-timing.pdf'
  },
  {
    id: 'thought-05',
    title: 'Color as System',
    category: 'Visual Design',
    date: 'Jan 2026',
    cardType: 'standard',
    annotationType: 'redline'
  },
  {
    id: 'thought-06',
    title: 'The Fold Myth',
    category: 'UX Philosophy',
    date: 'Nov 2025',
    cardType: 'inverted',
    annotationType: 'stamp'
  },
  {
    id: 'thought-07',
    title: 'Whitespace is Not Empty',
    category: 'Layout Theory',
    date: 'Oct 2025',
    cardType: 'standard',
    annotationType: 'measurement'
  },
  {
    id: 'thought-08',
    title: 'Responsive Thinking',
    subtitle: 'Beyond Breakpoints',
    category: 'Technical',
    date: 'Feb 2026',
    cardType: 'blueprint',
    annotationType: 'redline',
    hasTechnicalPattern: true
  },
  {
    id: 'thought-09',
    title: 'Consistency vs Cohesion',
    category: 'Design Systems',
    date: 'Jan 2026',
    cardType: 'standard',
    annotationType: 'stamp'
  },
  {
    id: 'thought-10',
    title: 'Performance is Design',
    category: 'Technical',
    date: 'Dec 2025',
    cardType: 'technical',
    annotationType: 'measurement',
    hasTechnicalPattern: true
  },
  {
    id: 'thought-11',
    title: 'Dark Patterns are Debt',
    category: 'Ethics',
    date: 'Nov 2025',
    cardType: 'inverted',
    annotationType: 'redline'
  },
  {
    id: 'thought-12',
    title: 'Icons are Language',
    category: 'UX Philosophy',
    date: 'Oct 2025',
    cardType: 'standard',
    annotationType: 'stamp'
  }
];

export function getThoughtsByCategory(category: string): DesignThought[] {
  return designThoughts.filter(thought =>
    thought.category.toLowerCase().includes(category.toLowerCase())
  );
}

export function getThoughtsByType(type: ThoughtCardType): DesignThought[] {
  return designThoughts.filter(thought => thought.cardType === type);
}

export const categories = [
  'All',
  'UX Philosophy',
  'Layout Theory',
  'Type Design',
  'Animation',
  'Visual Design',
  'Technical',
  'Design Systems',
  'Ethics'
];
