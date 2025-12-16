import z from "zod";

export const boardSchema = z.object({
  title: z.string().min(3, "Tên bảng phải ít nhất 3 ký tự"),
  description: z.string().optional(),
});
