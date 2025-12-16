const HomePage = () => {
  return (
    <div className="min-h-screen flex items-start justify-center p-4 items-top">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        {/* Icon hoặc hình minh hoạ */}
        <div className="text-6xl mb-4">🐺</div>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Theo dõi và cập nhật
        </h1>

        {/* Mô tả */}
        <p className="text-gray-600 text-sm mb-6">
          Mời mọi người vào bảng và thẻ, để lại nhận xét, thêm ngày hết hạn và
          chúng tôi sẽ hiển thị hoạt động quan trọng nhất ở đây.
        </p>

        {/* Nút hành động */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">
          Bắt đầu ngay
        </button>
      </div>
    </div>
  );
};

export default HomePage;
