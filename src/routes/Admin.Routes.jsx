import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.Routes";
import AdminDashboard from "../pages/admin/Admin.Dashboard";
import TestingPage from "../pages/testingScreen/TestingPage";

const AdminRoutes = ({ isAuthenticated, role }) => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["admin"]}
            userRole={role}
          />
        }
      >
        <Route key='adminDashboard' path="dashboard" element={<AdminDashboard />} />
        <Route key='settings' path="settings" element={<TestingPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
