import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'
import LayoutProvider from '../components/layouts/LayoutProvider'
import Cinemas from '../pages/provider/Cinemas'
import Movies from '../pages/provider/Movies'
import Coupon from '../pages/provider/Coupon'
import Payment from '../pages/provider/Payment'
import Screens from '../pages/provider/Screens'
import Seat from '../pages/provider/Seat'

const ProviderRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutProvider />}>
        <Route index element={<Dashboard />} />
        <Route path='/cinemas' element={<Cinemas />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/coupon' element={<Coupon />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/screens' element={<Screens />} />
        <Route path='/seats' element={<Seat />} />
        <Route path='/payment' element={<Payment />} />
      </Route>{' '}
    </Routes>
  )
}

export default ProviderRoutes
