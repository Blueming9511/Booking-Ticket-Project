import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ role, items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const selectedItem = items.find(item => currentPath === item.path);
    console.log(selectedItem)
    return selectedItem ? [String(selectedItem.key)] : [];
  };

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    top: 85,
    left: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapse}
      breakpoint="md"
      onBreakpoint={() => setCollapsed(false)}
      className="rounded-2xl p-2 pt-10 mt-6"
      style={siderStyle}
    >
      <Menu
        theme="light"
        mode="vertical"
        className="border-0 shadow-none"
        style={{ borderInlineEnd: 'none' }}
        selectedKeys={getSelectedKeys()}
        items={items.map(item => ({
          key: String(item.key),
          icon: item.icon,
          label: item.label,
          onClick: () => handleMenuClick(item),
        }))}
      />
    </Sider>
  );
};

export default Sidebar;