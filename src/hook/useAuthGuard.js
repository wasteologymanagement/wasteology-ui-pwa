import { useSelector } from 'react-redux';

const useAuthGuard = () => {
  // Check user authentication status

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const role = isAdmin ? "admin" : "user"
  console.log("state : ", role);
  return {isAuthenticated, isAdmin, role};
};

export default useAuthGuard;
