import React from "react";
import { Route, Router, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import LayoutAdmin from "../components/layouts/LayoutAdmin";
import Users from "../pages/admin/Users";
import Booking from "../pages/admin/Bookings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutAdmin />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Booking />} />
        <Route path="users" element={<Users />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
