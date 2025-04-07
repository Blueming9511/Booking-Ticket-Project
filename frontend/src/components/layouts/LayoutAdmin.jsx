import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './admin/Header'
import { DashboardOutlined, BankOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons'
const adminItems = [
  {label: "Dashboard", path: "/dashboard", icon: <DashboardOutlined />},
  {label: "User", path: "/users", icon: <UserOutlined />},
  {label: "Booking", path: "/bookings", icon: <UserOutlined />},
];

const LayoutAdmin = () => {
  return (
    <div className='flex w-full max-h-fit'>
      <Sidebar role={"admin"} items={adminItems} />
      <main className='w-full'>
        <Header />
        <div className='p-5'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutAdmin
