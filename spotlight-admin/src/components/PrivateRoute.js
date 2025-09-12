import { Navigate } from "react-router-dom";
import useAuthStore from "store/useAuthStore";

function PrivateRoute({ children, roles }) {
  const { author, token, isInitializing } = useAuthStore();

  // Wait for auth initialization
  if (isInitializing) return null; // or a loading spinner

  // Not logged in
  if (!token || !author) return <Navigate to="/authentication/sign-in" />;

  // Check role access
  if (roles && !roles.includes(author.role)) return <Navigate to="/unauthorized" />;

  return children;
}

export default PrivateRoute;
