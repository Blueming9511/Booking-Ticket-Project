import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import UserProfile from '../pages/user/UserProfile'
import Layout from '../components/layouts/Layout'
import HomePage from '../pages/user/HomePage'
import ErrorPage from '../pages/user/ErrorPage'
import BookingPage from '../pages/user/BookingPage'
import MovieDetails from '../pages/user/MovieDetails'
import MoviePage from '../pages/user/MoviePage'
import Register from '../pages/register'
import ForgotPassword from "../pages/ForgotPassword.jsx";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Login Page without Layout) */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

      {/* Protected Routes (Wrapped inside Layout) */}
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='/booking' element={<BookingPage />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/movies' element={<MoviePage />} />
        <Route path='/my-ticket' element={<UserProfile />} />
        <Route path='/my-history' element={<UserProfile />} />
        <Route path='/movie/:movieID' element={<MovieDetails />} />
        <Route path='/*' element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
