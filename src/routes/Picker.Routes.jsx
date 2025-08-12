import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Protected.Routes";
import ClientDashboard from "../pages/picker/Picker.Dashboard";
import TrashPickerRequestListPage from "../pages/picker/Picker.TrashRequestListPage";
import TrashRequestDetailPage from "../pages/picker/Picker.TrashRequestDetailPage";
import TrashPickerProfilePage from "../pages/picker/Picker.ProfilePage";
import ComingSoonPage from "../pages/comingSoon/ComingSoonPage";
import { ROLES } from "../utils/roleConstants";

const ClientRoutes = ({ isAuthenticated, role }) => {
  return (
    <Routes>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={[ROLES.PICKER]} userRole={role} />}>
        <Route key='clientDashboard' path="dashboard" element={<ClientDashboard />} />
        <Route path="trash-list" element={<TrashPickerRequestListPage />} />
        <Route path="trash-details/:trashRequestId" element={<TrashRequestDetailPage />} />
        <Route path="profile" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
