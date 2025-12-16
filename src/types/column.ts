import type { Card } from "./card";

export interface Column {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
}
