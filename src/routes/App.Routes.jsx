import { CssBaseline } from "@mui/material";
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./Protected.Routes";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuthGuard from "../hook/useAuthGuard";

import AdminRoutes from "./Admin.Routes";
import PickerRoutes from "./Picker.Routes";
import UserRoutes from "./User.Routes";
import PublicRoutes from "./Public.Routes";
import NotFound from "../pages/notfound/NotFoundPage";
import Unauthorized from "../pages/unauthorized/UnauthorisePage";
import Loading from "../components/Loading";
import { ROLES } from "../utils/roleConstants";
import ScrollToTop from "../components/ScrollToTop"; // ✅ Import it

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuthGuard();

  return (
    <Router>
      <CssBaseline />
      <ScrollToTop /> {/* ✅ Add this right after Router */}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 🌐 Public Website */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* 🔒 Protected Dashboard Layout */}
          <Route element={<DashboardLayout role={role} />}>
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.ADMIN]}
                  userRole={role}
                />
              }
            >
              <Route path="/app/admin/*" element={<AdminRoutes />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.PICKER]}
                  userRole={role}
                />
              }
            >
              <Route path="/app/picker/*" element={<PickerRoutes />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={[ROLES.USER]}
                  userRole={role}
                />
              }
            >
              <Route path="/app/user/*" element={<UserRoutes />} />
            </Route>
          </Route>

          {/* 🔒 Misc */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
