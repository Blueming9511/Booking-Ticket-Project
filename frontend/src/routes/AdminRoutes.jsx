import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'
import Cinemas from '../pages/admin/Cinemas'
import Movies from '../pages/admin/Movies'
import Users from '../pages/admin/Users'
import Screens from '../pages/admin/Screens.jsx'
import Bookings from '../pages/admin/Bookings.jsx'
import Payments from '../pages/admin/Payments.jsx'
import Showtimes from '../pages/admin/Showtimes.jsx'
import Coupons from '../pages/admin/Coupons.jsx'
import LayoutAdmin from '../components/layouts/LayoutAdmin.jsx'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutAdmin/>}>
        <Route index element={<Dashboard />} />
        <Route path='cinemas' element={<Cinemas />} />
        <Route path='movies' element={<Movies />} />
        <Route path='users' element={<Users />} />
        <Route path='screens' element={<Screens/>} />
        <Route path='bookings' element={<Bookings/>} />
        <Route path='payments' element={<Payments />} />
        <Route path='showtimes' element={<Showtimes />} />
        <Route path='coupons' element={<Coupons />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
