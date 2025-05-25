import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import {
  DashboardOutlined,
  BankOutlined,
  VideoCameraOutlined,
  UserOutlined,
  GiftOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'
import { MdOutlineMeetingRoom, MdTheaters } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { PiSlideshowLight } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";
import { Layout } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import dayjs from "dayjs"

const { Content } = Layout;

const items = [
  { key: 1, label: "Dashboard", path: "/admin/", icon: <DashboardOutlined /> },
  { key: 2, label: "User", path: "/admin/users", icon: <UserOutlined /> },
  { key: 3, label: "Cinemas", path: "/admin/cinemas", icon: <MdTheaters /> },
  { key: 4, label: "Screens", path: "/admin/screens", icon: <MdOutlineMeetingRoom /> },
  { key: 5, label: "Movies", path: "/admin/movies", icon: <IoVideocamOutline /> },
  { key: 6, label: "Showtime", path: "/admin/showtimes", icon: <PiSlideshowLight /> },
  { key: 7, label: "Coupon", path: "/admin/coupons", icon: <GiftOutlined /> },
  { key: 8, label: "Booking", path: "/admin/bookings", icon: <TbMoneybag /> },
  { key: 9, label: "Payment", path: "/admin/payments", icon: <CreditCardOutlined /> },
];

const LayoutAdmin = () => {
  return (
    <>
      <div className='min-h-15'>
        <Header />
      </div>
      <Layout className="min-h-screen bg-gray-100">
        <Sidebar role={"admin"} items={items} />
        <Layout>

          <Content className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-screen" id='shadow-content'>
              <Outlet />
            </div>
          </Content>

          <Footer className="bg-white mt-4 px-4 py-6 text-center text-sm text-gray-500">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
              <div>
                © {dayjs().format("YYYY")} Movie Management Platform. All rights reserved.
              </div>
              <div>
                <span className="text-gray-400 mr-1">Last updated:</span>
                <span className="font-medium text-gray-600">{dayjs().format("DD/MM/YYYY HH:mm")}</span>
              </div>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </>

  )
}

export default LayoutAdmin
