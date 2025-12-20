import { Drawer, Timeline, Tag, Empty, Spin } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../../../../api/activity";
import { ActivityType, type Activity } from "../../../../types/activity";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface HistorySidebarProps {
  visible: boolean;
  boardId: string;
  onClose: () => void;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.BOARD_CREATED:
    case ActivityType.COLUMN_CREATED:
    case ActivityType.CARD_CREATED:
    case ActivityType.MEMBER_ADDED:
      return <PlusOutlined style={{ color: "#52c41a" }} />;
    case ActivityType.BOARD_UPDATED:
    case ActivityType.COLUMN_UPDATED:
    case ActivityType.CARD_UPDATED:
    case ActivityType.MEMBER_ROLE_CHANGED:
      return <EditOutlined style={{ color: "#1890ff" }} />;
    case ActivityType.BOARD_DELETED:
    case ActivityType.COLUMN_DELETED:
    case ActivityType.CARD_DELETED:
    case ActivityType.MEMBER_REMOVED:
      return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
    case ActivityType.COLUMN_MOVED:
    case ActivityType.CARD_MOVED:
      return <DragOutlined style={{ color: "#722ed1" }} />;
    default:
      return <EditOutlined />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case ActivityType.BOARD_CREATED:
    case ActivityType.COLUMN_CREATED:
    case ActivityType.CARD_CREATED:
    case ActivityType.MEMBER_ADDED:
      return "success";
    case ActivityType.BOARD_UPDATED:
    case ActivityType.COLUMN_UPDATED:
    case ActivityType.CARD_UPDATED:
    case ActivityType.MEMBER_ROLE_CHANGED:
      return "processing";
    case ActivityType.BOARD_DELETED:
    case ActivityType.COLUMN_DELETED:
    case ActivityType.CARD_DELETED:
    case ActivityType.MEMBER_REMOVED:
      return "error";
    case ActivityType.COLUMN_MOVED:
    case ActivityType.CARD_MOVED:
      return "purple";
    default:
      return "default";
  }
};

const HistorySidebar = ({ visible, boardId, onClose }: HistorySidebarProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", boardId],
    queryFn: () => getActivities(boardId),
    enabled: visible && !!boardId,
  });

  return (
    <Drawer
      title="Lịch sử hoạt động"
      placement="right"
      size={400}
      onClose={onClose}
      open={visible}
      styles={{
        body: { padding: "16px" },
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : !activities || activities.length === 0 ? (
        <Empty description="Chưa có hoạt động nào" />
      ) : (
        <Timeline
          items={activities.map((activity: Activity) => ({
            dot: getActivityIcon(activity.type),
            children: (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {activity.userName}
                  </span>
                  <Tag
                    color={getActivityColor(activity.type)}
                    className="text-xs"
                  >
                    {activity.type.replace(/_/g, " ")}
                  </Tag>
                </div>
                <p className="text-gray-700 text-sm mb-1">
                  {activity.description}
                </p>
                <span className="text-gray-400 text-xs">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
            ),
          }))}
        />
      )}
    </Drawer>
  );
};

export default HistorySidebar;
