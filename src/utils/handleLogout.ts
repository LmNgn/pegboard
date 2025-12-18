import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function handleLogout() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.clear();
    toast.success("Đăng xuất thành công");
    nav("/login");
  };

  return logout;
}
