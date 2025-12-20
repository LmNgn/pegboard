import React from "react";

import { HomeOutlined, TableOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "1", icon: <TableOutlined />, label: <Link to="/boards">Bảng</Link> },
  { key: "2", icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
  // {
  //   key: "g1",
  //   label: "Các không gian làm việc",
  //   type: "group",
  //   children: [
  //     {
  //       key: "sub2",
  //       label: "Navigation Two",
  //       icon: <AppstoreOutlined />,
  //       children: [
  //         { key: "5", icon: <TableOutlined />, label: "Bảng" },
  //         { key: "6", icon: <SettingOutlined />, label: "Cài đặt" },
  //       ],
  //     },
  //   ],
  // },
];

const Sidebar: React.FC = () => {
  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
      style={{
        height: "100%",
        borderInlineEnd: 0,
      }}
    />
  );
};

export default Sidebar;
