import api from ".";
import type { Board, BoardMember } from "../types/board";
import type { User } from "../types/user";

export const getBoardsApi = async () => {
  const { data } = await api.get<Board[]>(`/boards`);
  return data;
};

export const getBoard = async (id: number | string) => {
  const { data } = await api.get(`/boards/${id}`);
  return data;
};

export const createBoard = async (body: Board) => {
  const { data } = await api.post(`/boards`, body);
  return data;
};

export const updateBoardApi = async (id: number | string, body: Board) => {
  const { data } = await api.patch(`/boards/${id}`, body);
  return data;
};

export const deleteBoardApi = async (id: number | string) => {
  const { data } = await api.delete(`/boards/${id}`);
  return data;
};

export const searchBoards = async (keyword: string) => {
  const { data } = await api.get(`/boards/?q=${keyword}`);
  return data;
};
// Lấy bảng ưu tiên (starred)
export const getStarredBoardsApi = async () => {
  const { data } = await api.get<Board[]>(`/boards?starred=true`);
  return data;
};

// Lấy bảng của tôi (owner)
export const getMyBoardsApi = async (userId: number | string) => {
  const { data } = await api.get<Board[]>(`/boards?ownerId=${userId}`);
  return data;
};

// Lấy tất cả boards để lọc bảng khách
export const getGuestBoardsApi = async (userEmail: string) => {
  const { data } = await api.get<Board[]>(`/boards`);
  // Lọc boards mà user là thành viên (không phải owner)
  return data.filter((board) =>
    board.members?.some(
      (member: { email: string }) => member.email === userEmail
    )
  );
};

//Board share
export const addBoardMember = async (
  boardId: string,
  memberData: Omit<BoardMember, "id" | "addedAt">
) => {
  const { data } = await api.post(`/boards/${boardId}/members`, memberData);
  return data;
};

export const updateBoardMemberRole = async (
  boardId: string,
  memberId: string,
  role: number
) => {
  const { data } = await api.patch(`/boards/${boardId}/members/${memberId}`, {
    role,
  });
  return data;
};

export const removeBoardMember = async (boardId: string, memberId: string) => {
  const { data } = await api.delete(`/boards/${boardId}/members/${memberId}`);
  return data;
};

export const searchUsers = async (email: string) => {
  const { data } = await api.get<User[]>(`/users?email_like=${email}`);
  return data;
};
