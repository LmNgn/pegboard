"use client";

import { Modal, Button } from "antd";
import { Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import renderError from "../../utils/renderError";
import { ChangePasswordSchema } from "../../schema/authSchema";
import api from "../../api";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import bcrypt from "bcryptjs";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const { user } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    if (!user) {
      toast.error("Người dùng chưa đăng nhập");
      return;
    }

    setLoading(true);
    try {
      // Lấy thông tin user hiện tại
      const userRes = await api.get(`/users/${user.id}`);
      const currentUser = userRes.data;

      //kiểm tra trùng
      if (data.currentPassword === data.newPassword)
        throw new Error("Mật khẩu hiện mới không được trùng mật khẩu cũ");
      const isMatch = await bcrypt.compare(
        data.currentPassword,
        currentUser.password
      );
      // Cập nhật mật khẩu mới
      if (!isMatch) throw new Error("Mật khẩu hiện tại không đúng");
      await api.patch(`/users/${user.id}`, { password: data.newPassword });

      toast.success("Đổi mật khẩu thành công!");
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <span>Đổi mật khẩu</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Mật khẩu hiện tại */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              placeholder="••••••••"
            />
          </div>
          {renderError(errors, "currentPassword")}
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              placeholder="••••••••"
            />
          </div>
          {renderError(errors, "newPassword")}
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Xác nhận mật khẩu mới
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

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đổi mật khẩu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
