import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectByRole() {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");

    if (rol === "estudiante") {
      navigate("/dashboard-estudiante", { replace: true });
    } else if (rol === "profesor") {
      navigate("/dashboard-profesor", { replace: true });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "50px" }}>Redirigiendo...</p>;
}
