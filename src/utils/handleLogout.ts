import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const nav = useNavigate();
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
  toast.success("Đăng xuất thành công");
  nav("/login");
}
