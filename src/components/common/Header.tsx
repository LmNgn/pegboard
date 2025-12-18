import { useState } from "react";
import {
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Languages,
  PaintBucket,
} from "lucide-react";
import Sidebar from "../common/Sidebar";
import { Drawer } from "antd";
import { CreateBoardModal } from "./BoardModal";

const TrelloHeader = () => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const createItems = [
    {
      key: "1",
      label: "Tạo bảng mới",
      onClick: () => setShowCreateBoardModal(true),
    },
    // {
    //   key: "2",
    //   label: "Tạo danh sách mới",
    //   onClick: () => console.log("Tạo danh sách mới"),
    // },
    // {
    //   key: "3",
    //   label: "Tạo thẻ mới",
    //   onClick: () => console.log("Tạo thẻ mới"),
    // },
  ];

  const profileItems = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <User className="w-4 h-4" />,
      onClick: () => console.log("Xem hồ sơ"),
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => console.log("Mở cài đặt"),
    },
    {
      key: "theme",
      label: "Chủ đề",
      icon: <PaintBucket className="w-4 h-4" />,
      onClick: () => console.log("Mở chủ đề"),
    },
    {
      key: "theme",
      label: "Ngôn ngữ",
      icon: <Languages className="w-4 h-4" />,
      onClick: () => console.log("Mở cài đặt"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => console.log("Đăng xuất"),
    },
  ];

  return (
    <header className="bg-blue-600 px-3 py-2">
      <div className="flex items-center w-full">
        {/* Logo + nút sidebar (dt) */}
        <div className="flex items-center gap-2">
          <button
            className="block md:hidden text-white p-2"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-white font-bold text-xl">Treno</span>
        </div>

        {/*  sidebar đt */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setShowSidebar(false)}
          open={showSidebar}
        >
          <Sidebar />
        </Drawer>

        {/* Search + Tạo ở giữa */}
        <div className="flex-1 flex justify-center items-center gap-3">
          {/* search desktop */}
          <div className="hidden md:flex max-w-md flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 bg-white/90 hover:bg-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Searhc mobile */}
          <button
            className="block md:hidden text-white p-2"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Nút tạo mới */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo mới</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCreateMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCreateMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {createItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        item.onClick();
                        setShowCreateMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-1 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center text-white font-semibold"
            >
              <User />
            </button>
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      User Name
                    </p>
                    <p className="text-xs text-gray-500">user@example.com</p>
                  </div>
                  {profileItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        item.onClick();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors text-sm text-gray-700 flex items-center gap-3"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/*  search đt  */}
      {showMobileSearch && (
        <div className="mt-2 md:hidden">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-3 pr-4 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
          />
        </div>
      )}
      {/* tạo modal */}
      <CreateBoardModal
        open={showCreateBoardModal}
        onClose={() => setShowCreateBoardModal(false)}
      />
    </header>
  );
};

export default TrelloHeader;
