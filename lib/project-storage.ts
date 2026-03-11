export interface Project {
  id: string;
  name: string;
  config?: {
    managementScope?: string[];
    [key: string]: unknown;
  };
}

export interface Widget {
  id: string;
  type: string;
  enabled: boolean;
  permission: string;
  order: number;
  [key: string]: unknown;
}

export interface WidgetConfig {
  widgets: Widget[];
}

const projects: Project[] = [];

export function getProject(id: string): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}

export function getProjectById(id: string): Project | null {
  return getProject(id);
}

export function getWidgetConfig(_projectId: string): WidgetConfig {
  return { widgets: [] };
}
