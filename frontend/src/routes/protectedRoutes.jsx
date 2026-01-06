import { Navigate } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuthStore();

  //  Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  //  Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return children;
};

export default ProtectedRoute;
