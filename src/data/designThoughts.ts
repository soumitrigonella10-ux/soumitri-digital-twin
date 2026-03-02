import type { ThoughtCardType, AnnotationType, DesignThought } from "@/types/editorial";
export type { ThoughtCardType, AnnotationType, DesignThought };

// All design thoughts are now managed via CMS
export const designThoughts: DesignThought[] = [];

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
