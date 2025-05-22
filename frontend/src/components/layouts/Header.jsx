import React from "react";
import { useLocation } from "react-router-dom";
import { Dropdown, Avatar, Menu } from "antd";
import { UserOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";

const Header = () => {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/cinemas": "Cinemas",
    "/screens": "Screens",
    "/movies": "Movies",
    "/showtimes": "Showtimes",
    "/coupons": "Coupons",
    "/payments": "Payments",
  };

  const pathname = location.pathname.replace("/admin", "") || "/";
  const title = pageTitles[pathname] || "Admin Panel";

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-end items-center px-6 py-4 border-gray-200 bg-white top-0 z-50">
      <Dropdown menu={userMenu} trigger={["click"]}>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
          <Avatar icon={<UserOutlined />} />
          <span className="text-sm font-medium text-gray-700">John Doe</span>
          <DownOutlined className="text-gray-500" />
        </div>
      </Dropdown>
    </div>
  );
};

export default Header;
