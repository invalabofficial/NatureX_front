export interface Project {
  id: string;
  name: string;
}

const projects: Project[] = [];

export function getProject(id: string): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}
