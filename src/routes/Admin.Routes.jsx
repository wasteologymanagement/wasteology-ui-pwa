import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.Routes";
import AdminDashboard from "../pages/admin/Admin.Dashboard";
import TestingPage from "../pages/testingScreen/TestingPage";
import AdminTrashRequest from "../pages/admin/Admin.TrashRequest";
import AdminPricing from "../pages/admin/Admin.Pricing";
import AdminTrashPicker from "../pages/admin/Admin.TrashPicker";
import AdminTrashRequestDetails from "../pages/admin/Admin.TrashRequestDetails";
import AdminTrashPickerClientList from "../pages/admin/Admin.TrashPickerClientList";

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
        <Route
          key="adminDashboard"
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route path="trash-list" element={<AdminTrashRequest />} />
        <Route path="pickers-list" element={<AdminTrashPicker />} />
        <Route path="rates" element={<AdminPricing />} />

        {/* Example child route for TrashRequestPage */}
        <Route
          path="trash-list/details/:trashRequestId"
          element={<AdminTrashRequestDetails />}
        />{" "}
        <Route
          path="trash-pickers/:pickerId"
          element={<AdminTrashPickerClientList />}
        />
        <Route path="settings" element={<TestingPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
