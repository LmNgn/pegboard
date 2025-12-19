import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../../api/auth";
import googleLogo from "../../../assets/google.png";
import trenoLogo from "../../../assets/treno.png";
import { LoginSchema } from "../../../schema/authSchema";
import type { AuthInfo } from "../../../types/auth";
import renderError from "../../../utils/renderError";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(LoginSchema) });
  const nav = useNavigate();
  const onSubmit = async (data: AuthInfo) => {
    try {
      const res = await loginApi(data);
      console.log(res);
      dispatch(
        setUser({
          user: res.user,
          token: res.accessToken,
        })
      );
      // const storage = data.remember ? localStorage : sessionStorage;
      // storage.setItem("token", res.accessToken);
      // storage.setItem("email", res.user.email);
      toast.success("Đăng nhập thành công");
      reset();
      nav("/");
    } catch (error) {
      console.log(error);
      toast.error("Mật khẩu hoặc tài khoản không đúng");
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
          <div className="text-center mb-4">
            <p className="text-xl font-medium text-gray-800">
              Đăng nhập vào Treno
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <input
                  id="remember-account"
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-account"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-500 hover:text-blue-600 transition"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer">
              Đăng nhập
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

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              Đăng ký
            </a>{" "}
            ngay
          </p>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-gray-500 px-4">
          Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách
          bảo mật
        </p>
      </div>
    </div>
  );
};

export default Login;
