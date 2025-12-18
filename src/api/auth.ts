import api from ".";
import type { AuthInfo } from "../types/auth";

export const checkEmailExists = async (email: string) => {
  const res = await api.get(`/users?email=${email}`);
  return res.data.length > 0;
};

export const registerApi = async (body: AuthInfo) => {
  const isEmailExist = await checkEmailExists(body.email);
  if (isEmailExist) {
    throw new Error("Email hoặc mật khẩu không hợp lê");
  }
  const res = await api.post("/register", body);
  console.log(res.data);
  return res.data;
};

export const loginApi = async (body: AuthInfo) => {
  const res = await api.post("/login", body);
  console.log(res.data);
  return res.data;
};
