import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Card } from "../../../../types/card";
interface CardItemProps {
  card: Card;
  columnId: string;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
}

const CardItem = ({ card, columnId, onDelete, onUpdate }: CardItemProps) => {
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
    data: { type: "card", columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded p-3 shadow hover:shadow-md group"
    >
      {isEditing ? (
        <Input.TextArea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleSave}
          onBlur={handleSave}
          autoFocus
          autoSize
        />
      ) : (
        <div className="flex items-start justify-between gap-2">
          <div {...attributes} {...listeners} className="flex-1 cursor-grab">
            {card.title}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            />
            <Popconfirm
              title="Xóa thẻ?"
              onConfirm={onDelete}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardItem;
