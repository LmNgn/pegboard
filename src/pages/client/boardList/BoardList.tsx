import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Skeleton } from "antd";
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Star } from "lucide-react";
import { useState } from "react";
import type { Board } from "../../../types/board";
import {
  getStarredBoardsApi,
  getMyBoardsApi,
  getGuestBoardsApi,
} from "../../../api/board";
import api from "../../../api";
import { CreateBoardModal } from "../../../components/common/BoardModal";
import CreateBoardCard from "./components/CreateBoardCard";

// Hook để lấy thông tin user hiện tại
const useCurrentUser = () => {
  // Giả sử bạn lưu user trong localStorage hoặc context
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const BoardList = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const { data: starredBoards = [], isLoading: isLoadingStarred } = useQuery<
    Board[]
  >({
    queryKey: ["boards", "starred"],
    queryFn: () => getStarredBoardsApi(),
  });

  const { data: myBoards = [], isLoading: isLoadingMyBoards } = useQuery<
    Board[]
  >({
    queryKey: ["boards", "my", currentUser?.id],
    queryFn: () => getMyBoardsApi(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  const { data: guestBoards = [], isLoading: isLoadingGuestBoards } = useQuery<
    Board[]
  >({
    queryKey: ["boards", "guest", currentUser?.email],
    queryFn: () => getGuestBoardsApi(currentUser?.email),
    enabled: !!currentUser?.email,
  });

  const isLoading =
    isLoadingStarred || isLoadingMyBoards || isLoadingGuestBoards;

  const updateBoard = async (
    id: number,
    data: Partial<Board>
  ): Promise<Board> => {
    const res = await api.patch(`/boards/${id}`, data);
    return res.data;
  };

  const toggleStarMutation = useMutation({
    mutationFn: ({ id, starred }: { id: string | number; starred: boolean }) =>
      updateBoard(Number(id), { starred }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <Skeleton.Input active size="large" className="mb-2" />
            <Skeleton.Input active size="small" style={{ width: 300 }} />
          </div>

          {/* Boards Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3].map((section) => (
              <div key={section}>
                <Skeleton.Input
                  active
                  className="mb-4"
                  style={{ width: 200 }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const BoardCard = ({ board }: { board: Board }) => (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
              {board.title.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-gray-800 line-clamp-1">
              {board.title}
            </h3>
          </div>

          {/* Starred */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleStarMutation.mutate({
                id: board.id,
                starred: !board.starred,
              });
            }}
          >
            {board.starred ? (
              <StarFilled
                style={{ color: "#facc15", fontSize: 20 }}
                className="opacity-100"
              />
            ) : (
              <StarOutlined className="text-gray-300 text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Hiển thị số thành viên nếu có */}
        {board.members && board.members.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <TeamOutlined />
            <span>{board.members.length} thành viên</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bảng ưu tiên  */}
        {starredBoards.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-xl text-yellow-500" fill="#facc15" />
              <h2 className="text-2xl font-bold text-gray-800">Bảng ưu tiên</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {starredBoards.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {starredBoards.map((board) => (
                <BoardCard key={`starred-${board.id}`} board={board} />
              ))}
            </div>
          </section>
        )}

        {/* Bảng của tôi  */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <AppstoreOutlined className="text-blue-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Bảng của tôi</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {myBoards.length}
            </span>
          </div>

          {myBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <CreateBoardCard onClick={() => setShowCreateBoardModal(true)} />
              {myBoards.map((board) => (
                <BoardCard key={`my-${board.id}`} board={board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <p className="text-gray-600 mb-4">
                      Bạn chưa có bảng nào. Hãy tạo bảng đầu tiên!
                    </p>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => setShowCreateBoardModal(true)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Tạo bảng mới
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </section>

        {/* Bảng khách */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TeamOutlined className="text-green-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Bảng khách</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {guestBoards.length}
            </span>
          </div>

          {guestBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {guestBoards.map((board) => (
                <BoardCard key={`guest-${board.id}`} board={board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <p className="text-gray-500">
                    Bạn chưa được mời vào bảng nào
                  </p>
                }
              />
            </div>
          )}
        </section>
      </div>

      {/* Modal tạo bảng */}
      <CreateBoardModal
        open={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
      />
    </div>
  );
};

export default BoardList;
