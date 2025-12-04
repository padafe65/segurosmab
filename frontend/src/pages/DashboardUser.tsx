import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlipCard from "../components/FlipCard";
import "../App.css"; // 👈 IMPORTA TU CSS GLOBAL

export default function DashboardEstudiante() {
  const navigate = useNavigate();

  // const [nombre, setNombre] = useState<string | null>(null);
  // const [rol, setRol] = useState<string | null>(null);
  // const [correo, setCorreo] = useState<string | null>(null);
  // const [autenticado, setAutenticado] = useState(false);

  const [user, setUser] = useState({
  user_name: "",
  roles: "",
  email: "",
  isactive: false
});


  const [mostrarCard, setMostrarCard] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const nombreUsuario = localStorage.getItem("nombre");
  //   const rolUsuario = localStorage.getItem("rol");
  //   const correoUsuario = localStorage.getItem("correo");

  //   if (!token || rolUsuario !== "estudiante") {
  //     navigate("/", { replace: true });
  //     return;
  //   }

  //   setNombre(nombreUsuario);
  //   setRol(rolUsuario);
  //   setCorreo(correoUsuario);
  //   setAutenticado(true);
  // }, [navigate]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const nombreUsuario = localStorage.getItem("user_name") ?? "";
  const rolUsuario = localStorage.getItem("roles") ?? "";
  const correoUsuario = localStorage.getItem("email") ?? "";

  if (!token || rolUsuario !== "user") {
    navigate("/", { replace: true });
    return;
  }

  setUser({
    user_name: nombreUsuario,
    roles: rolUsuario,
    email: correoUsuario,
    isactive: true
  });
}, [navigate]);


  return (
    <div className="dashboard">
      
      {/* --- MENÚ IZQUIERDO --- */}
      <aside>
        <h2>Panel Del Usuario</h2>

        <button
          onClick={() => setMostrarCard(!mostrarCard)}
        >
          📄 Mis Datos
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          🚪 Salir
        </button>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main>
        <header>
          <h4>{user.isactive ? `👨‍🏫 Bienvenid@ ${user.user_name}` : "No autenticado"}</h4>
          {user.isactive && <span>✅ Sesión activa</span>}
        </header>

        {/* Contenedor de la FlipCard */}
        {mostrarCard && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
            className="fade-slide-in"  // 👈 ANIMACIÓN DE TU App.css
          >
            <FlipCard
              frontImage="/img/pizarra.gif"
              backImage="/img/datos.gif"
              frontText="Mis Datos"
              backText={{
                Nombre: user.user_name,
                Rol: user.roles,
                Correo: user.email,
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}