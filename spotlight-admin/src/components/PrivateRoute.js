// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "store/useAuthStore";

function PrivateRoute({ children, roles }) {
  const { author, token } = useAuthStore();

  if (!token || !author) {
    return <Navigate to="/authentication/sign-in" />;
  }

  if (roles && !roles.includes(author.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default PrivateRoute;
