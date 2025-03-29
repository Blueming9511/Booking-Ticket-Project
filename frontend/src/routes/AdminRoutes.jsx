import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'
import Layout_admin from '../components/layouts/LayoutAdmin'
import Cinemas from '../pages/admin/Cinemas'
import Movies from '../pages/admin/Movies'
import Users from '../pages/admin/Users'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutAdmin/>}>
        <Route index element={<Dashboard />} />
        <Route path='/cinemas' element={<Cinemas />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/users' element={<Users />} />
      </Route>{' '}
    </Routes>
  )
}

export default AdminRoutes
