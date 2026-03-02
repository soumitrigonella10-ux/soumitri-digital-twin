// ========================================
// Skill Acquisition Laboratory — Experiments
// ========================================

import type { SkillExperiment } from "@/types/editorial";
export type { SkillExperiment };

// All skill experiments are now managed via CMS
export const skillExperiments: SkillExperiment[] = [];

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
  if (skillExperiments.length === 0) return 0;
  const total = skillExperiments.reduce((sum, exp) => sum + exp.proficiency, 0);
  return Math.round(total / skillExperiments.length);
}
