import z from "zod";
import { Role } from "../types/board";

export const boardSchema = z.object({
  title: z.string().min(3, "Tên bảng phải ít nhất 3 ký tự"),
  description: z.string().optional(),
});

export const boardMemberSchema = z.object({
  role: z.nativeEnum(Role),
});

export type BoardMemberFormData = {
  role: Role;
};
