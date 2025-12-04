import { useNavigate } from "react-router-dom";

export default function Sidebar({ rol }: { rol: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/", { replace: true });
  };

  return (
    <aside
      style={{
        width: "220px",
        background: "#1565c0",
        color: "white",
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h3 style={{ textAlign: "center" }}>Panel {rol}</h3>

      {rol === "estudiante" && (
        <>
          <button
            style={styles.button}
            onClick={() => alert("Ver mis datos")}
          >
            📄 Mis Datos
          </button>
        </>
      )}

      {rol === "profesor" && (
        <>
          <button
            style={styles.button}
            onClick={() => alert("Ver estudiantes")}
          >
            👥 Ver Estudiantes
          </button>
          <button
            style={styles.button}
            onClick={() => alert("Mi información")}
          >
            📄 Mi Información
          </button>
        </>
      )}

      <div style={{ flexGrow: 1 }}></div>

      <button onClick={handleLogout} style={styles.logout}>
        🚪 Cerrar sesión
      </button>
    </aside>
  );
}

const styles = {
  button: {
    background: "#1e88e5",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  logout: {
    background: "#e53935",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
