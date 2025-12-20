import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { boardSchema } from "../../schema/boardSchema";
import renderError from "../../utils/renderError";
import handleAuthForm from "../../utils/handleAuthForm";
import { createBoard } from "../../api/board";
import { addBoard } from "../../features/boardSlices";
import toast from "react-hot-toast";
import { Role, type Board } from "../../types/board";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";

export function CreateBoardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset } = handleAuthForm(
    boardSchema,
    "Tạo bảng"
  );
  const { user } = useSelector((state: RootState) => state.user);

  const nav = useNavigate();
  // tạo wrapper cho onSubmit để thêm Redux
  const handleCreateBoard = async (data: Board) => {
    if (!user || typeof user.id !== "number") throw new Error("Chưa đăng nhập");

    try {
      const newBoard = {
        ...data,
        starred: false,
        ownerId: user.id,
        columns: [],
        members: [
          {
            id: `member-${Date.now()}`,
            email: user?.email || "",
            name: user?.username || "",
            role: Role.OWNER,
            addedAt: new Date().toISOString(),
          },
        ],
      };
      const res = await createBoard(newBoard);

      dispatch(addBoard(res.data));
      nav(0);
      toast.success("Tạo bảng thành công");
      reset();
      onClose();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo bảng");
    }
  };
  return (
    <Modal
      title="Tạo bảng mới"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <form
        onSubmit={handleSubmit(handleCreateBoard)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <input
            {...register("title")}
            placeholder="Tên bảng"
            className="border border-gray-300  p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {renderError(errors, "title")}
        </div>

        <div className="flex flex-col">
          <textarea
            {...register("description")}
            placeholder="Mô tả"
            rows={3}
            className="border border-gray-300  p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {renderError(errors, "description")}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded"
        >
          Tạo
        </button>
      </form>
    </Modal>
  );
}
