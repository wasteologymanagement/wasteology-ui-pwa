import React from "react";
import { Route, Routes } from "react-router-dom";

import UserDashboard from "../pages/user/User.Dashboard";
import NotFound from "../pages/notfound/NotFoundPage";
import TrashBookings from "../pages/user/User.TrashBookings";
import SchedulePage from "../pages/user/schedulePickup/index";
import PricingPage from "../pages/user/User.Pricing";
import ProfilePage from "../pages/user/User.Profile";


const UserRoutes = () => {
  return (
    <Routes>
      {/* Default Dashboard */}
      <Route path="dashboard" element={<UserDashboard />} />

      {/* User Features */}
      <Route path="bookings" element={<TrashBookings />} />
      <Route path="schedule" element={<SchedulePage />} />
      <Route path="scrap-rates" element={<PricingPage />} /> */
      <Route path="/profile" element={<ProfilePage />} />

      {/* Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
