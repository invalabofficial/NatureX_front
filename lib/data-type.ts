export interface Org {
  id: string;
  name: string;
}

const orgStorage: Org[] = [];

export function getOrgs(): Org[] {
  return orgStorage;
}

export function createOrg(name: string): Org {
  const org: Org = { id: crypto.randomUUID(), name };
  orgStorage.push(org);
  return org;
}

export const enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  public id!: string;
  public email!: string;
  public roles!: UserRole[];
  public name!: string | null;
  public phoneNumber!: string | null;
  public bio!: string | null;
  public organizationId!: string | null;
  public language!: string;
  public timezone!: string;

  constructor(user: {
    id: string;
    email: string;
    roles: UserRole[];
    name: string | null;
    phoneNumber: string | null;
    bio: string | null;
    organizationId: string | null;
    language: string;
    timezone: string;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.roles = user.roles;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.bio = user.bio;
    this.organizationId = user.organizationId;
    this.language = user.language;
    this.timezone = user.timezone;
  }
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum OrganizationType {
  'COMPANY' = 'COMPANY',
  'PUBLIC' = 'PUBLIC',
  'NGO' = 'NGO',
}

export enum OrganizationSize {
  'SOLO' = 'SOLO',
  'SMALL' = 'SMALL',
  'MEDIUM' = 'MEDIUM',
  'ENTERPRISE' = 'ENTERPRISE',
}

export class Organization {
  public id!: string;
  public name!: string;
  public type!: OrganizationType;
  public size!: OrganizationSize;
  public contact!: string;
  public website!: string;
  public status!: OrganizationStatus;
  public createdAt!: Date;

  constructor(org: {
    id: string;
    name: string;
    type: keyof typeof OrganizationType;
    size: keyof typeof OrganizationSize;
    contact: string;
    website: string;
    status: keyof typeof OrganizationStatus;
    createdAt: Date;
  }) {
    this.id = org.id;
    this.name = org.name;
    this.type = OrganizationType[org.type];
    this.size = OrganizationSize[org.size];
    this.status = OrganizationStatus[org.status];
    this.contact = org.contact;
    this.website = org.website;
    this.createdAt = org.createdAt;
  }
}

export enum ProjectTheme {
  EFFICIENCY = 'EFFICIENCY',
  ASSET = 'ASSET',
  BIODIVERSITY = 'BIODIVERSITY',
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  DELIVERING = 'DELIVERING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
}

export class ProjectStatusLog {
  id!: string;
  status!: ProjectStatus;
  changedBy!: string;
  description!: string | undefined | null;

  constructor(statusLog: {
    id: string;
    status: ProjectStatus;
    changedBy: string;
    description: string | undefined | null;
  }) {
    this.id = statusLog.id;
    this.status = statusLog.status;
    this.changedBy = statusLog.changedBy;
    this.description = statusLog.description;
  }
}

export class Project {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public location!: string | null;
  public theme!: ProjectTheme;
  public organizationId!: string | null;
  public managerId!: string | null;
  public currentStatus!: ProjectStatus;

  constructor(project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    theme: ProjectTheme;
    organizationId: string | null;
    managerId: string | null;
    currentStatus: ProjectStatus;
  }) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.location = project.location;
    this.theme = project.theme;
    this.organizationId = project.organizationId;
    this.managerId = project.managerId;
    this.currentStatus = project.currentStatus;
  }
}
