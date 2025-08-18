import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.Routes";
import AdminDashboard from "../pages/admin/dashboard/Admin.Dashboard";
import TestingPage from "../pages/testingScreen/TestingPage";
import AdminTrashRequest from "../pages/admin/trashrequest/Admin.TrashRequest";
import AdminPricing from "../pages/admin/pricing/Admin.Pricing";
import AdminTrashPicker from "../pages/admin/trashPicker/Admin.TrashPicker";
import AdminTrashRequestDetails from "../pages/admin/trashrequest/Admin.TrashRequestDetails";
import AdminTrashPickerClientList from "../pages/admin/Admin.TrashPickerClientList";
import { ROLES } from "../utils/roleConstants";

const AdminRoutes = ({ isAuthenticated, role }) => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={[ROLES.ADMIN]}
            userRole={role}
          />
        }
      >
        <Route
          key="adminDashboard"
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route path="trash-request" element={<AdminTrashRequest />} />
        <Route path="pickers-list" element={<AdminTrashPicker />} />
        <Route path="rates" element={<AdminPricing />} />

        {/* Example child route for TrashRequestPage */}
        <Route
          path="trash-request/details/:requestId"
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
