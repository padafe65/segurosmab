import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">MiPlataforma</Link>
      </div>

      <div className="nav-buttons">
        <Link to="/">Inicio</Link>
        <Link to="/login">Ingresar</Link>
        <Link to="/registrar">Registrarse</Link>
      </div>
    </nav>
  );
}
