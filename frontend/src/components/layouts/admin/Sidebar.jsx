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
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
      <div className="logo" style={{ height: 32, margin: 16, color: "white", textAlign: "center", fontWeight: "bold" }}>
        {collapsed ? "💻" : "My App"}
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate("/admin/")}>Dashboard</Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => navigate("/admin/movies")}>Movies</Menu.Item>
        <Menu.Item key="3" icon={<BankOutlined />} onClick={() => navigate("/admin/cinemas")}>cinemas</Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />} onClick={() => navigate("/admin/users")}>Users</Menu.Item>
  
      </Menu>
    </Sider>
  );
};

export default Sidebar;