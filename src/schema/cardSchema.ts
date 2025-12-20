import { z } from "zod";

export const cardDetailSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  tags: z.array(z.string()).max(10, "Không được thêm quá 10 nhãn"),
  deadline: z.string().optional(),
  images: z.array(z.string()).max(1, "Không được tải lên quá 1 ảnh"),
  assignees: z.array(z.string()),
});

export type CardDetailFormData = z.infer<typeof cardDetailSchema>;
