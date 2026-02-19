export type ThoughtCardType = 'standard' | 'blueprint' | 'inverted' | 'technical';
export type AnnotationType = 'measurement' | 'redline' | 'stamp' | 'none';

export interface DesignThought {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  category: string;
  date: string;
  cardType: ThoughtCardType;
  annotationType: AnnotationType;
  measurement?: {
    label: string;
    position: 'top' | 'right' | 'bottom' | 'left';
  };
  redlineText?: string;
  stampText?: string;
  hasTechnicalPattern?: boolean;
  pdfUrl?: string;
}

export const designThoughts: DesignThought[] = [
  {
    id: 'thought-01',
    title: 'The Paradox of Choice',
    subtitle: 'in Digital Interfaces',
    content: [
      'Users claim they want options, but every additional choice increases cognitive load exponentially.',
      'The best interfaces make decisions on behalf of the user, leaving only the meaningful choices visible.',
      'Constraint is not limitation—it is liberation through clarity.'
    ],
    category: 'UX Philosophy',
    date: 'Feb 2026',
    cardType: 'standard',
    annotationType: 'redline',
    redlineText: 'APPROVED',
    pdfUrl: '/pdfs/essays/design-philosophy.pdf'
  },
  {
    id: 'thought-02',
    title: 'Grid Systems',
    subtitle: 'as Visual Language',
    content: [
      'The grid is not a cage—it is a musical staff. Notes placed on it gain meaning through their relationships.',
      'Swiss design taught us that systematic thinking creates freedom, not restriction.',
      'A well-defined grid becomes invisible to users but omnipresent to designers.'
    ],
    category: 'Layout Theory',
    date: 'Jan 2026',
    cardType: 'blueprint',
    annotationType: 'measurement',
    pdfUrl: '/pdfs/essays/grid-systems.pdf',
    measurement: {
      label: '320px',
      position: 'right'
    },
    hasTechnicalPattern: true
  },
  {
    id: 'thought-03',
    title: 'Typography is Voice',
    content: [
      'Every typeface has a personality. Choosing one is like casting an actor for a role.',
      'Hierarchy is not about size—it is about rhythm, weight, and whitespace working in concert.',
      'Readers should never notice good typography. They should only feel it.'
    ],
    category: 'Type Design',
    date: 'Feb 2026',
    cardType: 'standard',
    annotationType: 'stamp',
    stampText: 'Draft v2',
    pdfUrl: '/pdfs/essays/typography-voice.pdf'
  },
  {
    id: 'thought-04',
    title: 'Interaction Timing',
    subtitle: 'The Invisible Craft',
    content: [
      'A 300ms transition feels sluggish. A 100ms transition feels abrupt. 200ms is the sweet spot for most UI.',
      'Easing curves are the unsung heroes of delightful interfaces. cubic-bezier(0.16, 1, 0.3, 1) is my go-to.',
      'Motion should clarify relationships, not distract from them.'
    ],
    category: 'Animation',
    date: 'Dec 2025',
    cardType: 'technical',
    annotationType: 'measurement',
    measurement: {
      label: '200ms',
      position: 'top'
    },
    hasTechnicalPattern: true,
    pdfUrl: '/pdfs/essays/interaction-timing.pdf'
  },
  {
    id: 'thought-05',
    title: 'Color as System',
    content: [
      'Color is not decoration—it is communication. Every hue carries cultural weight and psychological impact.',
      'A limited palette forces intentionality. Five colors are enough to build an empire.',
      'Accessibility is not a constraint. It is a design challenge that makes everyone better.'
    ],
    category: 'Visual Design',
    date: 'Jan 2026',
    cardType: 'standard',
    annotationType: 'redline',
    redlineText: 'REVISE'
  },
  {
    id: 'thought-06',
    title: 'The Fold Myth',
    content: [
      'Users scroll. They have always scrolled. The fold is a newspaper metaphor that died with print.',
      'What matters is not placement—it is visual weight and scent of information.',
      'If your design requires users to see everything "above the fold," you have failed to create a hierarchy.'
    ],
    category: 'UX Philosophy',
    date: 'Nov 2025',
    cardType: 'inverted',
    annotationType: 'stamp',
    stampText: 'Controversial'
  },
  {
    id: 'thought-07',
    title: 'Whitespace is Not Empty',
    content: [
      'Negative space is as important as positive space. It is the silence between notes.',
      'Cramming elements together does not create efficiency—it creates confusion.',
      'Breathing room is a luxury that costs nothing but intention.'
    ],
    category: 'Layout Theory',
    date: 'Oct 2025',
    cardType: 'standard',
    annotationType: 'measurement',
    measurement: {
      label: '80px',
      position: 'left'
    }
  },
  {
    id: 'thought-08',
    title: 'Responsive Thinking',
    subtitle: 'Beyond Breakpoints',
    content: [
      'Mobile-first is not about screen size—it is about constraint-driven design.',
      'Every element should justify its existence on a 320px canvas before it earns a place on desktop.',
      'Responsive design is not adaptive layouts. It is adaptive thinking.'
    ],
    category: 'Technical',
    date: 'Feb 2026',
    cardType: 'blueprint',
    annotationType: 'redline',
    redlineText: 'CORE PRINCIPLE',
    hasTechnicalPattern: true
  },
  {
    id: 'thought-09',
    title: 'Consistency vs Cohesion',
    content: [
      'Consistency is using the same button style everywhere. Cohesion is ensuring every element feels like it belongs.',
      'Users forgive inconsistency if they sense intentionality.',
      'A design system is a language, not a prison.'
    ],
    category: 'Design Systems',
    date: 'Jan 2026',
    cardType: 'standard',
    annotationType: 'stamp',
    stampText: 'Approved'
  },
  {
    id: 'thought-10',
    title: 'Performance is Design',
    content: [
      'A slow interface is a broken interface. No amount of visual polish can compensate for lag.',
      'Every asset, every animation, every request—they all have weight. Respect it.',
      'Users will tolerate ugly. They will not tolerate slow.'
    ],
    category: 'Technical',
    date: 'Dec 2025',
    cardType: 'technical',
    annotationType: 'measurement',
    measurement: {
      label: '<100ms',
      position: 'bottom'
    },
    hasTechnicalPattern: true
  },
  {
    id: 'thought-11',
    title: 'Dark Patterns are Debt',
    content: [
      'Manipulative design might boost short-term metrics, but it destroys long-term trust.',
      'Every time you trick a user, you trade future loyalty for immediate gain.',
      'Ethics in design is not optional. It is foundational.'
    ],
    category: 'Ethics',
    date: 'Nov 2025',
    cardType: 'inverted',
    annotationType: 'redline',
    redlineText: 'URGENT'
  },
  {
    id: 'thought-12',
    title: 'Icons are Language',
    content: [
      'A hamburger menu is not universal. Neither is a floppy disk for "save."',
      'Icons work when they leverage existing mental models. Otherwise, they are visual noise.',
      'When in doubt, add a label. Clarity beats cleverness.'
    ],
    category: 'UX Philosophy',
    date: 'Oct 2025',
    cardType: 'standard',
    annotationType: 'stamp',
    stampText: 'Reference'
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
