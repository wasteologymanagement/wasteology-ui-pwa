import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectRole } from "../store/slice/userSlice";


const ProtectedRoute = ({ allowedRoles }) => {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute - allowedRoles:", allowedRoles);
  console.log("ProtectedRoute - userRole:", userRole);
  // console.log("useAuthGuard - isInitialized:", isInitialized);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
