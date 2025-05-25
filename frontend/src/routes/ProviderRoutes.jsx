import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Dashboard from '../pages/provider/Dashboard'
import LayoutProvider from '../components/layouts/LayoutProvider'
import Cinemas from '../pages/provider/Cinemas'
import Movies from '../pages/provider/Movies'
import Coupon from '../pages/provider/Coupon'
import Payment from '../pages/provider/Payment'
import Screens from '../pages/provider/Screens'
import ShowTime from '../pages/provider/Showtime'
import Booking from '../pages/provider/Booking'

const ProviderRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutProvider />}>
        <Route index element={<Dashboard />} />
        <Route path='/cinemas' element={<Cinemas />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/coupons' element={<Coupon />} />
        <Route path='/payments' element={<Payment />} />
        <Route path='/showtimes' element={<ShowTime />} />
        <Route path='/screens' element={<Screens />} />
        <Route path='/bookings' element={<Booking />} />
        <Route path='/payments' element={<Payment />} />
      </Route>
    </Routes>
  )
}

export default ProviderRoutes
