export interface Card {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  deadline?: string;
  images?: string[];
  assignees?: string[];
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}
