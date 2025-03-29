import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './admin/Header'
import { DashboardOutlined, BankOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons'

const providerItems = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Cinemas", path: "/cinemas", icon: <BankOutlined /> },
  { label: "Movies", path: "/movies", icon: <VideoCameraOutlined /> },
  { label: "Coupon", path: "/coupon", icon: <UserOutlined /> },
  { label: "Payment", path: "/payment", icon: <UserOutlined /> },
];

const LayoutProvider = () => {
  return (
    <div className='flex w-full max-h-fit'>
      <Sidebar role={"provider"} items={providerItems} />
      <main className='w-full'>
        <Header />
        <div className='p-5'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutProvider
