import type { MenuProps } from "antd";
import { Button, Drawer, Dropdown, Typography } from "antd";
import {
  Languages,
  LogOut,
  Menu as MenuIcon,
  PaintBucket,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { useLogout } from "../../utils/handleLogout";
import Sidebar from "../common/Sidebar";
import { CreateBoardModal } from "./BoardModal";
import LogoutModal from "./LogoutModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import BoardSearch from "./BoardSearch";
import toast from "react-hot-toast";

const { Text } = Typography;

const TrenoHeader = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logout = useLogout();
  const { user } = useSelector((state: RootState) => state.user);
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
    },
    {
      key: "theme",
      label: "Chủ đề",
      icon: <PaintBucket className="w-4 h-4" />,
      children: [
        { key: "theme-light", label: "Sáng" },
        { key: "theme-dark", label: "Tối" },
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
    <header className="bg-blue-600 px-3 py-2">
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<MenuIcon className="text-white" />}
            className="md:hidden"
            onClick={() => setShowSidebar(true)}
          />
          <span className="text-white font-bold text-xl">Treno</span>
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

          {/* Chuyển tragn */}
          <Button
            type="text"
            icon={<Search className="text-white" />}
            className="md:hidden"
            onClick={() => toast.success("chuyển sang trang tìm kiếm")}
          />

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
          <Button
            type="text"
            shape="circle"
            icon={<User className="text-white" />}
          />
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
    </header>
  );
};

export default TrenoHeader;
