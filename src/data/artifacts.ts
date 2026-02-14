export type FrameType = 'hero' | 'standard' | 'mini' | 'tiny' | 'wide';
export type OffsetType = 'offset-up' | 'offset-down' | 'pull-left' | 'pull-right' | 'none';
export type BorderStyle = 'polaroid' | 'thin' | 'shadow' | 'none';
export type InspirationTemplateType = 'image' | 'music' | 'quote' | 'video';

export interface Artifact {
  id: string;
  title: string;
  medium: string;
  date: string;
  dimensions?: string;
  frameType: FrameType;
  offsetType: OffsetType;
  borderStyle: BorderStyle;
  hasWashiTape?: boolean;
  rotation?: string; // e.g., "-1deg", "0.5deg"
  paperNote?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  imagePath?: string; // Optional for now - can use placeholder
  backgroundColor?: string; // For text-only or abstract pieces
  description?: string;
}

export const artifacts: Artifact[] = [
  {
    id: 'artifact-01',
    title: 'Urban Geometry Study',
    medium: 'Digital Photography',
    date: 'January 2026',
    dimensions: '3840 × 2160',
    frameType: 'hero',
    offsetType: 'none',
    borderStyle: 'shadow',
    rotation: '-0.5deg',
    hasWashiTape: true,
    paperNote: {
      text: 'Captured at Golden Hour',
      position: 'bottom-right'
    },
    backgroundColor: '#2D2424',
    description: 'Architectural abstraction exploring light and shadow dynamics in modernist structures.'
  },
  {
    id: 'artifact-02',
    title: 'Field Notes: Kyoto',
    medium: 'Ink & Watercolor',
    date: 'March 2025',
    frameType: 'standard',
    offsetType: 'offset-up',
    borderStyle: 'polaroid',
    rotation: '1.5deg',
    hasWashiTape: false,
    paperNote: {
      text: 'Temple sketch series',
      position: 'top-left'
    },
    backgroundColor: '#C4B6A6'
  },
  {
    id: 'artifact-03',
    title: 'Textile Pattern Exploration',
    medium: 'Digital Illustration',
    date: 'November 2025',
    frameType: 'mini',
    offsetType: 'pull-right',
    borderStyle: 'thin',
    rotation: '-2deg',
    backgroundColor: '#802626'
  },
  {
    id: 'artifact-04',
    title: 'Manifesto: On Slow Living',
    medium: 'Typographic Composition',
    date: 'December 2025',
    frameType: 'wide',
    offsetType: 'none',
    borderStyle: 'none',
    backgroundColor: '#F9F7F2',
    description: 'A reflective meditation on intentionality, crafted in response to the relentless acceleration of modern existence.'
  },
  {
    id: 'artifact-05',
    title: 'Portrait: M',
    medium: '35mm Film',
    date: 'August 2024',
    dimensions: '4" × 6"',
    frameType: 'standard',
    offsetType: 'offset-down',
    borderStyle: 'polaroid',
    rotation: '-1deg',
    hasWashiTape: true,
    paperNote: {
      text: 'Nikon FM2, Portra 400',
      position: 'bottom-left'
    },
    backgroundColor: '#4A4A4A'
  },
  {
    id: 'artifact-06',
    title: 'Color Study 07',
    medium: 'Acrylic on Canvas',
    date: 'February 2026',
    dimensions: '12" × 12"',
    frameType: 'mini',
    offsetType: 'pull-left',
    borderStyle: 'shadow',
    rotation: '0.8deg',
    backgroundColor: '#D4A574'
  },
  {
    id: 'artifact-07',
    title: 'Botanical Series: Desert Flora',
    medium: 'Cyanotype Print',
    date: 'July 2025',
    dimensions: '8" × 10"',
    frameType: 'standard',
    offsetType: 'offset-up',
    borderStyle: 'thin',
    rotation: '1deg',
    hasWashiTape: true,
    backgroundColor: '#1B3A52'
  },
  {
    id: 'artifact-08',
    title: 'Sketch: Coffee Shop Corner',
    medium: 'Graphite on Paper',
    date: 'October 2025',
    frameType: 'mini',
    offsetType: 'none',
    borderStyle: 'polaroid',
    rotation: '-1.5deg',
    paperNote: {
      text: 'Quick 15-min study',
      position: 'top-right'
    },
    backgroundColor: '#E8E3D8'
  },
  {
    id: 'artifact-09',
    title: 'Abstract Composition #14',
    medium: 'Mixed Media',
    date: 'May 2025',
    dimensions: '24" × 36"',
    frameType: 'hero',
    offsetType: 'pull-left',
    borderStyle: 'shadow',
    rotation: '0.3deg',
    hasWashiTape: false,
    backgroundColor: '#A65555'
  },
  {
    id: 'artifact-10',
    title: 'Typography Experiment: Brutalist',
    medium: 'Digital Design',
    date: 'September 2025',
    frameType: 'standard',
    offsetType: 'offset-down',
    borderStyle: 'none',
    rotation: '-0.5deg',
    backgroundColor: '#2D2424',
    description: 'Exploring weight, hierarchy, and tension through severely constrained letterforms.'
  },
  {
    id: 'artifact-11',
    title: 'Light Study: Afternoon',
    medium: 'Digital Photography',
    date: 'January 2026',
    dimensions: '2400 × 3200',
    frameType: 'mini',
    offsetType: 'pull-right',
    borderStyle: 'thin',
    rotation: '2deg',
    hasWashiTape: true,
    backgroundColor: '#F4E8D0'
  },
  {
    id: 'artifact-12',
    title: 'Visual Essay: The Grid',
    medium: 'Editorial Layout',
    date: 'December 2025',
    frameType: 'wide',
    offsetType: 'none',
    borderStyle: 'shadow',
    backgroundColor: '#FFFFFF',
    description: 'A typographic investigation into the history, philosophy, and psychological impact of grid systems in visual communication.'
  },
  {
    id: 'artifact-13',
    title: 'Collage: Memory Fragments',
    medium: 'Paper & Found Objects',
    date: 'April 2025',
    dimensions: '11" × 14"',
    frameType: 'standard',
    offsetType: 'offset-up',
    borderStyle: 'polaroid',
    rotation: '1.2deg',
    hasWashiTape: true,
    paperNote: {
      text: 'Assembled from travels',
      position: 'bottom-right'
    },
    backgroundColor: '#B8A896'
  },
  {
    id: 'artifact-14',
    title: 'Gesture Drawing #42',
    medium: 'Charcoal',
    date: 'June 2025',
    frameType: 'mini',
    offsetType: 'pull-left',
    borderStyle: 'thin',
    rotation: '-1.8deg',
    backgroundColor: '#E0D5C7'
  },
  {
    id: 'artifact-15',
    title: 'Architectural Detail: Stairwell',
    medium: 'Digital Photography',
    date: 'November 2025',
    dimensions: '3000 × 4000',
    frameType: 'standard',
    offsetType: 'offset-down',
    borderStyle: 'shadow',
    rotation: '0.5deg',
    hasWashiTape: false,
    paperNote: {
      text: 'Symmetry & repetition',
      position: 'top-left'
    },
    backgroundColor: '#4E5D6C'
  }
];

// ============================================
// INSPIRATION FRAGMENTS
// ============================================

export interface InspirationFragment {
  id: string;
  type: InspirationTemplateType;
  content: string; // Main text/title
  source?: string; // Artist name, author, source, etc.
  subtitle?: string; // Additional info
  backgroundColor?: string;
  accentColor?: string;
}

export const inspirations: InspirationFragment[] = [
  // Image Fragments
  {
    id: 'insp-01',
    type: 'image',
    content: 'Sunset over Santorini',
    source: 'Travel Journal 2025',
    backgroundColor: '#F4E8D0'
  },
  {
    id: 'insp-02',
    type: 'image',
    content: 'Brutalist Architecture',
    source: 'Berlin Documentation',
    backgroundColor: '#D5D0C8'
  },
  {
    id: 'insp-03',
    type: 'image',
    content: 'Botanical Study #12',
    source: 'Field Notes',
    backgroundColor: '#C8D4C0'
  },
  
  // Music Snippets
  {
    id: 'insp-04',
    type: 'music',
    content: 'Clair de Lune',
    source: 'Claude Debussy',
    subtitle: '4:32',
    backgroundColor: '#802626',
    accentColor: '#C4B6A6'
  },
  {
    id: 'insp-05',
    type: 'music',
    content: 'A Love Supreme',
    source: 'John Coltrane',
    subtitle: '7:47',
    backgroundColor: '#5C4033',
    accentColor: '#D4A574'
  },
  {
    id: 'insp-06',
    type: 'music',
    content: 'Svefn-g-englar',
    source: 'Sigur Rós',
    subtitle: '10:04',
    backgroundColor: '#4A5568',
    accentColor: '#B8C5D9'
  },
  
  // Quote Fragments
  {
    id: 'insp-07',
    type: 'quote',
    content: 'The details are not the details. They make the design.',
    source: 'Charles Eames',
    backgroundColor: '#FFFFFF'
  },
  {
    id: 'insp-08',
    type: 'quote',
    content: 'Simplicity is the ultimate sophistication.',
    source: 'Leonardo da Vinci',
    backgroundColor: '#FFF9F0'
  },
  {
    id: 'insp-09',
    type: 'quote',
    content: 'Good design is as little design as possible.',
    source: 'Dieter Rams',
    backgroundColor: '#F9F7F2'
  },
  {
    id: 'insp-10',
    type: 'quote',
    content: 'Everything is designed. Few things are designed well.',
    source: 'Brian Reed',
    backgroundColor: '#FFF5E6'
  },
  
  // Video Fragments
  {
    id: 'insp-11',
    type: 'video',
    content: 'Tokyo Timelapse',
    source: 'Motion Archive',
    subtitle: '2:30',
    backgroundColor: '#2D2424'
  },
  {
    id: 'insp-12',
    type: 'video',
    content: 'Ocean Waves Study',
    source: 'Nature Series',
    subtitle: '5:12',
    backgroundColor: '#1B3A52'
  },
  
  // More Image Fragments
  {
    id: 'insp-13',
    type: 'image',
    content: 'Coffee & Notebooks',
    source: 'Daily Rituals',
    backgroundColor: '#E8D5C4'
  },
  {
    id: 'insp-14',
    type: 'image',
    content: 'Typography Exploration',
    source: 'Design Lab',
    backgroundColor: '#D9C7B8'
  },
  
  // More Music
  {
    id: 'insp-15',
    type: 'music',
    content: 'River Flows In You',
    source: 'Yiruma',
    subtitle: '3:40',
    backgroundColor: '#6B5B4E',
    accentColor: '#C9B8A8'
  },
  {
    id: 'insp-16',
    type: 'music',
    content: 'Weightless',
    source: 'Marconi Union',
    subtitle: '8:10',
    backgroundColor: '#4E6E7C',
    accentColor: '#A8C5D4'
  },
  
  // More Quotes
  {
    id: 'insp-17',
    type: 'quote',
    content: 'Design is intelligence made visible.',
    source: 'Alina Wheeler',
    backgroundColor: '#FFFBF5'
  },
  {
    id: 'insp-18',
    type: 'quote',
    content: 'Art is the elimination of the unnecessary.',
    source: 'Pablo Picasso',
    backgroundColor: '#FEFAF2'
  },
  
  // More Video
  {
    id: 'insp-19',
    type: 'video',
    content: 'Northern Lights',
    source: 'Iceland Footage',
    subtitle: '1:45',
    backgroundColor: '#2A3F5F'
  },
  {
    id: 'insp-20',
    type: 'video',
    content: 'Paris Street Life',
    source: 'Urban Studies',
    subtitle: '4:20',
    backgroundColor: '#3D3428'
  },
  
  // Additional variety
  {
    id: 'insp-21',
    type: 'image',
    content: 'Minimalist Interior',
    source: 'Architecture Digest',
    backgroundColor: '#EAE4DC'
  },
  {
    id: 'insp-22',
    type: 'quote',
    content: 'Have no fear of perfection - you will never reach it.',
    source: 'Salvador Dali',
    backgroundColor: '#FFF8F0'
  },
  {
    id: 'insp-23',
    type: 'music',
    content: 'Gymnopedie No. 1',
    source: 'Erik Satie',
    subtitle: '3:27',
    backgroundColor: '#5E4F41',
    accentColor: '#BFB3A3'
  },
  {
    id: 'insp-24',
    type: 'image',
    content: 'Street Signs Tokyo',
    source: 'Urban Typography',
    backgroundColor: '#D8CDC2'
  },
  {
    id: 'insp-25',
    type: 'video',
    content: 'Calligraphy in Motion',
    source: 'Art Process',
    subtitle: '3:05',
    backgroundColor: '#1F1F1F'
  }
];

export function getArtifactsByMedium(medium: string): Artifact[] {
  return artifacts.filter(artifact => 
    artifact.medium.toLowerCase().includes(medium.toLowerCase())
  );
}

export function getArtifactsByYear(year: string): Artifact[] {
  return artifacts.filter(artifact => artifact.date.includes(year));
}
