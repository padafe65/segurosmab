import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectByRole() {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("roles"); // <- CORREGIDO

    if (!rol) {
      navigate("/", { replace: true });
      return;
    }

    if (rol === "user") {
      navigate("/dashboard-user", { replace: true });
    } 
    else if (rol === "admin") {
      navigate("/dashboard-admin", { replace: true });
    }
    else if (rol === "super_user") {
      navigate("/dashboard-super", { replace: true });
    }
    else {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>
      Redirigiendo...
    </p>
  );
}
