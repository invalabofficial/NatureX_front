export interface Project {
  id: string;
  name: string;
  config?: {
    managementScope?: string[];
    [key: string]: unknown;
  };
}

const projects: Project[] = [];

export function getProject(id: string): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}
