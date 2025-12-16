import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Input, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { Column } from "../../../../types/column";
import CardItem from "./Card";

interface ColumnItemProps {
  column: Column;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
  onAddCard: () => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, newTitle: string) => void;
}

const ColumnItem = ({
  column,
  onDelete,
  onUpdate,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
}: ColumnItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "column" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate(title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-white/90 backdrop-blur-sm
    rounded-lg p-3 w-72 shrink-0
    flex flex-col shadow-lg
    max-h-full
  "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleSave}
            onBlur={handleSave}
            autoFocus
            className="flex-1"
          />
        ) : (
          <h3
            {...attributes}
            {...listeners}
            className="font-bold cursor-grab flex-1 text-gray-800"
          >
            {column.title}
          </h3>
        )}

        <div className="flex gap-1 ml-2">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
            className="hover:bg-gray-200"
          />
          <Popconfirm
            title="Xóa cột?"
            description="Toàn bộ thẻ sẽ bị xóa"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden mb-2">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 pb-2">
            {column.cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                columnId={column.id}
                onDelete={() => onDeleteCard(card.id)}
                onUpdate={(newTitle) => onUpdateCard(card.id, newTitle)}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Add Button - Fixed */}
      <div className="shrink-0">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={onAddCard}
          className="w-full hover:bg-gray-100 hover:border-gray-400"
          size="small"
        >
          Add Card
        </Button>
      </div>
    </div>
  );
};

export default ColumnItem;
