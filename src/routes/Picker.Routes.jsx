import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.Routes";
import ClientDashboard from "../pages/picker/Client.Dashboard";
import TrashPickerRequestListPage from "../pages/picker/TrashPickerRequestListPage";

const ClientRoutes = ({ isAuthenticated, role }) => {
  return (
    <Routes>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={["picker"]} userRole={role} />}>
        <Route key='clientDashboard' path="dashboard" element={<ClientDashboard />} />
        <Route path="trash-list" element={<TrashPickerRequestListPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
