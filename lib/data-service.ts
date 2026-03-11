export const customerOrgMap: Record<string, string> = {};

const BACKEND = process.env.NEXT_PUBLIC_NATUREX_BACKEND!;

function url(path: string) {
  return new URL(path, BACKEND).toString();
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(url(path), { credentials: 'include', ...init });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProjectTheme = 'efficiency' | 'asset' | 'biodiversity';

export type DeliveryStage =
  | 'pending'
  | 'analyzing'
  | 'delivering'
  | 'executing'
  | 'completed';

export type Project = {
  projectId: string;
  name: string;
  description: string | null;
  location: string;
  theme: ProjectTheme;
  orgId: string;
  managerId: string | null;
  deliveryStage: DeliveryStage;
};

export type Organization = {
  orgId: string;
  name: string;
  industry: string;
  contact: string;
  status: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  orgId: string | null;
};

export type ResultConfig = {
  map: { enabled: boolean; types: ('geojson' | 'tiles3d' | 'laz')[] };
  downloads: { enabled: boolean };
  tables: { enabled: boolean; types: ('table' | 'bar' | 'line' | 'kpi')[] };
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const DELIVERY_STAGES: Record<DeliveryStage, { kr: string }> = {
  pending: { kr: '요청' },
  analyzing: { kr: '분석 중' },
  delivering: { kr: '납품 중' },
  executing: { kr: '실행 중' },
  completed: { kr: '완료' },
};

export const themeLabels: Record<ProjectTheme, string> = {
  efficiency: '운영비 절감',
  asset: '자산 가치 향상',
  biodiversity: '생물다양성',
};

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapProject(raw: Record<string, any>): Project {
  return {
    projectId: String(raw.id),
    name: raw.name,
    description: raw.description ?? null,
    location: raw.location ?? '',
    theme: (raw.theme as string).toLowerCase() as ProjectTheme,
    orgId: String(raw.organizationId ?? raw.orgId ?? ''),
    managerId: raw.managerId ? String(raw.managerId) : null,
    deliveryStage: (
      (raw.currentStatus ?? raw.deliveryStage ?? 'pending') as string
    ).toLowerCase() as DeliveryStage,
  };
}

function mapOrganization(raw: Record<string, any>): Organization {
  return {
    orgId: String(raw.id ?? raw.orgId),
    name: raw.name,
    industry: raw.type ?? raw.industry ?? '',
    contact: raw.contact ?? '',
    status: (raw.status as string).toLowerCase(),
  };
}

function mapUser(raw: Record<string, any>): User {
  const roles: string[] = raw.roles ?? [];
  return {
    id: String(raw.id),
    name: raw.name ?? '',
    email: raw.email,
    role: roles.includes('ADMIN') ? 'admin' : 'customer',
    orgId: raw.organizationId ? String(raw.organizationId) : null,
  };
}

// ─── Organizations ────────────────────────────────────────────────────────────

export async function getOrganizations(): Promise<Organization[]> {
  const res = await apiFetch('organizations');
  const data = await res.json();
  return (data as Record<string, any>[]).map(mapOrganization);
}

export async function createOrganization(
  org: Pick<Organization, 'name' | 'industry' | 'contact'> & {
    orgId?: string;
    status?: string;
  },
): Promise<Organization> {
  const res = await apiFetch('organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: org.name,
      type: org.industry || 'COMPANY',
      size: 'SMALL',
      contact: org.contact,
    }),
  });
  return mapOrganization(await res.json());
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const res = await apiFetch('projects');
  const data = await res.json();
  return (data as Record<string, any>[]).map(mapProject);
}

export async function createProject(data: {
  projectId: string;
  orgId: string;
  name: string;
  theme: ProjectTheme;
  location: string;
  description?: string | null;
  resultConfig?: ResultConfig;
}): Promise<void> {
  await apiFetch('projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      description: data.description ?? null,
      location: data.location,
      theme: data.theme.toUpperCase(),
      organizationId: data.orgId,
      status: 'PENDING',
    }),
  });
}

export async function updateProjectDeliveryStage(
  projectId: string,
  stage: DeliveryStage,
  memo: string,
): Promise<void> {
  await apiFetch('projects', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: projectId,
      status: stage.toUpperCase(),
      description: memo,
    }),
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiFetch('projects', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: projectId }),
  });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  // No GET /users endpoint yet — return empty
  return [];
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: string;
  orgId?: string | null;
}): Promise<User> {
  const res = await apiFetch('auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
    }),
  });
  const json = await res.json();
  return mapUser(json.user ?? json);
}

export async function deleteUser(_userId: string): Promise<void> {
  // No DELETE /users endpoint yet
}
