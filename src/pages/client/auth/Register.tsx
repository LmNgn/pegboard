import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../../assets/google.png";
import trenoLogo from "../../../assets/treno.png";
import { RegisterSchema } from "../../../schema/authSchema";
import type { AuthInfo } from "../../../types/auth";
import renderError from "../../../utils/renderError";
import { registerApi } from "../../../api/auth";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: zodResolver(RegisterSchema) });
  const nav = useNavigate();
  const isAgreed = watch("terms");

  const onSubmit = async (data: AuthInfo) => {
    try {
      const { terms, confirmPassword, ...userInfo } = data;
      await registerApi(userInfo);
      toast.success("Đăng ký thành công");
      reset();
      nav("/login");
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-bl from-white via-blue-100 to-blue-800 bg-[length:200%_200%] animate-gradient">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-8">
          <img src={trenoLogo} alt="Treno" className="h-16 w-16 mr-2" />
          <p className="text-5xl font-bold">Treno</p>
        </div>
        {/*  Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xl font-bold text-gray-800">Tạo tài khoản mới</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username  */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên người dùng
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  placeholder="username"
                />
              </div>
              {renderError(errors, "username")}
            </div>

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
                  {...register("email")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {renderError(errors, "email")}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
              {renderError(errors, "password")}
            </div>

            {/* Confirm Pass */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
              {renderError(errors, "confirmPassword")}
            </div>

            {/* Tos */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                {...register("terms")}
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700 cursor-pointer"
              >
                Tôi đồng ý với{" "}
                <a
                  href="/policy"
                  className="text-blue-600 hover:text-blue-500 font-medium transition"
                >
                  Điều khoản và dịch vụ
                </a>
              </label>
            </div>

            {/* Submit  */}
            <button
              type="submit"
              disabled={!isAgreed}
              className={`w-full py-3 rounded-lg font-medium transition ${
                isAgreed
                  ? "bg-blue-400 hover:bg-blue-600 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Đăng ký
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
            >
              <img src={googleLogo} alt="Google" className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              Đăng nhập
            </a>
          </p>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-gray-500 px-4">
          Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo
          mật
        </p>
      </div>
    </div>
  );
};

export default Register;
