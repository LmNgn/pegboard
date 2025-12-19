import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../features/userSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    nav("/login", { replace: true });
  };

  return handleLogout;
}
