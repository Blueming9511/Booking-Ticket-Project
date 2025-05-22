import React, { useState } from "react";
import { Divider, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ role, items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();


  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const url = role === "admin" ? "/admin" : "/provider";

  return (
    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={toggleCollapse} className="fixed">
      <div
        className="logo"
        style={{
          height: 32,
          margin: 16,
          color: "black",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;"
        }}
      >
        {collapsed ? "💻" : "My App"}
      </div>
      <Divider />
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items.map((item, index) => ({
          key: String(index + 1),
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(`${url}${item.path}`),
        }))}
      />
    </Sider>
  );
};

export default Sidebar;