import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardSelector() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    // Si no hay rol, redirige al login
    if (!rol) {
      navigate("/", { replace: true });
      return;
    }

    // Redirige según el rol
    if (rol === "estudiante") {
      navigate("/dashboard-estudiante", { replace: true });
    } else if (rol === "profesor") {
      navigate("/dashboard-profesor", { replace: true });
    } else {
      // Rol desconocido → vuelve al login
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      navigate("/", { replace: true });
    }
  }, [rol, navigate]);

  return <p>Cargando tu panel...</p>;
}


