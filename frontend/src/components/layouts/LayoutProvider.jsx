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
import { Layout } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import dayjs from "dayjs"

const { Content } = Layout;

const providerItems = [
  { key: 1, label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { key: 2,label: "Cinemas", path: "/cinemas", icon: <BankOutlined /> },
  { key: 3,label: "Screens", path: "/screens", icon: <BankOutlined /> },
  { key: 4,label: "Movies", path: "/movies", icon: <VideoCameraOutlined /> },
  { key: 5,label: "Showtime", path: "/showtimes", icon: <UserOutlined /> },
  { key: 6,label: "Coupon", path: "/coupons", icon: <GiftOutlined /> },
  { key: 7,label: "Payment", path: "/payments", icon: <CreditCardOutlined /> },
];

const LayoutProvider = () => {
  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar role={"provider"} items={providerItems} />

      <Layout>
        <Header />

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
  )
}

export default LayoutProvider
