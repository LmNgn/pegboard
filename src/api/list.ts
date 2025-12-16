import api from ".";
import type { Board } from "../types/board";

export const getLists = async () => {
  const data = await api.get(`/lists`);
  return data;
};

export const getList = async (id: number) => {
  const data = await api.get(`/lists/${id}`);
  return data;
};

export const createList = async (body: Board) => {
  const data = await api.post(`/lists`, body);
  return data;
};

export const updateList = async (id: number, body: Board) => {
  const data = await api.patch(`/lists/${id}`, body);
  return data;
};

export const deleteList = async (id: number) => {
  const data = await api.delete(`/lists/${id}`);
  return data;
};
