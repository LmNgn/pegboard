import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/*  Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật
              khẩu
            </p>
          </div>

          {/* Form  */}
          <div className="space-y-6">
            {/* Email  */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Xác nhận
            </button>
          </div>

          {/* về đăng nhập */}
          <div className="mt-8">
            <a
              href="/login"
              className="flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-500 transition group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Quay về đăng nhập
            </a>
          </div>
        </div>

        {/* thông tin thêm */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 px-4">
            Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra thư
            mục spam
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
