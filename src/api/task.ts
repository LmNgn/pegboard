import api from ".";
import type { Column } from "../types/column";

export const getTasks = async () => {
  const data = await api.get(`/tasks`);
  return data;
};

export const getTask = async (id: number) => {
  const data = await api.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (body: Column) => {
  const data = await api.post(`/tasks`, body);
  return data;
};

export const updateTask = async (id: number, body: Column) => {
  const data = await api.patch(`/tasks/${id}`, body);
  return data;
};

export const deleteTask = async (id: number) => {
  const data = await api.delete(`/tasks/${id}`);
  return data;
};
