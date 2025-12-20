import { PlusOutlined } from "@ant-design/icons";

interface CreateBoardCardProps {
  onClick: () => void;
}

const CreateBoardCard = ({ onClick }: CreateBoardCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 overflow-hidden min-h-30 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mx-auto mb-2 group-hover:scale-110 transition-transform">
          <PlusOutlined className="text-xl" />
        </div>
        <p className="text-blue-700 font-semibold">Tạo bảng mới</p>
      </div>
    </div>
  );
};

export default CreateBoardCard;
