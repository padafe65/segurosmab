import React, { useContext } from "react";
import { AuthContext } from "../contexto/AuthContext";

export default function UserProfile(): JSX.Element {
  const auth = useContext(AuthContext)!;
  const user = auth.user;

  if (!user) return <div>No autenticado</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2>Mis Datos</h2>
      <table>
        <tbody>
          <tr><td>Nombre</td><td>{user.user_name}</td></tr>
          <tr><td>Documento</td><td>{user.documento}</td></tr>
          <tr><td>Email</td><td>{user.email}</td></tr>
          <tr><td>Dirección</td><td>{user.direccion}</td></tr>
          <tr><td>Ciudad</td><td>{user.ciudad}</td></tr>
          <tr><td>Teléfono</td><td>{user.telefono}</td></tr>
          <tr><td>Fecha nacimiento</td><td>{user.fecha_nacimiento?.toString()}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
