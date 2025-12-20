import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ScrollContainer from "react-indiana-drag-scroll";

import ColumnItem from "./components/Column";
import CardDetailModal from "./components/CardDetailModal";
import BoardHeader from "./components/BoardHeader";
import ShareBoardModal from "./components/ShareBoardModal";
import HistorySidebar from "./components/HistorySidebar";
import {
  useBoard,
  useBoards,
  useBoardMutations,
} from "../../../hooks/useBoard";
import {
  handleColumnDragEnd,
  handleCardDragEnd,
} from "../../../utils/dragDrop";
import {
  createNewColumn,
  deleteColumn,
  updateColumnTitle,
  addCard,
  deleteCard,
  updateCardTitle,
  updateCard,
  toggleBoardStar,
  updateBoardTitle as updateBoardTitleUtil,
} from "../../../utils/boardOperate";
import type { Column } from "../../../types/column";
import type { Card } from "../../../types/column";
import { Role, type BoardMember } from "../../../types/board";
import { searchUsers } from "../../../api/board";
import { useActivityLogger } from "../../../utils/logActivity";
import { ActivityType } from "../../../types/activity";
import type { User } from "../../../types/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

const Board = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logActivity = useActivityLogger();
  const { user } = useSelector((state: RootState) => state.user);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [isStarred, setIsStarred] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterByColumn, setFilterByColumn] = useState<string[]>([]);
  const [filterByTags, setFilterByTags] = useState<string[]>([]);

  const [selectedCard, setSelectedCard] = useState<{
    card: Card;
    columnId: string;
  } | null>(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const { data: board, isLoading, error } = useBoard(id);
  const { data: allBoards } = useBoards();

  const { updateBoard, deleteBoard } = useBoardMutations(id);
  const currentMember = board?.members?.find(
    (m: User) => m.email === user?.email
  );
  const currentUserRole = currentMember?.role ?? Role.VIEWER;
  // Sensors cho dnd
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    if (board) {
      setBoardTitle(board.title);
      setIsStarred(!!board.starred);
    }
  }, [board]);

  const getFilteredBoard = () => {
    if (!board) return null;

    let filteredColumns = [...board.columns];

    // lọc theo tên
    if (filterByColumn.length > 0) {
      filteredColumns = filteredColumns.filter((col: Column) =>
        filterByColumn.includes(col.id)
      );
    }

    // lọc theo tag
    if (filterByTags.length > 0) {
      filteredColumns = filteredColumns
        .map((col: Column) => {
          const filteredCards = col.cards.filter((card: Card) =>
            card.tags?.some((tag) => filterByTags.includes(tag))
          );
          if (filteredCards.length > 0) {
            return {
              ...col,
              cards: filteredCards,
            };
          }
          return null;
        })
        .filter((col): col is Column => col !== null);
    }

    // lọc theo từ khóa
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filteredColumns = filteredColumns
        .map((col: Column) => {
          const columnMatches = col.title.toLowerCase().includes(keyword);
          const filteredCards = col.cards.filter((card: Card) =>
            card.title.toLowerCase().includes(keyword)
          );

          if (columnMatches || filteredCards.length > 0) {
            return {
              ...col,
              cards: columnMatches ? col.cards : filteredCards,
            };
          }
          return null;
        })
        .filter((col): col is Column => col !== null);
    }

    return {
      ...board,
      columns: filteredColumns,
    };
  };

  const filteredBoard = getFilteredBoard();

  // Dnd handler
  const handleDragEnd = (event: DragEndEvent) => {
    if (!board) return;

    const { active } = event;
    let newBoard = null;

    if (active.data.current?.type === "column") {
      newBoard = handleColumnDragEnd(event, board, logActivity);
    } else if (active.data.current?.type === "card") {
      newBoard = handleCardDragEnd(event, board, logActivity);
    }

    if (newBoard) {
      updateBoard.mutate(newBoard);
    }
  };

  // cập nhật title bảng
  const handleUpdateBoardTitle = () => {
    if (!board || !boardTitle.trim()) return;

    const newBoard = updateBoardTitleUtil(board, boardTitle, logActivity);
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
      onOk: () => {
        deleteBoard.mutate(undefined, {
          onSuccess: () => navigate("/boards"),
        });
      },
    });
  };

  const handleToggleStar = () => {
    if (!board) return;

    const newStarred = !isStarred;
    setIsStarred(newStarred);

    const newBoard = toggleBoardStar(board, newStarred);
    updateBoard.mutate(newBoard);
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setFilterByColumn([]);
    setFilterByTags([]);
  };

  // Column handler
  const handleAddColumn = (title: string) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const result = createNewColumn(board, title, logActivity);

    if (!result.isValid) {
      message.warning(result.error);
      return;
    }

    if (result.board) {
      updateBoard.mutate(result.board);
      setNewColumnTitle("");
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = deleteColumn(board, columnId, logActivity);
    updateBoard.mutate(newBoard);
  };

  const handleUpdateColumn = (columnId: string, newTitle: string) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = updateColumnTitle(board, columnId, newTitle, logActivity);
    updateBoard.mutate(newBoard);
  };

  // Card handler
  const handleAddCard = (columnId: string, data: string) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = addCard(board, columnId, data, logActivity);
    updateBoard.mutate(newBoard);
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = deleteCard(board, columnId, cardId, logActivity);
    updateBoard.mutate(newBoard);
  };

  const handleUpdateCard = (
    columnId: string,
    cardId: string,
    newTitle: string
  ) => {
    if (!board) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = updateCardTitle(
      board,
      columnId,
      cardId,
      newTitle,
      logActivity
    );
    updateBoard.mutate(newBoard);
  };

  // Handler for updating full card details
  const handleUpdateCardDetails = (updatedCard: Card) => {
    if (!board || !selectedCard) return;

    if (currentUserRole === Role.VIEWER) {
      message.warning("Bạn chỉ có quyền xem");
      return;
    }

    const newBoard = updateCard(
      board,
      selectedCard.columnId,
      updatedCard.id,
      updatedCard,
      logActivity
    );
    updateBoard.mutate(newBoard);
  };

  // đổi bảng
  const handleSwitchBoard = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  // thêm thành viên
  const handleAddMember = (member: Omit<BoardMember, "id" | "addedAt">) => {
    if (!board) return;

    const newMember: BoardMember = {
      ...member,
      id: `member-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };

    const newBoard = {
      ...board,
      members: [...(board.members || []), newMember],
    };

    logActivity(
      board.id,
      ActivityType.MEMBER_ADDED,
      `đã thêm ${member.email} vào bảng`
    );

    updateBoard.mutate(newBoard);
  };

  const handleUpdateMemberRole = (memberId: string, role: Role) => {
    if (!board) return;

    const member = board.members?.find((m: User) => m.id === memberId);

    const newBoard = {
      ...board,
      members: board.members?.map((m: User) =>
        m.id === memberId ? { ...m, role } : m
      ),
    };

    if (member) {
      logActivity(
        board.id,
        ActivityType.MEMBER_ROLE_CHANGED,
        `đã thay đổi vai trò của ${member.email} thành ${role}`
      );
    }

    updateBoard.mutate(newBoard);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!board) return;

    const member = board.members?.find((m: User) => m.id === memberId);

    const newBoard = {
      ...board,
      members: board.members?.filter((m: User) => m.id !== memberId),
    };

    if (member) {
      logActivity(
        board.id,
        ActivityType.MEMBER_REMOVED,
        `đã xóa ${member.email} khỏi bảng`
      );
    }

    updateBoard.mutate(newBoard);
  };

  const handleSearchUsers = async (email: string) => {
    return await searchUsers(email);
  };

  const handleCardClick = (card: Card, columnId: string) => {
    setSelectedCard({ card, columnId });
    setIsCardModalVisible(true);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-400">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-400">
        <div className="text-white text-xl">
          Lỗi tải dữ liệu. Vui lòng thử lại.
        </div>
      </div>
    );
  }

  // No board found
  if (!board || !filteredBoard) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-400">
        <div className="text-white text-xl">Không tìm thấy bảng</div>
      </div>
    );
  }
  const boardMembers = board.members;

  console.log(currentMember);
  return (
    <div className="h-screen flex flex-col bg-blue-400">
      {/* Header */}
      <BoardHeader
        board={board}
        boardTitle={boardTitle}
        isEditingTitle={isEditingTitle}
        isStarred={isStarred}
        allBoards={allBoards}
        searchText={searchKeyword}
        selectedColumns={filterByColumn}
        selectedTags={filterByTags}
        currentUserRole={currentUserRole}
        onBoardTitleChange={setBoardTitle}
        onUpdateBoardTitle={handleUpdateBoardTitle}
        onToggleTitleEdit={setIsEditingTitle}
        onToggleStar={handleToggleStar}
        onSwitchBoard={handleSwitchBoard}
        onDeleteBoard={handleDeleteBoard}
        onSearchChange={setSearchKeyword}
        onColumnToggle={(columnId) => {
          if (filterByColumn.includes(columnId)) {
            setFilterByColumn(filterByColumn.filter((id) => id !== columnId));
          } else {
            setFilterByColumn([...filterByColumn, columnId]);
          }
        }}
        onTagToggle={(tag) => {
          if (filterByTags.includes(tag)) {
            setFilterByTags(filterByTags.filter((t) => t !== tag));
          } else {
            setFilterByTags([...filterByTags, tag]);
          }
        }}
        onClearFilters={handleClearFilters}
        onOpenShareModal={() => setIsShareModalVisible(true)}
        onOpenHistory={() => setIsHistoryVisible(true)}
      />

      {/* Board Content */}
      <div className="flex-1 overflow-hidden">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="h-full overflow-x-auto hide-scrollbar">
            <ScrollContainer
              className="h-full overflow-y-auto"
              horizontal
              vertical={false}
              activationDistance={10}
              ignoreElements=".no-drag-scroll"
            >
              <div className="p-4">
                <div className="flex gap-4 items-start min-h-full pb-6">
                  <SortableContext
                    items={filteredBoard.columns.map((c: Column) => c.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {filteredBoard.columns.map((column: Column) => (
                      <ColumnItem
                        key={column.id}
                        column={column}
                        onDelete={() => handleDeleteColumn(column.id)}
                        onUpdate={(newTitle) =>
                          handleUpdateColumn(column.id, newTitle)
                        }
                        onAddCard={(title) => handleAddCard(column.id, title)}
                        onDeleteCard={(cardId) =>
                          handleDeleteCard(column.id, cardId)
                        }
                        onUpdateCard={(cardId, newTitle) =>
                          handleUpdateCard(column.id, cardId, newTitle)
                        }
                        onCardClick={(card) => handleCardClick(card, column.id)}
                      />
                    ))}
                  </SortableContext>
                  {/* Add column */}
                  {currentUserRole !== Role.VIEWER && (
                    <div className="shrink-0 w-72">
                      {isAddingColumn ? (
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow">
                          <Input
                            placeholder="Nhập tên cột..."
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            onPressEnter={() => handleAddColumn(newColumnTitle)}
                            autoFocus
                            className="mb-2"
                          />

                          <div className="flex gap-2 mt-2">
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleAddColumn(newColumnTitle)}
                            >
                              Thêm bảng
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsAddingColumn(false);
                                setNewColumnTitle("");
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
                          onClick={() => setIsAddingColumn(true)}
                          className="h-fit bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 w-full"
                          size="large"
                        >
                          Thêm bảng
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollContainer>
          </div>
        </DndContext>
      </div>

      {/* Share Modal */}
      <ShareBoardModal
        visible={isShareModalVisible}
        boardId={board.id}
        members={board.members || []}
        currentUserRole={currentUserRole}
        onClose={() => setIsShareModalVisible(false)}
        onAddMember={handleAddMember}
        onUpdateMemberRole={handleUpdateMemberRole}
        onRemoveMember={handleRemoveMember}
        onSearchUsers={handleSearchUsers}
      />

      {/* Chi tiết card Modal */}
      <CardDetailModal
        visible={isCardModalVisible}
        card={selectedCard?.card || null}
        members={boardMembers}
        currentUserRole={currentUserRole} // Pass currentUserRole
        onClose={() => {
          setIsCardModalVisible(false);
          setSelectedCard(null);
        }}
        onUpdate={handleUpdateCardDetails}
      />

      <HistorySidebar
        visible={isHistoryVisible}
        boardId={board?.id || ""}
        onClose={() => setIsHistoryVisible(false)}
      />
    </div>
  );
};

export default Board;
