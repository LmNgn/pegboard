import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Board } from "../types/board";

export interface BoardState {
  boards: Board[];
}
export const initialState: BoardState = {
  boards: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getBoards(state, action: PayloadAction<Board[]>) {
      state.boards = action.payload;
    },
    addBoard(state, action: PayloadAction<Board>) {
      state.boards.push(action.payload);
    },
    updateBoard(state, action: PayloadAction<Board>) {
      state.boards = state.boards.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    },
    removeBoards(state, action: PayloadAction<Board>) {
      state.boards = state.boards.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    },
  },
});

export const { getBoards, addBoard, updateBoard, removeBoards } =
  boardSlice.actions;
export default boardSlice.reducer;
