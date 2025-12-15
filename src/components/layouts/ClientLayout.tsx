import React from "react";

import { Layout, theme } from "antd";
import HeaderContent from "../common/Header";
import Sidebar from "../common/Sidebar";
import { Outlet } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <HeaderContent />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Sidebar />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: borderRadiusLG,
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
