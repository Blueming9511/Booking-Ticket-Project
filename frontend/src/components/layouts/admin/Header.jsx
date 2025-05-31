import React from "react";
import { useLocation } from "react-router-dom";
import { Dropdown, Avatar, Menu } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";

const Header = () => {
  const location = useLocation();

  // Mapping paths to display names
  const pageTitles = {
    "/admin/": "Dashboard",
    "/admin/cinemas": "Cinemas",
    "/admin/movies": "Movies",
    "/admin/users": "Users",
  };

  const title = pageTitles[location.pathname] || "Admin Panel";

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile"
    },
    {
      key: "logout",
      label: "Logout"
    }
  ];

  return (
    <div className="flex justify-between items-center p-5 border-b border-gray-400 bg-white text-sm font-semibold ">
      <span>{title}</span>

      {/* User Dropdown */}
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ marginLeft: 8 }}>John Doe</span>
          <DownOutlined style={{ marginLeft: 8 }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default Header;
