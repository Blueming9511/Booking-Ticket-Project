import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'


const Layout_admin = () => {
  return (
    <div className='flex w-full  h-screen'>
      <Sidebar />
      <main className='w-full'>
        <Header />
        <div className='p-5'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout_admin
