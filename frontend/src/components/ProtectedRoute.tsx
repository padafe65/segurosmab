import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowed = [],
}: {
  children: JSX.Element;
  allowed?: string[];
}) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("roles"); // <- CORREGIDO

  if (!token) return <Navigate to="/" replace />;

  if (allowed.length > 0 && !allowed.includes(rol || "")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
