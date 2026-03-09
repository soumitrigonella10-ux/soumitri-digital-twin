import type { Artifact } from "./types";

// All artifacts are now managed via CMS
export const artifacts: Artifact[] = [];

// ========================================
// Artifact Helpers (query functions)
// ========================================

export function getArtifactsByMedium(medium: string): Artifact[] {
  return artifacts.filter(artifact => 
    artifact.medium.toLowerCase().includes(medium.toLowerCase())
  );
}

export function getArtifactsByYear(_year: string): Artifact[] {
  // date field was removed from Artifact; CMS items use metadata.date instead
  return [];
}
