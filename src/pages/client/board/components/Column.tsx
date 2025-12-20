import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Dropdown } from "antd";
import { PlusOutlined, MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { Column } from "../../../../types/column";
import CardItem from "./Card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColumnItemProps {
  column: Column;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
  onAddCard: (title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, newTitle: string) => void;
  onCardClick: (card: any) => void;
}

const ColumnItem = ({
  column,
  onDelete,
  onUpdate,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  onCardClick,
}: ColumnItemProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdateTitle = () => {
    if (title.trim() && title !== column.title) {
      onUpdate(title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const menuItems = [
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Xóa cột",
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <div ref={setNodeRef} style={style} className="shrink-0 w-72">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex flex-col max-h-full">
        {/* Column Header */}
        <div
          className="p-3 border-b border-gray-200 flex items-center justify-between"
          {...attributes}
          {...listeners}
        >
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={handleUpdateTitle}
              onBlur={handleUpdateTitle}
              autoFocus
              className="flex-1 mr-2"
            />
          ) : (
            <h3
              className="font-semibold text-gray-800 flex-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </h3>
          )}

          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              className="no-drag-scroll"
            />
          </Dropdown>
        </div>

        {/* Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-drag-scroll">
          <SortableContext
            items={column.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                columnId={column.id}
                onDelete={() => onDeleteCard(card.id)}
                onUpdate={(newTitle) => onUpdateCard(card.id, newTitle)}
                onClick={() => onCardClick(card)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Card Button */}
        <div className="p-3 border-t border-gray-200">
          {isAddingCard ? (
            <div>
              <Input
                placeholder="Nhập tên thẻ..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onPressEnter={handleAddCard}
                autoFocus
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button type="primary" size="small" onClick={handleAddCard}>
                  Thêm thẻ
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle("");
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsAddingCard(true)}
              className="w-full"
              size="small"
            >
              Thêm thẻ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnItem;
