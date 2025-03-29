import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ role, items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const url = role === "admin" ? "/admin" : "/provider";

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
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
          items={items.map((item, index) => ({
            key: index.toString(),
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(`${url}${item.path}`),
          }))}
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;