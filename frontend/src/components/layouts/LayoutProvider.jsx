import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './admin/Header'
import { DashboardOutlined, BankOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons'

const providerItems = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Cinemas", path: "/cinemas", icon: <BankOutlined /> },
  { label: "Screens", path: "/screens", icon: <BankOutlined /> },
  { label: "Seats", path: "/seats", icon: <BankOutlined /> },
  { label: "Movies", path: "/movies", icon: <VideoCameraOutlined /> },
  { label: "Showtime", path: "/showtimes", icon: <UserOutlined /> },
  { label: "Coupon", path: "/coupons", icon: <UserOutlined /> },
  { label: "Payment", path: "/payments", icon: <UserOutlined /> },
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
