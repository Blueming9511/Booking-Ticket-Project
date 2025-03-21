import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import UserProfile from '../pages/user/UserProfile'
import Layout from '../components/layouts/Layout'
import HomePage from '../pages/user/HomePage'
import ErrorPage from '../pages/user/ErrorPage'

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Login Page without Layout) */}
      <Route path='/login' element={<Login />} />

      {/* Protected Routes (Wrapped inside Layout) */}
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='/user' element={<UserProfile />} />
        <Route path='/*' element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
