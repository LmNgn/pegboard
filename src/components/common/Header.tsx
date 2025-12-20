"use client";

import type { MenuProps } from "antd";
import { Button, Drawer, Dropdown, Typography } from "antd";
import {
  Languages,
  LogOut,
  MenuIcon,
  PaintBucket,
  Plus,
  Search,
  Settings,
  Trello,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLogout } from "../../utils/handleLogout";
import Sidebar from "../common/Sidebar";
import { CreateBoardModal } from "./BoardModal";
import LogoutModal from "./LogoutModal";
import ChangePasswordModal from "./ChangPasswordModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import BoardSearch from "./BoardSearch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const TrenoHeader = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const nav = useNavigate();
  const logout = useLogout();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleThemeChange = (key: string) => {
    if (key === "theme-light") {
      setIsDarkMode(false);
      toast.success("Đã chuyển sang giao diện sáng");
    } else if (key === "theme-dark") {
      setIsDarkMode(true);
      toast.success("Đã chuyển sang giao diện tối");
    }
  };

  /* tạo bảng */
  const createItems: MenuProps["items"] = [
    {
      key: "create-board",
      label: "Tạo bảng mới",
      onClick: () => setShowCreateBoardModal(true),
    },
  ];

  /*profile */
  const profileItems: MenuProps["items"] = [
    {
      key: "profile-info",
      label: (
        <div className="px-4 py-2">
          <Text strong>{user?.username}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email}
          </Text>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "settings",
      label: "Cài đặt cá nhân",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => setShowChangePasswordModal(true),
    },
    {
      key: "theme",
      label: (
        <span className="flex items-center gap-2">
          Chủ đề
          {isDarkMode ? (
            <Moon className="w-3 h-3" />
          ) : (
            <Sun className="w-3 h-3" />
          )}
        </span>
      ),
      icon: <PaintBucket className="w-4 h-4" />,
      children: [
        {
          key: "theme-light",
          label: (
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4" /> Sáng
            </span>
          ),
          onClick: () => handleThemeChange("theme-light"),
        },
        {
          key: "theme-dark",
          label: (
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4" /> Tối
            </span>
          ),
          onClick: () => handleThemeChange("theme-dark"),
        },
      ],
    },
    {
      key: "language",
      label: "Ngôn ngữ",
      icon: <Languages className="w-4 h-4" />,
      children: [
        { key: "lang-vi", label: "Tiếng Việt" },
        { key: "lang-en", label: "English" },
      ],
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => setShowLogoutModal(true),
    },
  ];

  return (
    <header className="bg-blue-600 dark:bg-gray-800 px-3 py-2 transition-colors">
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuIcon stroke="white" />}
              onClick={() => setShowSidebar(true)}
            />
          </div>
          <Button
            type="text"
            className="flex items-center gap-2 text-white! font-bold! text-xl!"
            icon={<Trello size={20} stroke="white" />}
            onClick={() => nav("/boards")}
          >
            Treno
          </Button>
        </div>

        {/* Sidebar mobile */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setShowSidebar(false)}
          open={showSidebar}
        >
          <Sidebar />
        </Drawer>

        {/* Tìm kiếm */}
        <div className="flex-1 flex justify-center items-center gap-3">
          <div className="hidden md:block w-full max-w-md">
            <BoardSearch />
          </div>

          {/* Chuyển trang */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={<Search size={25} stroke="white" />}
              className="hover:bg-white/10"
              onClick={() => toast.success("chuyển sang trang tìm kiếm")}
            />
          </div>

          {/* Create dropdown */}
          <Dropdown menu={{ items: createItems }} trigger={["click"]}>
            <Button type="primary" icon={<Plus className="w-4 h-4" />}>
              <span className="hidden sm:inline">Tạo mới</span>
            </Button>
          </Dropdown>
        </div>

        {/*dropdown Profile */}
        <Dropdown
          menu={{ items: profileItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" shape="circle" icon={<User stroke="white" />} />
        </Dropdown>
      </div>

      {/* Modals */}
      <CreateBoardModal
        open={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
      />
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
      <ChangePasswordModal
        open={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </header>
  );
};

export default TrenoHeader;
