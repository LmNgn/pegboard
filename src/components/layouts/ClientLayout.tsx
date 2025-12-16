import React, { useState } from "react";
import { Layout, theme, Drawer } from "antd";
import HeaderContent from "../common/Header";
import Sidebar from "../common/Sidebar";
import { Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderContent />

      <Layout>
        {/* Sidebar desktop */}
        <Sider
          width={200}
          collapsedWidth={0}
          style={{ background: colorBgContainer }}
          className="hidden md:block"
        >
          <Sidebar />
        </Sider>

        {/* Nút mở menu mobile */}

        {/* Drawer mobile */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Sidebar />
        </Drawer>

        {/* Content */}
        <Layout style={{ padding: "0 24px 24px", flex: 1 }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "100%",
              borderRadius: borderRadiusLG,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
