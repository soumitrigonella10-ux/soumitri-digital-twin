// ========================================
// Skill Acquisition Laboratory — Experiments
// ========================================

export interface SkillExperiment {
  id: string;
  experimentNumber: number;
  name: string;
  tools: string[]; // Technologies, frameworks, methodologies
  proficiency: number; // 0-100 percentage
  description: string;
  category: "Technical" | "Design" | "Strategy" | "Craft" | "Language";
  isInverted?: boolean; // Dark card styling
}

export const skillExperiments: SkillExperiment[] = [
  {
    id: "exp-001",
    experimentNumber: 1,
    name: "Systems Thinking",
    tools: ["Mental Models", "Causal Loop Diagrams", "Feedback Systems"],
    proficiency: 65,
    description: "Understanding interconnected patterns, feedback loops, and emergent behavior. Learning to see the forest and the trees simultaneously.",
    category: "Strategy",
  },
  {
    id: "exp-002",
    experimentNumber: 2,
    name: "Advanced TypeScript",
    tools: ["Generics", "Type Guards", "Conditional Types", "Decorators"],
    proficiency: 78,
    description: "Moving beyond basic typing to leverage TypeScript's advanced features for building robust, self-documenting systems.",
    category: "Technical",
    isInverted: true,
  },
  {
    id: "exp-003",
    experimentNumber: 3,
    name: "Design Systems Architecture",
    tools: ["Figma", "Tokens Studio", "Storybook", "Component Libraries"],
    proficiency: 72,
    description: "Creating scalable, maintainable design languages that bridge the gap between design intent and engineering implementation.",
    category: "Design",
  },
  {
    id: "exp-004",
    experimentNumber: 4,
    name: "Japanese Language (日本語)",
    tools: ["Hiragana", "Katakana", "N5 Grammar", "Anki SRS"],
    proficiency: 42,
    description: "Learning to read, write, and think in a language with fundamentally different structure. Progress is slow, but the cognitive rewiring is profound.",
    category: "Language",
  },
  {
    id: "exp-005",
    experimentNumber: 5,
    name: "Data Visualization",
    tools: ["D3.js", "Observable", "Tableau", "Information Theory"],
    proficiency: 58,
    description: "Transforming raw data into visual narratives that reveal patterns invisible in spreadsheets. The art of making numbers legible.",
    category: "Technical",
    isInverted: true,
  },
  {
    id: "exp-006",
    experimentNumber: 6,
    name: "Woodworking Fundamentals",
    tools: ["Hand Planes", "Chisels", "Joinery", "Wood Selection"],
    proficiency: 35,
    description: "Learning to work with natural materials that demand patience, precision, and respect. Every mistake teaches; every success is tangible.",
    category: "Craft",
  },
  {
    id: "exp-007",
    experimentNumber: 7,
    name: "Product Strategy",
    tools: ["Jobs-to-be-Done", "Kano Model", "North Star Metrics", "User Research"],
    proficiency: 81,
    description: "Developing frameworks to identify what to build, why it matters, and how to measure success beyond vanity metrics.",
    category: "Strategy",
  },
  {
    id: "exp-008",
    experimentNumber: 8,
    name: "Motion Design",
    tools: ["Framer Motion", "GSAP", "After Effects", "Easing Functions"],
    proficiency: 67,
    description: "Understanding that animation is more than decoration—it's communication. Choreographing transitions that feel inevitable.",
    category: "Design",
    isInverted: true,
  },
  {
    id: "exp-009",
    experimentNumber: 9,
    name: "API Design Patterns",
    tools: ["REST", "GraphQL", "OpenAPI", "Webhook Architecture"],
    proficiency: 73,
    description: "Crafting interfaces between systems that are intuitive for humans and robust for machines. The handshake that makes ecosystems possible.",
    category: "Technical",
  },
  {
    id: "exp-010",
    experimentNumber: 10,
    name: "Analog Photography",
    tools: ["35mm Film", "Darkroom Process", "Zone System", "Chemical Development"],
    proficiency: 48,
    description: "Slowing down the act of image-making. Every shot costs something; every frame demands intention. The constraint breeds clarity.",
    category: "Craft",
  },
  {
    id: "exp-011",
    experimentNumber: 11,
    name: "Accessibility Engineering",
    tools: ["ARIA", "Screen Readers", "WCAG 2.1", "Keyboard Navigation"],
    proficiency: 69,
    description: "Building interfaces that don't exclude. Universal design isn't charity—it's craft. Making the invisible visible.",
    category: "Technical",
    isInverted: true,
  },
  {
    id: "exp-012",
    experimentNumber: 12,
    name: "Strategic Writing",
    tools: ["Argument Structure", "Rhetoric", "Clarity", "Concision"],
    proficiency: 76,
    description: "Learning to write with intention—not to fill space, but to change minds. Every sentence earns its place or gets cut.",
    category: "Strategy",
  },
];

// Helper functions
export function getExperimentById(id: string): SkillExperiment | undefined {
  return skillExperiments.find((exp) => exp.id === id);
}

export function getExperimentsByCategory(category: string): SkillExperiment[] {
  if (category === "All") return skillExperiments;
  return skillExperiments.filter((exp) => exp.category === category);
}

export function getCurrentSkills(): SkillExperiment[] {
  return skillExperiments.filter((exp) => exp.proficiency < 75);
}

export function getAchievedSkills(): SkillExperiment[] {
  return skillExperiments.filter((exp) => exp.proficiency >= 75);
}

export function getAverageProficiency(): number {
  const total = skillExperiments.reduce((sum, exp) => sum + exp.proficiency, 0);
  return Math.round(total / skillExperiments.length);
}
