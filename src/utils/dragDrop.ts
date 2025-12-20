import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Board } from "../types/board";
import { ActivityType } from "../types/activity";

export const handleColumnDragEnd = (
  event: DragEndEvent,
  board: Board,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return null;

  const oldIndex = board.columns.findIndex((col) => col.id === active.id);
  const newIndex = board.columns.findIndex((col) => col.id === over.id);

  const column = board.columns[oldIndex];
  if (column) {
    logActivity(
      board.id,
      ActivityType.COLUMN_MOVED,
      `đã di chuyển cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: arrayMove(board.columns, oldIndex, newIndex),
  };
};

export const handleCardDragEnd = (
  event: DragEndEvent,
  board: Board,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const { active, over } = event;

  if (!over) return null;

  const activeColumnId = active.data.current?.columnId;
  const overColumnId = over.data.current?.columnId || over.id;

  const activeColumn = board.columns.find((col) => col.id === activeColumnId);
  const overColumn = board.columns.find((col) => col.id === overColumnId);

  if (!activeColumn || !overColumn) return null;

  const activeCardIndex = activeColumn.cards.findIndex(
    (card) => card.id === active.id
  );
  const activeCard = activeColumn.cards[activeCardIndex];

  if (activeColumnId === overColumnId) {
    const overCardIndex = overColumn.cards.findIndex(
      (card) => card.id === over.id
    );

    if (activeCardIndex === overCardIndex) return null;

    logActivity(
      board.id,
      ActivityType.CARD_MOVED,
      `đã di chuyển thẻ "${activeCard.title}" trong cột "${activeColumn.title}"`
    );

    return {
      ...board,
      columns: board.columns.map((col) =>
        col.id === activeColumnId
          ? {
              ...col,
              cards: arrayMove(col.cards, activeCardIndex, overCardIndex),
            }
          : col
      ),
    };
  }

  logActivity(
    board.id,
    ActivityType.CARD_MOVED,
    `đã di chuyển thẻ "${activeCard.title}" từ cột "${activeColumn.title}" sang cột "${overColumn.title}"`
  );

  const newActiveColumn = {
    ...activeColumn,
    cards: activeColumn.cards.filter((card) => card.id !== active.id),
  };

  const overCardIndex =
    over.data.current?.type === "card"
      ? overColumn.cards.findIndex((card) => card.id === over.id)
      : overColumn.cards.length;

  const newOverColumn = {
    ...overColumn,
    cards: [
      ...overColumn.cards.slice(0, overCardIndex),
      activeCard,
      ...overColumn.cards.slice(overCardIndex),
    ],
  };

  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === activeColumnId) return newActiveColumn;
      if (col.id === overColumnId) return newOverColumn;
      return col;
    }),
  };
};
