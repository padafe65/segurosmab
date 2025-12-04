import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }: any) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("roles");

  if (!token) return <Navigate to="/login" replace />;

  if (role && userRole !== role)
    return <Navigate to="/" replace />;

  return children;
}
