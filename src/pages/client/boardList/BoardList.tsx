import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../../../api/board";
import type { Board } from "../../../types/board";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Skeleton } from "antd";
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { CreateBoardModal } from "../../../components/common/BoardModal";
import { useState } from "react";

const BoardList = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const navigate = useNavigate();

  const { data: boards, isLoading } = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
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
            {[1, 2].map((section) => (
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

  const staredBoards = boards?.filter((b) => b.stared);
  const normalBoards = boards?.filter((b) => !b.stared);

  const BoardCard = (board: Board) => (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
              {board.title.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
              {board.title}
            </h3>
          </div>

          {board.stared ? (
            <StarFilled className="text-yellow-500 text-xl shrink-0" />
          ) : (
            <StarOutlined className="text-gray-300 text-xl shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {board.description || "No description available"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <AppstoreOutlined />
            Board
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 font-medium">
            Open →
          </span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-br from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  );

  const CreateBoardCard = () => (
    <div
      onClick={() => setShowCreateBoardModal(true)}
      className="groupbg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 flex flex-col items-center justify-center min-h-[180px]"
    >
      <div className="w-16 h-16 rounded-full bg-blue-500 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors shadow-lg group-hover:scale-110 transform duration-300">
        <PlusOutlined className="text-white text-2xl" />
      </div>
      <h3 className="font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
        Tạo bảng mới
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Starred Boards Section */}
        {staredBoards && staredBoards.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <StarFilled className="text-yellow-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                Starred Boards
              </h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {staredBoards.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {staredBoards.map((board) => (
                <BoardCard key={board.id} {...board} />
              ))}
            </div>
          </section>
        )}

        {/* Your Boards Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <AppstoreOutlined className="text-blue-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Bảng của bạn</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {normalBoards?.length || 0}
            </span>
          </div>

          {normalBoards && normalBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <CreateBoardCard />
              {normalBoards.map((board) => (
                <BoardCard key={board.id} {...board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <p className="text-gray-600 mb-4">Danh sách trống</p>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/boards/create")}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Hãy tạo bảng mới
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </section>
      </div>
      {/* tạo modal */}
      <CreateBoardModal
        open={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
      />
    </div>
  );
};

export default BoardList;
