import { Navigate } from "react-router-dom";
import useAuthStore from "store/authStore";

export default function ProtectedRoute({ roles, children }) {
  const { author, token } = useAuthStore();

  // If no token, force sign-in
  if (!token || !author) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // If role check is required
  if (roles && !roles.includes(author.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // ✅ Render the wrapped component
}
