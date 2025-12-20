import type { Board } from "../types/board";
import type { Column } from "../types/column";
import { ActivityType } from "../types/activity";

export const createNewColumn = (
  board: Board,
  title: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  if (!title.trim()) {
    return { isValid: false, error: "Tên cột không được để trống" };
  }

  const newColumn: Column = {
    id: `column-${Date.now()}`,
    title: title.trim(),
    cards: [],
  };

  logActivity(
    board.id,
    ActivityType.COLUMN_CREATED,
    `đã tạo cột "${title.trim()}"`
  );

  return {
    isValid: true,
    board: {
      ...board,
      columns: [...board.columns, newColumn],
    },
  };
};

export const deleteColumn = (
  board: Board,
  columnId: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const column = board.columns.find((col) => col.id === columnId);
  if (column) {
    logActivity(
      board.id,
      ActivityType.COLUMN_DELETED,
      `đã xóa cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: board.columns.filter((col) => col.id !== columnId),
  };
};

export const updateColumnTitle = (
  board: Board,
  columnId: string,
  newTitle: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const column = board.columns.find((col) => col.id === columnId);
  if (column && column.title !== newTitle) {
    logActivity(
      board.id,
      ActivityType.COLUMN_UPDATED,
      `đã đổi tên cột từ "${column.title}" thành "${newTitle}"`
    );
  }

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    ),
  };
};

export const addCard = (
  board: Board,
  columnId: string,
  title: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const newCard = {
    id: `card-${Date.now()}`,
    title: title.trim(),
  };

  const column = board.columns.find((col) => col.id === columnId);
  if (column) {
    logActivity(
      board.id,
      ActivityType.CARD_CREATED,
      `đã tạo thẻ "${title.trim()}" trong cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    ),
  };
};

export const deleteCard = (
  board: Board,
  columnId: string,
  cardId: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const column = board.columns.find((col) => col.id === columnId);
  const card = column?.cards.find((c) => c.id === cardId);
  if (column && card) {
    logActivity(
      board.id,
      ActivityType.CARD_DELETED,
      `đã xóa thẻ "${card.title}" khỏi cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    ),
  };
};

export const updateCardTitle = (
  board: Board,
  columnId: string,
  cardId: string,
  newTitle: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const column = board.columns.find((col) => col.id === columnId);
  const card = column?.cards.find((c) => c.id === cardId);
  if (column && card && card.title !== newTitle) {
    logActivity(
      board.id,
      ActivityType.CARD_UPDATED,
      `đã đổi tên thẻ từ "${card.title}" thành "${newTitle}" trong cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, title: newTitle } : card
            ),
          }
        : col
    ),
  };
};

export const updateCard = (
  board: Board,
  columnId: string,
  cardId: string,
  updatedCard: any,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  const column = board.columns.find((col) => col.id === columnId);
  const card = column?.cards.find((c) => c.id === cardId);
  if (column && card) {
    logActivity(
      board.id,
      ActivityType.CARD_UPDATED,
      `đã cập nhật thẻ "${card.title}" trong cột "${column.title}"`
    );
  }

  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, ...updatedCard } : card
            ),
          }
        : col
    ),
  };
};

export const toggleBoardStar = (board: Board, starred: boolean) => {
  return {
    ...board,
    starred,
  };
};

export const updateBoardTitle = (
  board: Board,
  title: string,
  logActivity: (
    boardId: string,
    type: ActivityType,
    description: string
  ) => void
) => {
  if (board.title !== title.trim()) {
    logActivity(
      board.id,
      ActivityType.BOARD_UPDATED,
      `đã đổi tên bảng từ "${board.title}" thành "${title.trim()}"`
    );
  }

  return {
    ...board,
    title: title.trim(),
  };
};
