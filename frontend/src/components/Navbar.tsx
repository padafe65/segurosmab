import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔒 Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">MiPlataforma</Link>
      </div>

      <div className="nav-buttons">
        <Link to="/">Inicio</Link>
        <Link to="/login">Ingresar</Link>
        <Link to="/registrar">Registrarse</Link>

        {/* 🔗 Rutas externas */}
        <div className="dropdown" ref={dropdownRef}>
          <button
            className="dropdown-btn"
            onClick={() => setOpen(!open)}
          >
            Rutas externas ▾
          </button>

          {open && (
            <div className="dropdown-content">
              <a href="https://www.fasecolda.com" target="_blank" rel="noopener noreferrer">
                🛡 Fasecolda
              </a>
              <a href="https://www.runt.com.co/consultaCiudadana/#/consultaVehiculo" target="_blank" rel="noopener noreferrer">
                🚗 RUNT
              </a>
              <a href="https://www.fcm.org.co/simit/#/home-public" target="_blank" rel="noopener noreferrer">
                🧾 SIMIT
              </a>
              <a href="https://www.igac.gov.co/" target="_blank" rel="noopener noreferrer">
                🏠 Catastro
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
