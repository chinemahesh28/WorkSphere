import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole, user }) => {

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
