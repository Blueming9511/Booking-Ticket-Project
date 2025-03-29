import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
      >
        <div
          className="logo"
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "💻" : "My App"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin/"),
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Movies",
              onClick: () => navigate("/admin/movies"),
            },
            {
              key: "3",
              icon: <BankOutlined />,
              label: "Cinemas",
              onClick: () => navigate("/admin/cinemas"),
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: "Users",
              onClick: () => navigate("/admin/users"),
            },
          ]}
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;
