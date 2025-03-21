import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Login from '../pages/Login'

const AdminRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default AdminRoutes
