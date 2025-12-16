import type { Column } from "./column";

export interface Board {
  id?: number;
  title: string;
  description?: string;
  stared: boolean;
  ownerId?: number;
  columns?: Column[];
}
