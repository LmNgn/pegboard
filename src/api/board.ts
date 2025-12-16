import api from ".";
import type { Board } from "../types/board";

export const getBoards = async () => {
  const { data } = await api.get<Board[]>(`/boards`);
  return data;
};

export const getBoard = async (id: number) => {
  const { data } = await api.get(`/boards/${id}`);
  return data;
};

export const createBoard = async (body: Board) => {
  const { data } = await api.post(`/boards`, body);
  return data;
};

export const updateBoard = async (id: number, body: Board) => {
  const { data } = await api.patch(`/boards/${id}`, body);
  return data;
};

export const deleteBoard = async (id: number) => {
  const { data } = await api.delete(`/boards/${id}`);
  return data;
};
