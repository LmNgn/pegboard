import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { boardSchema } from "../../schema/boardSchema";
import renderError from "../../utils/renderError";
import handleAuthForm from "../../utils/handleAuthForm";
import { createBoard } from "../../api/board";
import { addBoard } from "../../features/boardSlices";
import toast from "react-hot-toast";
import type { Board } from "../../types/board";

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
  // tạo wrapper cho onSubmit để thêm Redux
  const handleCreateBoard = async (data: Board) => {
    try {
      const newBoard = { ...data, stared: false, ownerId: 1 };
      const res = await createBoard(newBoard);

      dispatch(addBoard(res.data));
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
