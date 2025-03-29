import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './admin/Header'
import { DashboardOutlined, BankOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons'
const adminItems = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Movies", path: "/movies", icon: <VideoCameraOutlined /> },
  { label: "Cinemas", path: "/cinemas", icon: <BankOutlined /> },
  { label: "Users", path: "/users", icon: <UserOutlined /> },
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
