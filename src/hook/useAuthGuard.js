import { useSelector } from 'react-redux';

const useAuthGuard = () => {
  // Check user authentication status

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const role = useSelector((state) => state.user.role);
  // const role = isAdmin ? "admin" : "user"
  console.log("useAuthGuard - user:", user);
  console.log("useAuthGuard - role:", role);
  console.log("useAuthGuard - isAuthenticated:", isAuthenticated);
  console.log("useAuthGuard - isAdmin:", isAdmin);
  
  return {isAuthenticated, isAdmin, role};
};

export default useAuthGuard;
