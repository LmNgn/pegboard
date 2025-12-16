import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Input, Modal, Select, message } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ColumnItem from "./components/Column";
import type { Column } from "../../../types/column";
import type { Card } from "../../../types/card";

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  // Fetch board hiện tại
  const { data: board } = useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/boards/${id}`);
      setBoardTitle(data.title);
      return data;
    },
  });

  // Fetch tất cả boards để chuyển đổi
  const { data: allBoards } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/boards`);
      return data;
    },
  });

  const updateBoard = useMutation({
    mutationFn: async (newBoard: any) => {
      await axios.put(`http://localhost:3000/boards/${id}`, newBoard);
    },
    onSuccess: () => {
      message.success("Cập nhật bảng thành công");
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:3000/boards/${id}`);
    },
    onSuccess: () => {
      message.success("Xóa bảng thành công");
      navigate("/");
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (active.data.current?.type === "column") {
      const oldIndex = board.columns.findIndex(
        (c: Column) => c.id === active.id
      );
      const newIndex = board.columns.findIndex((c: Column) => c.id === over.id);

      const newColumns = arrayMove(board.columns, oldIndex, newIndex);
      const newBoard = { ...board, columns: newColumns };

      queryClient.setQueryData(["board", id], newBoard);
      updateBoard.mutate(newBoard);
    }

    if (active.data.current?.type === "card") {
      const activeColumnId = active.data.current.columnId;
      const overColumnId = over.data.current?.columnId || over.id;

      const newColumns = board.columns.map((col: Column) => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            cards: col.cards.filter((c: Card) => c.id !== active.id),
          };
        }
        if (col.id === overColumnId) {
          const newCard = board.columns
            .find((c: Column) => c.id === activeColumnId)
            ?.cards.find((c: Card) => c.id === active.id);

          if (newCard) {
            return {
              ...col,
              cards: [...col.cards, { ...newCard, columnId: col.id }],
            };
          }
        }
        return col;
      });

      const newBoard = { ...board, columns: newColumns };
      queryClient.setQueryData(["board", id], newBoard);
      updateBoard.mutate(newBoard);
    }
  };

  const handleUpdateBoardTitle = () => {
    const newBoard = { ...board, title: boardTitle };
    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = () => {
    Modal.confirm({
      title: "Xóa bảng?",
      content:
        "Hành động này không thể hoàn tác. Tất cả các cột và thẻ sẽ bị xóa.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteBoard.mutate(),
    });
  };

  const handleSwitchBoard = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: "New Column",
      cards: [],
    };

    const newBoard = {
      ...board,
      columns: [...board.columns, newColumn],
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const handleDeleteColumn = (columnId: string) => {
    const newBoard = {
      ...board,
      columns: board.columns.filter((c: Column) => c.id !== columnId),
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const handleUpdateColumn = (columnId: string, newTitle: string) => {
    const newBoard = {
      ...board,
      columns: board.columns.map((c: Column) =>
        c.id === columnId ? { ...c, title: newTitle } : c
      ),
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const handleAddCard = (columnId: string) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      columnId,
    };

    const newBoard = {
      ...board,
      columns: board.columns.map((c: Column) =>
        c.id === columnId ? { ...c, cards: [...c.cards, newCard] } : c
      ),
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    const newBoard = {
      ...board,
      columns: board.columns.map((c: Column) =>
        c.id === columnId
          ? { ...c, cards: c.cards.filter((card: Card) => card.id !== cardId) }
          : c
      ),
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const handleUpdateCard = (
    columnId: string,
    cardId: string,
    newTitle: string
  ) => {
    const newBoard = {
      ...board,
      columns: board.columns.map((c: Column) =>
        c.id === columnId
          ? {
              ...c,
              cards: c.cards.map((card: Card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : c
      ),
    };

    queryClient.setQueryData(["board", id], newBoard);
    updateBoard.mutate(newBoard);
  };

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Đổi tên bảng",
      onClick: () => setIsEditingTitle(true),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Xóa bảng",
      danger: true,
      onClick: handleDeleteBoard,
    },
  ];

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-400">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-blue-400">
      {/* Header */}
      <div className="shrink-0 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 border-0"
            ></Button>

            {isEditingTitle ? (
              <Input
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onPressEnter={handleUpdateBoardTitle}
                onBlur={handleUpdateBoardTitle}
                autoFocus
                className="max-w-xs"
              />
            ) : (
              <h1
                className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:bg-white/10 px-3 py-1 rounded transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {board.title}
              </h1>
            )}
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button
                type="text"
                icon={<MoreOutlined />}
                className="text-white hover:bg-white/10 border-0"
              />
            </Dropdown>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Select
              value={id}
              onChange={handleSwitchBoard}
              className="w-40 sm:w-48"
              placeholder="Switch board"
              suffixIcon={<AppstoreOutlined className="text-white" />}
              popupMatchSelectWidth={false}
            >
              {allBoards?.map((b: any) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.title}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-hidden">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="h-full overflow-x-auto overflow-y-hidden p-4">
            <div className="flex gap-4 h-full pb-4">
              <SortableContext
                items={board.columns.map((c: Column) => c.id)}
                strategy={horizontalListSortingStrategy}
              >
                {board.columns.map((column: Column) => (
                  <ColumnItem
                    key={column.id}
                    column={column}
                    onDelete={() => handleDeleteColumn(column.id)}
                    onUpdate={(newTitle) =>
                      handleUpdateColumn(column.id, newTitle)
                    }
                    onAddCard={() => handleAddCard(column.id)}
                    onDeleteCard={(cardId) =>
                      handleDeleteCard(column.id, cardId)
                    }
                    onUpdateCard={(cardId, newTitle) =>
                      handleUpdateCard(column.id, cardId, newTitle)
                    }
                  />
                ))}
              </SortableContext>

              <div className="shrink-0">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddColumn}
                  className="h-fit bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
                  size="large"
                >
                  Add Column
                </Button>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;
