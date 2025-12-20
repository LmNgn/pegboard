import z from "zod";
export const LoginSchema = z.object({
  email: z
    .string({ message: "Email không được bỏ trống" })
    .email({ message: "Email không đúng định dạng" }),
  password: z
    .string({ message: "Mật khẩu không được bỏ trống" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .max(20, { message: "Mật khẩu không được quá 20 ký tự" }),
  remember: z.boolean().optional(),
});

export const RegisterSchema = z
  .object({
    username: z
      .string({ message: "Tên người dùng không được bỏ trống" })
      .min(6, { message: "Tên người dùng phải có ít nhất 6 ký tự" })
      .max(20, { message: "Tên người dùng không được quá 20 ký tự" }),
    email: z
      .string({ message: "Email không được bỏ trống" })
      .email({ message: "Email không đúng định dạng" }),
    password: z
      .string({ message: "Mật khẩu không được bỏ trống" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .max(20, { message: "Mật khẩu không được quá 20 ký tự" }),
    confirmPassword: z
      .string({ message: "Vui lòng nhập lại mật khẩu" })
      .min(8, { message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự" })
      .max(20, { message: "Xác nhận mật khẩu không được quá 20 ký tự" }),
    terms: z.literal(true, {
      message: "Bạn phải đồng ý với điều khoản và dịch vụ",
    }),
  })
  .refine((val) => val.confirmPassword === val.password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Mật khẩu hiện tại không được bỏ trống" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .max(20, { message: "Mật khẩu không được quá 20 ký tự" }),
    newPassword: z
      .string({ message: "Mật khẩu mới không được bỏ trống" })
      .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
      .max(20, { message: "Mật khẩu mới không được quá 20 ký tự" }),
    confirmPassword: z
      .string({ message: "Vui lòng xác nhận mật khẩu mới" })
      .min(8, { message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự" })
      .max(20, { message: "Xác nhận mật khẩu không được quá 20 ký tự" }),
  })
  .refine((val) => val.confirmPassword === val.newPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
