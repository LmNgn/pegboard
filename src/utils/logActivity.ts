import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { createActivity } from "../api/activity";
import type { ActivityType, Activity } from "../types/activity";

export const useActivityLogger = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const logActivity = async (
    boardId: string,
    type: ActivityType,
    description: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    const activity: Omit<Activity, "id"> = {
      boardId,
      type,
      userId: user.id,
      userName: user.username,
      userEmail: user.email,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };

    try {
      await createActivity(activity);
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  return logActivity;
};
