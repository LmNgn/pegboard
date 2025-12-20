import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Input, Dropdown, Button, Tag, Avatar } from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { Card as CardType } from "../../../../types/column";
import dayjs from "dayjs";

interface CardItemProps {
  card: CardType;
  columnId: string;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
  onClick: () => void;
}

const CardItem = ({
  card,
  columnId,
  onDelete,
  onUpdate,
  onClick,
}: CardItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdate = () => {
    if (title.trim() && title !== card.title) {
      onUpdate(title);
    }
    setIsEditing(false);
  };

  const menuItems = [
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Xóa thẻ",
      danger: true,
      onClick: onDelete,
    },
  ];

  const isOverdue = card.deadline && dayjs(card.deadline).isBefore(dayjs());

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        title={card.title}
        size="small"
        className="cursor-move hover:shadow-md transition-shadow bg-white"
        onClick={() => {
          if (!isEditing) {
            onClick();
          }
        }}
        extra={
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        }
      >
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleUpdate}
            onBlur={handleUpdate}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div>
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="cursor-pointer mb-2"
            >
              {card.description ?? "Chưa có mô tả"}
            </div>

            {/* Card metadata preview */}
            <div className="flex flex-col gap-2 text-xs">
              {card.tags && card.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <TagOutlined className="text-gray-400" />
                  {card.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} color="blue" className="text-xs m-0">
                      {tag}
                    </Tag>
                  ))}
                  {card.tags.length > 2 && (
                    <span className="text-gray-400">
                      +{card.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {card.deadline && (
                <div
                  className={`flex items-center gap-1 ${
                    isOverdue ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <ClockCircleOutlined />
                  <span>{dayjs(card.deadline).format("DD/MM/YYYY")}</span>
                </div>
              )}

              {card.assignees && card.assignees.length > 0 && (
                <div className="flex items-center gap-1">
                  <UserOutlined className="text-gray-400" />
                  <Avatar.Group maxCount={3} size="small">
                    {card.assignees.map((assignee) => (
                      <Avatar
                        key={assignee}
                        size="small"
                        className="bg-blue-500"
                      >
                        {assignee.charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CardItem;
