export enum ActivityType {
  BOARD_CREATED = "BOARD_CREATED",
  BOARD_UPDATED = "BOARD_UPDATED",
  BOARD_DELETED = "BOARD_DELETED",
  COLUMN_CREATED = "COLUMN_CREATED",
  COLUMN_UPDATED = "COLUMN_UPDATED",
  COLUMN_DELETED = "COLUMN_DELETED",
  COLUMN_MOVED = "COLUMN_MOVED",
  CARD_CREATED = "CARD_CREATED",
  CARD_UPDATED = "CARD_UPDATED",
  CARD_DELETED = "CARD_DELETED",
  CARD_MOVED = "CARD_MOVED",
  MEMBER_ADDED = "MEMBER_ADDED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
  MEMBER_ROLE_CHANGED = "MEMBER_ROLE_CHANGED",
}

export interface Activity {
  id: string;
  boardId: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userEmail: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
