import z from "zod";

export const profileSchema = z.object({
  username: z
    .string({ message: "Tên người dùng không được bỏ trống" })
    .min(6, { message: "Tên người dùng phải có ít nhất 6 ký tự" })
    .max(20, { message: "Tên người dùng không được quá 20 ký tự" }),
  bio: z.string().optional(),
});
