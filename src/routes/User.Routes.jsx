import React from "react";
import { Route, Routes } from "react-router-dom";

import UserDashboard from "../pages/user/User.Dashboard";
import NotFound from "../pages/notfound/NotFoundPage";
import TrashBookings from "../pages/user/User.TrashBookings";
import SchedulePage from "../pages/user/schedulePickup/index";
import PricingPage from "../pages/user/User.Pricing";
import ProfilePage from "../pages/user/User.Profile2";
import { ROLES } from "../utils/roleConstants";
import ProtectedRoute from "./Protected.Routes";
import ScrapRatesPage from "../pages/user/User.Pricing";
import UserProfile from "../pages/user/User.ProfilePage";


const UserRoutes = ({ isAuthenticated, role }) => {
  return (
    <Routes>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={[ROLES.USER]} userRole={role} />}>
        {/* Default Dashboard */}
        <Route key="userDashboard" path="dashboard" element={<UserDashboard />} />
        {/* User Features */}
        <Route path="bookings" element={<TrashBookings />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="scrap-rates" element={<ScrapRatesPage />} /> */
        {/* <Route path="profile" element={<ProfilePage />} /> */}
        <Route path="profile" element={<UserProfile />} />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
