import type { Column } from "./column";

export enum Role {
  OWNER = 0,
  MEMBER = 1,
  VIEWER = 2,
}

export interface BoardMember {
  id: string;
  email: string;
  name: string;
  role: Role;
  addedAt: string;
}

export interface Board {
  id: string;
  title: string;
  ownerId: number;
  starred?: boolean;
  columns: Column[];
  members?: BoardMember[];
}
