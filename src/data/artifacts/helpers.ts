import type { Artifact } from "./types";
import { artifacts } from "./artifacts";

export function getArtifactsByMedium(medium: string): Artifact[] {
  return artifacts.filter(artifact => 
    artifact.medium.toLowerCase().includes(medium.toLowerCase())
  );
}

export function getArtifactsByYear(year: string): Artifact[] {
  return artifacts.filter(artifact => artifact.date.includes(year));
}
