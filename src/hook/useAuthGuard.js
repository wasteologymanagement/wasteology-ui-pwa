import { useSelector } from 'react-redux';

// const useAuthGuard = () => {
//   // Check user authentication status

//   const user = useSelector((state) => state.user.user);
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//   const isAdmin = useSelector((state) => state.user.isAdmin);
//   const role = useSelector((state) => state.user.role);
//   console.log("useAuthGuard - user:", user);
//   console.log("useAuthGuard - role:", role);
//   console.log("useAuthGuard - isAuthenticated:", isAuthenticated);
//   console.log("useAuthGuard - isAdmin:", isAdmin);
  
//   return {isAuthenticated, isAdmin, role};
// };

const useAuthGuard = () => {
  // Check user authentication status

  const auth = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const role = useSelector((state) => state.auth.role);
  console.log("useAuthGuard - user:", auth);
  console.log("useAuthGuard - role:", role);
  console.log("useAuthGuard - isAuthenticated:", isAuthenticated);
  console.log("useAuthGuard - isAdmin:", isAdmin);
  
  return {isAuthenticated, isAdmin, role};
};

export default useAuthGuard;
