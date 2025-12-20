import api from ".";
import type { Activity } from "../types/activity";
export const getActivities = async (boardId: string) => {
  const { data } = await api.get<Activity[]>(
    `/activities?boardId=${boardId}&_sort=timestamp&_order=desc`
  );
  return data;
};

export const createActivity = async (activity: Omit<Activity, "id">) => {
  const { data } = await api.post<Activity>("/activities", {
    ...activity,
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });
  return data;
};
